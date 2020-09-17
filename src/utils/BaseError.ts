import { HttpStatusCode } from '../models/types';

class BaseError extends Error {
    public readonly httpCode: HttpStatusCode;

    public readonly type: string;

    public readonly details: string;

    constructor(httpCode: HttpStatusCode, details: string = '') {
        switch (httpCode) {
        case HttpStatusCode.BAD_REQUEST: {
            super('BAD REQUEST');
            this.httpCode = httpCode;
            break;
        }
        case HttpStatusCode.NOT_FOUND: {
            super('NOT FOUND');
            this.httpCode = httpCode;
            break;
        }
        case HttpStatusCode.CONFLICT: {
            super('CONFLICT');
            this.httpCode = httpCode;
            break;
        }
        case HttpStatusCode.INTERNAL_SERVER: {
            super('INTERNAL SERVER');
            this.httpCode = httpCode;
            break;
        }
        default: {
            super('INTERNAL SERVER');
            this.httpCode = HttpStatusCode.INTERNAL_SERVER;
            break;
        }
        }

        Object.setPrototypeOf(this, new.target.prototype);

        this.type = this.message;
        this.details = details;
        Error.captureStackTrace(this);
    }
}

export default BaseError;
