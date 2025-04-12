import StandardButton from "@components/buttons/StandardButton";
import FormTextInput, { FormTextInputValidationResult } from "@components/inputs/FormTextInput";
import { AutoCapitalizeOptions } from "@components/inputs/FormTextInput";
import { useTranslation } from "react-i18next";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import "../../i18n.config";
import PhoneNumberInput from "@components/inputs/PhoneNumberInput";
import i18next from "../../i18n.config";
import SaluhudUserValidator from "@src/validator/user/SaluhudUserValidator";
import { useEffect, useState } from "react";
import SaluhudUser from "@src/entity/SaluhudUser";
import LoadingModal from "@components/modal/LoadingModal";
import SaluhudMobileAppConfiguration from "@resources/saluhud_mobile_app_configuration.json";
import SaluhudUserRegistrationDTO from "@src/dto/SaluhudUserRegistrationDTO";
import InformationModal, { InformationModalVariant } from "@components/modal/InformationModal";
import ApiErrorResponse from "@src/response/ApiErrorResponse";
import ApiErrorException from "@src/exception/ApiErrorException";
import ApiInformationResponse from "@src/response/ApiInformationResponse";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { RootTabParamList } from "@root/App";
import { useNavigation } from "@react-navigation/native";

let saluhudUserValidator = new SaluhudUserValidator();

type SignUpScreenNavigationProp = BottomTabNavigationProp<RootTabParamList, "Sign_Up_Screen">;

