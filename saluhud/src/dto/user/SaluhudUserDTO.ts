export default class SaluhudUserDTO {
  username: string;
  email: string;
  name: string;
  surname: string;
  phoneNumber: string;

  constructor(username: string, email: string, name: string, surname: string, phoneNumber: string) {
    this.username = username;
    this.email = email;
    this.name = name;
    this.surname = surname;
    this.phoneNumber = phoneNumber;
  }
}
