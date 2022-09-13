import { ExpirationCompleteEvent, Publisher, Subjects } from "@aranjit_ticketing/common";


export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    readonly subject = Subjects.ExpirationComplete;
}