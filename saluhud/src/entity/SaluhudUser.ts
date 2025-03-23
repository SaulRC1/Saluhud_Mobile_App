export default class SaluhudUser
{
    username: string;
    password: string;
    email: string;
    name: string;
    surname: string;
    phoneNumber: string;

    constructor(username: string, password: string, email: string, name: string, surname: string, phoneNumber: string)
    {
        this.username = username;
        this.password = password;
        this.email = email;
        this.name = name;
        this.surname = surname;
        this.phoneNumber = phoneNumber;
    }
}