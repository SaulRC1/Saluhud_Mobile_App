export default class ApiInformationResponse
{
    apiEndPoint: string;
    message: string;

    constructor(apiEndPoint: string, message: string)
    {
        this.apiEndPoint = apiEndPoint;
        this.message = message;
    }
}