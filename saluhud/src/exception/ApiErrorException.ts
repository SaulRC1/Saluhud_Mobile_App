export default class ApiErrorException extends Error
{
    httpCode: number;
    apiEndPoint: string;

    constructor(message: string, httpCode: number, apiEndPoint: string)
    {
        super(message);
        this.httpCode = httpCode;
        this.apiEndPoint = apiEndPoint;
        this.name = "ApiErrorException";
        Object.setPrototypeOf(this, ApiErrorException.prototype);
    }
}