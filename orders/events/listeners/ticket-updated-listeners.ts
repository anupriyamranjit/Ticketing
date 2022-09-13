import {
    Listener,
    Subjects,
    TicketUpdatedEvent,
  } from "@aranjit_ticketing/common";
  import { Message } from "node-nats-streaming";
  import { Ticket } from "../../models/ticket";
  import { queueGroupName } from "./queue-group-name";
  
  export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
  
    queueGroupName = queueGroupName;
  
    async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
      const ticket = await Ticket.findOne({id: data.id, version: data.version});
      if(!ticket){
        throw new Error("Ticket not found")
      }
      const {title, price} = data;
      ticket.set({ title, price });
      await ticket.save()

      console.log("Ticket Updated with id:", ticket.id)

      msg.ack()
    }
  }
  