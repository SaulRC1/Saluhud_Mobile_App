import SaluhudUser from "@src/entity/SaluhudUser";
import Validator from "@src/validator/Validator";
import ValidationFailure from "@src/validator/ValidationFailure";
import SaluhudUserValidationFailure from "./SaluhudUserValidationFailure";
import IllegalArgumentException from "@src/exception/IllegalArgumentException";
import i18next from "@root/i18n.config";
import MethodNotFoundException from "@src/exception/MethodNotFoundException";

export default class SaluhudUserValidator implements Validator<SaluhudUser>
{
    validate(user: SaluhudUser) : Set<ValidationFailure<SaluhudUser>>
    {
        let validationFailures = new Set<ValidationFailure<SaluhudUser>>();

        let fields = Object.keys(user);

        fields.forEach((field) => 
        {
            let validationFailure = this.validateField(field, user[field as keyof SaluhudUser]);

            if(validationFailure !== undefined)
            {
                validationFailures.add(validationFailure);
            }
        });

        return validationFailures;
    }

    validateField(fieldName: string, fieldValue: any) : ValidationFailure<SaluhudUser> | undefined
    {
        let saluhudUserFields = Object.keys(new SaluhudUser("", "", "", "", "", ""));

        if(!saluhudUserFields.includes(fieldName))
        {
            throw new IllegalArgumentException("Field '" + fieldName + "' does not exist inside SaluhudUser class");
        }

        let methodName = "validate" + fieldName.charAt(0).toUpperCase() + fieldName.slice(1);

        if (typeof this[methodName as keyof this] === 'function') 
        {
            return (this[methodName as keyof this] as Function).apply(this, Array.isArray(fieldValue) ? fieldValue : [fieldValue]);
        } 
        else 
        {
          throw new MethodNotFoundException("Method '" + methodName + "' is not implemented within SaluhudUser class");
        }
    }

    validateName(name: string) : ValidationFailure<SaluhudUser> | undefined
    {
        if (name === undefined || name.trim().length <= 0) 
        {
            let errorMessage = i18next.t("EMPTY_FIRST_NAME_ERROR_MESSAGE", {ns: "sign_up_screen_error_messages"});
            return new SaluhudUserValidationFailure("name", errorMessage, name);
        }
    
        if(name.trim().length > 200)
        {
            let errorMessage = i18next.t("TOO_LONG_FIRST_NAME_ERROR_MESSAGE", {ns: "sign_up_screen_error_messages"});
            return new SaluhudUserValidationFailure("name", errorMessage, name);
        }
    
        let firstNameRegExp = new RegExp("^[\\p{L}\\s]+$", "u");
    
        if(firstNameRegExp.test(name) === false)
        {
            let errorMessage = i18next.t("NOT_VALID_FIRST_NAME_ERROR_MESSAGE", {ns: "sign_up_screen_error_messages"});
            return new SaluhudUserValidationFailure("name", errorMessage, name);
        }

        return undefined;
    }

    validateSurname(surname: string) : ValidationFailure<SaluhudUser> | undefined
    {
        //Surname is allowed to be empty
        if (surname === undefined || surname.trim().length <= 0) 
        {
            return undefined;
        }
    
        if(surname.trim().length > 200)
        {
            let errorMessage = i18next.t("TOO_LONG_LAST_NAME_ERROR_MESSAGE", {ns: "sign_up_screen_error_messages"});
            return new SaluhudUserValidationFailure("surname", errorMessage, surname);
        }
    
        let lastNameRegExp = new RegExp("^[\\p{L}\\s]+$", "u");
    
        if(lastNameRegExp.test(surname) === false)
        {
            let errorMessage = i18next.t("NOT_VALID_LAST_NAME_ERROR_MESSAGE", {ns: "sign_up_screen_error_messages"});
            return new SaluhudUserValidationFailure("surname", errorMessage, surname);
        }

        return undefined;
    }

