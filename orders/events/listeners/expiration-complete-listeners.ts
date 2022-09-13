import { ExpirationCompleteEvent, Listener, OrderStatus, Subjects } from "@aranjit_ticketing/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import { queueGroupName } from "./queue-group-name";

export class ExpirationCompleteListeners extends Listener<ExpirationCompleteEvent>{
    queueGroupName = queueGroupName;
    readonly subject = Subjects.ExpirationComplete;

    async onMessage(data: ExpirationCompleteEvent["data"], msg : Message){
        const order = await Order.findById(data.orderId).populate('ticket');
        if(!order){
            throw new Error("Order not found")
        }
        await order.set({status : OrderStatus.Cancelled});
        await order.save();

        await new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id,
                price: order.ticket.price

            }
        })
        msg.ack();
    }


}