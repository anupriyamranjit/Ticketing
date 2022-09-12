import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@aranjit_ticketing/common';
import express, {Request, Response } from 'express'
import { body } from 'express-validator';
import { OrderCreatedPublisher } from '../../events/publishers/order-created-publisher';
import { Order } from '../../models/orders';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../nats-wrapper';


const EXPIRATION_WINDOW_SECONDS = 15 * 60;

const router = express.Router();

router.post('/api/orders',requireAuth, [ 
    body("ticketId")
    .not()
    .isEmpty()
    .withMessage("TicketId must be provided")
], validateRequest,
async (req: Request, res: Response) => {
    // Find the ticket the user is trying to order
    const ticket = await Ticket.findOne(req.body.ticketId)

    if(!ticket){
        throw new NotFoundError();
    }
    // Make sure ticket is not reversed
    const isReserved = await ticket.isReserved();
    if(isReserved){
        throw new BadRequestError("Ticket is already reserved")
    }
    // Calculate an expiration date for ticket
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order and save it to the database
    const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket
    })

    await order.save();

    // Publish an event saying that an order was created

    new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order.id,
        status: order.status,
        userId: order.userId,
        expiresAt: order.expiresAt.toISOString(),
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    })


    res.status(201).send(order);
})

export { router as newOrderRouter }