import StandardButton from "@components/buttons/StandardButton";
import FormTextInput, { FormTextInputValidationResult } from "@components/inputs/FormTextInput";
import { AutoCapitalizeOptions } from "@components/inputs/FormTextInput";
import { useTranslation } from "react-i18next";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import "../../i18n.config";
import PhoneNumberInput from "@components/inputs/PhoneNumberInput";

export default function SignUpScreen()
{
    const { t } = useTranslation();
    
    return (
        <SafeAreaView style={signUpScreenStyle.mainView}>
            <ScrollView contentContainerStyle={signUpScreenStyle.scrollView}>

                <FormTextInput labelText={t("SIGN_UP_SCREEN_EMAIL_TEXT_INPUT_LABEL")} placeholder={t("SIGN_UP_SCREEN_EMAIL_TEXT_INPUT_PLACEHOLDER")}
                    formTextInputContainerStyle={signUpScreenStyle.formTextInputContainerStyle}
                    labelStyle={signUpScreenStyle.formTextInputLabelStyle} textInputStyle={signUpScreenStyle.formTextInputInputStyle} autoCapitalize={AutoCapitalizeOptions.None}
                    labelIcon={require("@resources/icons/email_icon.png")} labelIconStyle={signUpScreenStyle.labelIconStyle} validateFunction={validateUsername} mandatory={true}></FormTextInput>

                <FormTextInput labelText={t("SIGN_UP_SCREEN_NAME_TEXT_INPUT_LABEL")} placeholder={t("SIGN_UP_SCREEN_NAME_TEXT_INPUT_PLACEHOLDER")}
                    formTextInputContainerStyle={signUpScreenStyle.formTextInputContainerStyle}
                    labelStyle={signUpScreenStyle.formTextInputLabelStyle} textInputStyle={signUpScreenStyle.formTextInputInputStyle} autoCapitalize={AutoCapitalizeOptions.None}
                    validateFunction={validateUsername} mandatory={true}></FormTextInput>

                <FormTextInput labelText={t("SIGN_UP_SCREEN_SURNAME_TEXT_INPUT_LABEL")} placeholder={t("SIGN_UP_SCREEN_SURNAME_TEXT_INPUT_PLACEHOLDER")}
                    formTextInputContainerStyle={signUpScreenStyle.formTextInputContainerStyle}
                    labelStyle={signUpScreenStyle.formTextInputLabelStyle} textInputStyle={signUpScreenStyle.formTextInputInputStyle} autoCapitalize={AutoCapitalizeOptions.None}
                    validateFunction={validateUsername} mandatory={false}></FormTextInput>

                <PhoneNumberInput label={t("SIGN_UP_SCREEN_PHONE_NUMBER_INPUT_LABEL")} placeholder={t("SIGN_UP_SCREEN_PHONE_NUMBER_INPUT_PLACEHOLDER")}
                    mainViewStyle={signUpScreenStyle.phoneNumberInputMainView}></PhoneNumberInput>

                <FormTextInput labelText={t("SIGN_UP_SCREEN_USERNAME_TEXT_INPUT_LABEL")} placeholder={t("SIGN_UP_SCREEN_USERNAME_TEXT_INPUT_PLACEHOLDER")}
                    formTextInputContainerStyle={signUpScreenStyle.formTextInputContainerStyle}
                    labelStyle={signUpScreenStyle.formTextInputLabelStyle} textInputStyle={signUpScreenStyle.formTextInputInputStyle} autoCapitalize={AutoCapitalizeOptions.None}
                    labelIcon={require("@resources/icons/user_icon.png")} labelIconStyle={{/*height: '130%'*/ }} validateFunction={validateUsername} mandatory={true}></FormTextInput>

                <FormTextInput labelText={t("SIGN_UP_SCREEN_PASSWORD_TEXT_INPUT_LABEL")} placeholder={t("SIGN_UP_SCREEN_PASSWORD_TEXT_INPUT_PLACEHOLDER")}
                    formTextInputContainerStyle={signUpScreenStyle.formTextInputContainerStyle}
                    labelStyle={signUpScreenStyle.formTextInputLabelStyle} textInputStyle={signUpScreenStyle.formTextInputInputStyle} autoCapitalize={AutoCapitalizeOptions.None}
                    labelIcon={require("@resources/icons/password_icon.png")} labelIconStyle={{/*height: '130%'*/ }} secureTextEntry={true} validateFunction={validateUsername} mandatory={true}></FormTextInput>

                <FormTextInput labelText={t("SIGN_UP_SCREEN_CONFIRM_PASSWORD_TEXT_INPUT_LABEL")} placeholder={t("SIGN_UP_SCREEN_CONFIRM_PASSWORD_TEXT_INPUT_PLACEHOLDER")}
                    formTextInputContainerStyle={signUpScreenStyle.formTextInputContainerStyle}
                    labelStyle={signUpScreenStyle.formTextInputLabelStyle} textInputStyle={signUpScreenStyle.formTextInputInputStyle} autoCapitalize={AutoCapitalizeOptions.None}
                    labelIcon={require("@resources/icons/password_icon.png")} labelIconStyle={{/*height: '130%'*/ }} secureTextEntry={true} validateFunction={validateUsername} mandatory={true}></FormTextInput>

                <StandardButton title="Sign Up" onPress={() => { }} style={signUpScreenStyle.buttonStyle}></StandardButton>

                <StandardButton title="Go Back" onPress={() => { }}></StandardButton>

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
    }
});

function validateUsername(username: string) : FormTextInputValidationResult
{
    if(username.trim().length <= 0)
    {
        const validationResult: FormTextInputValidationResult  = {
            validationResult: false,
            errorMessage: "Debe de ingresar un nombre de usuario"
        };

        return validationResult;
    }

    const validationResult: FormTextInputValidationResult  = {
        validationResult: true,
        errorMessage: ""
    };

    return validationResult;
}