    validatePassword(password: string) : ValidationFailure<SaluhudUser> | undefined
    {
        if (password === undefined || password.trim().length <= 0) 
        {
            let errorMessage = i18next.t("EMPTY_PASSWORD_ERROR_MESSAGE", {ns: "sign_up_screen_error_messages"});
    
            return new SaluhudUserValidationFailure("password", errorMessage, password);
        }
    
        if (password.trim().length > 32)
        {
            let errorMessage = i18next.t("TOO_LONG_PASSWORD_ERROR_MESSAGE", { ns: "sign_up_screen_error_messages" });
            return new SaluhudUserValidationFailure("password", errorMessage, password);
        }
    
        let passwordRegExp = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*\\-_]).{8,32}$");
    
        if (passwordRegExp.test(password) === false) 
        {
            let errorMessage = i18next.t("NOT_VALID_PASSWORD_ERROR_MESSAGE", { ns: "sign_up_screen_error_messages" });
            return new SaluhudUserValidationFailure("password", errorMessage, password);
        }

        return undefined;
    }

    validateEmail(email: string) : ValidationFailure<SaluhudUser> | undefined
    {
        if (email === undefined || email.trim().length <= 0) 
        {
            let errorMessage = i18next.t("EMPTY_EMAIL_ERROR_MESSAGE", {ns: "sign_up_screen_error_messages"});
            return new SaluhudUserValidationFailure("email", errorMessage, email);
        }
    
        if(email.trim().length > 200)
        {
            let errorMessage = i18next.t("TOO_LONG_EMAIL_ERROR_MESSAGE", {ns: "sign_up_screen_error_messages"});
            return new SaluhudUserValidationFailure("email", errorMessage, email);
        }
    
        let emailRegExp = new RegExp("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$");
    
        if(emailRegExp.test(email) === false)
        {
            let errorMessage = i18next.t("NOT_VALID_EMAIL_ERROR_MESSAGE", {ns: "sign_up_screen_error_messages"});
            return new SaluhudUserValidationFailure("email", errorMessage, email);
        }

        return undefined;
    }

    validatePhoneNumber(phoneNumber: string) : ValidationFailure<SaluhudUser> | undefined
    {
        //Phone number is allowed to be empty
        if(phoneNumber === undefined || phoneNumber.trim().length <= 0)
        {
            return undefined;
        }

        let phoneNumberRegExp = new RegExp("^(\\+(\\d{1,3}|\\d{1,3}-\\d{1,3})\\s\\d{4,32})?$");

        if (phoneNumberRegExp.test(phoneNumber) === false) 
        {
            let errorMessage = i18next.t("NOT_VALID_PHONE_NUMBER_ERROR_MESSAGE", { ns: "sign_up_screen_error_messages" });
            return new SaluhudUserValidationFailure("phoneNumber", errorMessage, phoneNumber);
        }

        return undefined;
    }

    validateUsername(username: string) : ValidationFailure<SaluhudUser> | undefined
    {
        if (username === undefined || username.trim().length <= 0) 
        {
            let errorMessage = i18next.t("EMPTY_USERNAME_ERROR_MESSAGE", {ns: "sign_up_screen_error_messages"});
    
            return new SaluhudUserValidationFailure("username", errorMessage, username);
        }
    
        if(username.trim().length < 2)
        {
            let errorMessage = i18next.t("TOO_SHORT_USERNAME_ERROR_MESSAGE", { ns: "sign_up_screen_error_messages" });
    
            return new SaluhudUserValidationFailure("username", errorMessage, username);
        }
    
        if (username.trim().length > 32) 
        {
            let errorMessage = i18next.t("TOO_LONG_USERNAME_ERROR_MESSAGE", { ns: "sign_up_screen_error_messages" });
    
            return new SaluhudUserValidationFailure("username", errorMessage, username);
        }
    
        let usernameRegExp = new RegExp("^\\w+$");
    
        if (usernameRegExp.test(username) === false) 
        {
            let errorMessage = i18next.t("NOT_VALID_USERNAME_ERROR_MESSAGE", { ns: "sign_up_screen_error_messages" });

            return new SaluhudUserValidationFailure("username", errorMessage, username);
        }

        return undefined;
    }
}