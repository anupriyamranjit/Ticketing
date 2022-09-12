import { OrderStatus } from "./orders"
import mongoose from "mongoose";
import { Order } from "./orders";

interface TicketAttrs {
    id : string;
    title: string;
    price: number;
}

export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    isReserved() : Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs : TicketAttrs): TicketDoc
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        min: 0
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    toJSON: {
        transform(doc,ret){
            ret.id = ret._id
            delete ret._id
        }
    }
})

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket({
        _id : attrs.id,
        title: attrs.title,
        price: attrs.price
    });
}

ticketSchema.methods.isReserved = async function () {
    return !! await Order.findOne({
        ticket: this,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete
            ]
        }
    })

}

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket }