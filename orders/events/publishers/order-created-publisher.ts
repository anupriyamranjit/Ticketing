import { Publisher, OrderCreatedEvent, Subjects } from "@aranjit_ticketing/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated
}
