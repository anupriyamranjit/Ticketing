import { Listener, OrderCreatedEvent, Subjects } from "@aranjit_ticketing/common"
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";
import { queueGroupname } from "./queue-group-name";


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupname;
    async onMessage(data: OrderCreatedEvent["data"], msg: Message){
        console.log("expirationQueue adding to queue with delay")
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        console.log("Waiting this many milliseconds to process the job", delay);
        await expirationQueue.add({orderId : data.id}, {delay} );
        msg.ack();
    }
}