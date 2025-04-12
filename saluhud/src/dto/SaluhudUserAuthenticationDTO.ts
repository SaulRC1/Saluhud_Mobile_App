export default class SaluhudUserAuthenticationDTO
{
    username: string;
    rawPassword: string;

    constructor(username: string, rawPassword: string)
    {
        this.username = username;
        this.rawPassword = rawPassword;
    }
}