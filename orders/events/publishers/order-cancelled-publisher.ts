import { Publisher, Subjects, OrderCancelledEvent } from "@aranjit_ticketing/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled
}