export default function SignUpScreen()
{
    const navigation = useNavigation<SignUpScreenNavigationProp>();
    const { t } = useTranslation();

    const [loadingModalVisible, setLoadingModalVisible] = useState(false);
    const [informationModalVisible, setInformationModalVisible] = useState(false);
    const [informationModalMessage, setInformationModalMessage] = useState("");
    const [informationModalVariant, setInformationModalVariant] = useState(InformationModalVariant.ERROR);

    async function onPressRegisterButton(saluhudUser: SaluhudUser) 
    {
        console.log("Registrando usuario...");

        let saluhudUserRegistrationDTO = new SaluhudUserRegistrationDTO(saluhudUser.username, saluhudUser.password, 
            saluhudUser.email, saluhudUser.name, saluhudUser.surname, saluhudUser.phoneNumber);
        setLoadingModalVisible(true);

        try
        {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 60000);

            const response = await fetch("http://" + SaluhudMobileAppConfiguration.backendURL + SaluhudMobileAppConfiguration.userRegistrationEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Accept-Language": i18next.language
                },
                body: JSON.stringify(saluhudUserRegistrationDTO),
                signal: controller.signal
            });

            clearTimeout(timeout);

            if (!response.ok) 
            {
                const apiErrorResponse: ApiErrorResponse = await response.json();
                throw new ApiErrorException(apiErrorResponse.errorMessage, response.status, apiErrorResponse.apiEndPoint);
            }

            const responseJSON : ApiInformationResponse = await response.json();

            setLoadingModalVisible(false);
            setInformationModalVariant(InformationModalVariant.SUCCESS);
            setInformationModalMessage(responseJSON.message);
            setInformationModalVisible(true);
        }
        catch(error)
        {
            console.error(error);

            let errorMessage = i18next.t("USER_REGISTRATION_UNKNOW_ERROR", {ns: "sign_up_screen_error_messages"});

            if(error instanceof Error)
            {
                switch (error.name)
                {
                    case "AbortError":
                        errorMessage = i18next.t("USER_REGISTRATION_NETWORK_TIMEOUT_ERROR", {ns: "sign_up_screen_error_messages"});
                        break;
                    case "ApiErrorException":
                        errorMessage = error.message;
                        break;
                    default:
                        errorMessage = i18next.t("USER_REGISTRATION_UNKNOW_ERROR", {ns: "sign_up_screen_error_messages"});
                        break;
                }
            }

            setLoadingModalVisible(false);
            setInformationModalVariant(InformationModalVariant.ERROR);
            setInformationModalMessage(errorMessage);
            setInformationModalVisible(true);
        }
    }

    const [emailValue, setEmailValue] = useState<string>("");
    const [firstNameValue, setFirstNameValue] = useState<string>("");
    const [lastNameValue, setLastNameValue] = useState<string>("");
    const [selectedCountryPrefix, setSelectedCountryPrefix] = useState("+34");
    const [phoneNumberValue, setPhoneNumberValue] = useState<string>("");
    const [usernameValue, setUsernameValue] = useState<string>("");
    const [passwordValue, setPasswordValue] = useState<string>("");
    const [confirmPasswordValue, setConfirmPasswordValue] = useState<string>("");

    function validateConfirmPassword(confirmPassword: string): FormTextInputValidationResult 
    {
        const validationResult: FormTextInputValidationResult = {
            validationResult: true,
            errorMessage: ""
        };

        let validationFailure = saluhudUserValidator.validatePassword(confirmPassword);

        if (validationFailure !== undefined) 
        {
            validationResult.validationResult = false;
            validationResult.errorMessage = validationFailure.message;

            return validationResult;
        }

        if (confirmPassword !== passwordValue) 
        {
            validationResult.validationResult = false;
            validationResult.errorMessage = i18next.t("CONFIRMATION_PASSWORD_DIFFERENT_FROM_PASSWORD", {ns: "sign_up_screen_error_messages"});
    
            return validationResult;
        }

        return validationResult;
    }

    function buildPhoneNumber(countryPrefix: string, phoneNumber: string) : string
    {
        if(countryPrefix === undefined || countryPrefix.trim().length === 0)
        {
            return "";
        }

        if(phoneNumber === undefined || phoneNumber.trim().length === 0)
        {
            return "";
        }

        return (countryPrefix + " " + phoneNumber);
    }

    function validatePhoneNumber(phoneNumber: string): FormTextInputValidationResult {
        const validationResult: FormTextInputValidationResult = {
            validationResult: true,
            errorMessage: ""
        };

        let validationFailure = saluhudUserValidator.validatePhoneNumber(buildPhoneNumber(selectedCountryPrefix, phoneNumber));
    
        if (validationFailure !== undefined) 
        {
            validationResult.validationResult = false;
            validationResult.errorMessage = validationFailure.message;
        }
        
        return validationResult;
    }

    let saluhudUser = new SaluhudUser(usernameValue, passwordValue, emailValue, firstNameValue, lastNameValue, buildPhoneNumber(selectedCountryPrefix, phoneNumberValue));

    console.log("SaluhudUser: ", saluhudUser);

    let saluhudUserValidationFailures = saluhudUserValidator.validate(saluhudUser);

    let registerButtonDisabled = (saluhudUserValidationFailures.size > 0) || (validateConfirmPassword(confirmPasswordValue).validationResult === false);

    return (
        <SafeAreaView style={signUpScreenStyle.mainView}>
            
            <View style={signUpScreenStyle.titleStyle}>
                <Text style={signUpScreenStyle.titleTextStyle}>{t("SIGN_UP_SCREEN_TITLE")}</Text>
            </View>

            <LoadingModal visible={loadingModalVisible} message={t("USER_REGISTRATION_LOADING_DIALOG_MESSAGE", { ns: "sign_up_screen_error_messages" })}/>
            <InformationModal visible={informationModalVisible} message={informationModalMessage} acceptButtonText={t("ACCEPT_BUTTON_TEXT")} variant={informationModalVariant}
            acceptButtonOnPress={() => {setInformationModalVisible(false)}}/>

            <ScrollView contentContainerStyle={signUpScreenStyle.scrollView}>

                <FormTextInput labelText={t("SIGN_UP_SCREEN_EMAIL_TEXT_INPUT_LABEL")} placeholder={t("SIGN_UP_SCREEN_EMAIL_TEXT_INPUT_PLACEHOLDER")}
                    formTextInputContainerStyle={signUpScreenStyle.formTextInputContainerStyle}
                    labelStyle={signUpScreenStyle.formTextInputLabelStyle} textInputStyle={signUpScreenStyle.formTextInputInputStyle} autoCapitalize={AutoCapitalizeOptions.None}
                    labelIcon={require("@resources/icons/email_icon.png")} labelIconStyle={signUpScreenStyle.labelIconStyle} validateFunction={validateEmail} mandatory={true}
                    value={emailValue} setValue={setEmailValue}></FormTextInput>

                <FormTextInput labelText={t("SIGN_UP_SCREEN_NAME_TEXT_INPUT_LABEL")} placeholder={t("SIGN_UP_SCREEN_NAME_TEXT_INPUT_PLACEHOLDER")}
                    formTextInputContainerStyle={signUpScreenStyle.formTextInputContainerStyle}
                    labelStyle={signUpScreenStyle.formTextInputLabelStyle} textInputStyle={signUpScreenStyle.formTextInputInputStyle} autoCapitalize={AutoCapitalizeOptions.None}
                    validateFunction={validateFirstName} mandatory={true} value={firstNameValue} setValue={setFirstNameValue}></FormTextInput>

                <FormTextInput labelText={t("SIGN_UP_SCREEN_SURNAME_TEXT_INPUT_LABEL")} placeholder={t("SIGN_UP_SCREEN_SURNAME_TEXT_INPUT_PLACEHOLDER")}
                    formTextInputContainerStyle={signUpScreenStyle.formTextInputContainerStyle}
                    labelStyle={signUpScreenStyle.formTextInputLabelStyle} textInputStyle={signUpScreenStyle.formTextInputInputStyle} autoCapitalize={AutoCapitalizeOptions.None}
                    validateFunction={validateLastName} mandatory={false} value={lastNameValue} setValue={setLastNameValue}></FormTextInput>

                <PhoneNumberInput label={t("SIGN_UP_SCREEN_PHONE_NUMBER_INPUT_LABEL")} placeholder={t("SIGN_UP_SCREEN_PHONE_NUMBER_INPUT_PLACEHOLDER")}
                    mainViewStyle={signUpScreenStyle.phoneNumberInputMainView} validateFunction={validatePhoneNumber} value={phoneNumberValue} setValue={setPhoneNumberValue}
                    countryPrefix={selectedCountryPrefix} setCountryPrefix={setSelectedCountryPrefix}></PhoneNumberInput>

                <FormTextInput labelText={t("SIGN_UP_SCREEN_USERNAME_TEXT_INPUT_LABEL")} placeholder={t("SIGN_UP_SCREEN_USERNAME_TEXT_INPUT_PLACEHOLDER")}
                    formTextInputContainerStyle={signUpScreenStyle.formTextInputContainerStyle}
                    labelStyle={signUpScreenStyle.formTextInputLabelStyle} textInputStyle={signUpScreenStyle.formTextInputInputStyle} autoCapitalize={AutoCapitalizeOptions.None}
                    labelIcon={require("@resources/icons/user_icon.png")} labelIconStyle={{/*height: '130%'*/ }} validateFunction={validateUsername} mandatory={true}
                    value={usernameValue} setValue={setUsernameValue}></FormTextInput>

                <FormTextInput labelText={t("SIGN_UP_SCREEN_PASSWORD_TEXT_INPUT_LABEL")} placeholder={t("SIGN_UP_SCREEN_PASSWORD_TEXT_INPUT_PLACEHOLDER")}
                    formTextInputContainerStyle={signUpScreenStyle.formTextInputContainerStyle}
                    labelStyle={signUpScreenStyle.formTextInputLabelStyle} textInputStyle={signUpScreenStyle.formTextInputInputStyle} autoCapitalize={AutoCapitalizeOptions.None}
                    labelIcon={require("@resources/icons/password_icon.png")} labelIconStyle={{/*height: '130%'*/ }} secureTextEntry={true} validateFunction={validatePassword} 
                    mandatory={true} value={passwordValue} setValue={setPasswordValue}></FormTextInput>

                <FormTextInput labelText={t("SIGN_UP_SCREEN_CONFIRM_PASSWORD_TEXT_INPUT_LABEL")} placeholder={t("SIGN_UP_SCREEN_CONFIRM_PASSWORD_TEXT_INPUT_PLACEHOLDER")}
                    formTextInputContainerStyle={signUpScreenStyle.formTextInputContainerStyle}
                    labelStyle={signUpScreenStyle.formTextInputLabelStyle} textInputStyle={signUpScreenStyle.formTextInputInputStyle} autoCapitalize={AutoCapitalizeOptions.None}
                    labelIcon={require("@resources/icons/password_icon.png")} labelIconStyle={{/*height: '130%'*/ }} secureTextEntry={true} validateFunction={validateConfirmPassword} 
                    mandatory={true} value={confirmPasswordValue} setValue={setConfirmPasswordValue}></FormTextInput>

                <StandardButton title={t("SIGN_UP_SCREEN_SIGN_UP_BUTTON_TITLE")} onPress={() => {onPressRegisterButton(saluhudUser)}} style={signUpScreenStyle.buttonStyle} disabled={registerButtonDisabled}></StandardButton>

                <StandardButton title={t("SIGN_UP_SCREEN_GO_BACK_BUTTON_TITLE")} onPress={() => {navigation.navigate("Log_In_Screen")}}></StandardButton>

            </ScrollView>

        </SafeAreaView>
    );
}

