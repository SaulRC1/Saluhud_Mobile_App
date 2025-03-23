import SaluhudUser from "@src/entity/SaluhudUser";
import ValidationFailure from "@src/validator/ValidationFailure";

export default class SaluhudUserValidationFailure implements ValidationFailure<SaluhudUser>
{
    readonly fieldName: string;
    readonly message: string;
    readonly fieldValue: any;
    
    constructor(fieldName: string, message: string, fieldValue: any)
    {
        this.fieldName = fieldName;
        this.message = message;
        this.fieldValue = fieldValue;
    }
}