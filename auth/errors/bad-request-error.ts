import { CustomError } from "./custom-error";

export class BadRequestError extends CustomError {
    statusCode = 500;
    constructor(public reason : string){
        super(reason);

        // Extend built in class
        Object.setPrototypeOf(this, BadRequestError.prototype)
    }
    serializeErrors(){
        return [
            { message: this.reason }
        ]

    }
}