const signUpScreenStyle = StyleSheet.create
({
    mainView:
    {
        flex: 1,
        backgroundColor: 'white',
        //padding: 20
    },
    scrollView:
    {
        padding: 20
    },
    formTextInputLabelStyle:
    {
        
    },
    formTextInputInputStyle:
    {
        
    },
    formTextInputContainerStyle:
    {
        flex: 0,
        width: '100%',
        height: 85,
        marginBottom: 20
    },
    labelIconStyle:
    {
        height: '55%'
    },
    phoneNumberInputMainView: {
        width: '100%',
        height: 85,
        marginBottom: 20
    },
    buttonStyle:
    {
        marginBottom: 10
    },
    titleStyle:
    {
        backgroundColor: "#8f0c2e",
        padding: 10
    },
    titleTextStyle:
    {
        fontSize: 16,
        //lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
        textAlign: 'center'
    }
});



function validateEmail(email: string): FormTextInputValidationResult {
    const validationResult: FormTextInputValidationResult = {
        validationResult: true,
        errorMessage: ""
    };

    let validationFailure = saluhudUserValidator.validateEmail(email);

    if(validationFailure !== undefined)
    {
        validationResult.validationResult = false;
        validationResult.errorMessage = validationFailure.message;
    }

    //TODO: Check if the email is unique against the backend

    return validationResult;
}

