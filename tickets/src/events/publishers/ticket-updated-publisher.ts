import { Publisher, Subjects, TicketUpdatedEvent } from "@aranjit_ticketing/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
  }
  