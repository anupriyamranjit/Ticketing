import { NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from '@aranjit_ticketing/common';
import express, {Request, Response } from 'express'
import { Order } from '../../models/orders';

const router = express.Router();

router.get('/api/orders/:id',requireAuth,  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket');
    if(!order){
        throw new NotFoundError();
    }

    if(order.userId !== req.currentUser!.id){
        throw new NotAuthorizedError();
    }

    res.send(order);

})

export { router as showOrderRouter }