function validateFirstName(firstName: string): FormTextInputValidationResult {
    const validationResult: FormTextInputValidationResult = {
        validationResult: true,
        errorMessage: ""
    };

    let validationFailure = saluhudUserValidator.validateName(firstName);

    if(validationFailure !== undefined)
    {
        validationResult.validationResult = false;
        validationResult.errorMessage = validationFailure.message;
    }

    return validationResult;
}

function validateLastName(lastName: string): FormTextInputValidationResult {
    const validationResult: FormTextInputValidationResult = {
        validationResult: true,
        errorMessage: ""
    };

    let validationFailure = saluhudUserValidator.validateSurname(lastName);

    if (validationFailure !== undefined) 
    {
        validationResult.validationResult = false;
        validationResult.errorMessage = validationFailure.message;
    }

    return validationResult;
}

function validateUsername(username: string): FormTextInputValidationResult {
    const validationResult: FormTextInputValidationResult = {
        validationResult: true,
        errorMessage: ""
    };

    let validationFailure = saluhudUserValidator.validateUsername(username);

    if(validationFailure !== undefined)
    {
        validationResult.validationResult = false;
        validationResult.errorMessage = validationFailure.message;
        return validationResult;
    }

    //TODO: Validate that the username is unique against the database

    return validationResult;
}

function validatePassword(password: string): FormTextInputValidationResult {
    const validationResult: FormTextInputValidationResult = {
        validationResult: true,
        errorMessage: ""
    };

    let validationFailure = saluhudUserValidator.validatePassword(password);

    if(validationFailure !== undefined)
    {
        validationResult.validationResult = false;
        validationResult.errorMessage = validationFailure.message;
    }

    return validationResult;
}