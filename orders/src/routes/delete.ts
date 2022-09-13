import { NotAuthorizedError, NotFoundError, OrderStatus, requireAuth } from '@aranjit_ticketing/common';
import express, {Request, Response } from 'express'
import { OrderCancelledPublisher } from '../../events/publishers/order-cancelled-publisher';
import { Order } from '../../models/orders';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete('/api/orders/:orderId',requireAuth,  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate("ticket");
    if(!order){
        throw new NotFoundError();
    }
    if(order.userId !== req.currentUser!.id){
        throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        ticket:{
            id: order.ticket.id,
            price: order.ticket.price
        }
    })

    res.status(204).send(order)



})

export { router as deleteOrderRouter }