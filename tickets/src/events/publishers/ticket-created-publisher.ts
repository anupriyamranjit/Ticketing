import { Publisher, Subjects, TicketCreatedEvent } from '@aranjit_ticketing/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
