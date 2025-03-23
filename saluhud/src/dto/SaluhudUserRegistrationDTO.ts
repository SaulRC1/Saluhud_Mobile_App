export default class SaluhudUserRegistrationDTO
{
    username: string;
    rawPassword: string;
    email: string;
    name: string;
    surname: string;
    phoneNumber: string;

    constructor(username: string, rawPassword: string, email: string, name: string, surname: string, phoneNumber: string)
    {
        this.username = username;
        this.rawPassword = rawPassword;
        this.email = email;
        this.name = name;
        this.surname = surname;
        this.phoneNumber = phoneNumber;
    }
}