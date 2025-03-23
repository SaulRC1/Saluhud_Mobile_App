import SaluhudUserValidator from "@root/saluhud/src/validator/user/SaluhudUserValidator";
import i18next from "@root/i18n.config";

describe('testing SaluhudUserValidator', () => 
{
    test('empty username is not valid', () => 
    {
        let saluhudUserValidator = new SaluhudUserValidator();

        let validationResult = saluhudUserValidator.validateField("username", "    ");

        expect(validationResult).not.toBeUndefined();

        expect(validationResult?.message).toBe(i18next.t("EMPTY_USERNAME_ERROR_MESSAGE", {ns: "sign_up_screen_error_messages"}));
    });
    
    test('username is too short', () => 
    {
        let saluhudUserValidator = new SaluhudUserValidator();
    
        let validationResult = saluhudUserValidator.validateField("username", "a");
    
        expect(validationResult).not.toBeUndefined();
    
        expect(validationResult?.message).toBe(i18next.t("TOO_SHORT_USERNAME_ERROR_MESSAGE", { ns: "sign_up_screen_error_messages" }));
    });

    test('username is too long', () => 
    {
        let saluhudUserValidator = new SaluhudUserValidator();

        let validationResult = saluhudUserValidator.validateField("username", 
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
        
        expect(validationResult).not.toBeUndefined();
        
        expect(validationResult?.message).toBe(i18next.t("TOO_LONG_USERNAME_ERROR_MESSAGE", { ns: "sign_up_screen_error_messages" }));
    });

    test('username does not admit special characters aside from "_"', () => 
    {
        let saluhudUserValidator = new SaluhudUserValidator();
    
        let validationResult = saluhudUserValidator.validateField("username", "user45%%");
    
        expect(validationResult).not.toBeUndefined();
    
        expect(validationResult?.message).toBe(i18next.t("NOT_VALID_USERNAME_ERROR_MESSAGE", { ns: "sign_up_screen_error_messages" }));
    });

    test('username does not admit whitespaces', () => 
    {
        let saluhudUserValidator = new SaluhudUserValidator();
        
        let validationResult = saluhudUserValidator.validateField("username", "user45 altalea");
        
        expect(validationResult).not.toBeUndefined();
        
        expect(validationResult?.message).toBe(i18next.t("NOT_VALID_USERNAME_ERROR_MESSAGE", { ns: "sign_up_screen_error_messages" }));
    });
});