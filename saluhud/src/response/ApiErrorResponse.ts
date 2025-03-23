export default class ApiErrorResponse
{
    apiEndPoint: string;
    errorMessage: string;

    constructor(apiEndPoint: string, errorMessage: string)
    {
        this.apiEndPoint = apiEndPoint;
        this.errorMessage = errorMessage;
    }
}