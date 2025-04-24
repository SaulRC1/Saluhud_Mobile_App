import StandardButton from "@components/buttons/StandardButton";
import FormTextInput, { AutoCapitalizeOptions, FormTextInputValidationResult } from "@components/inputs/FormTextInput";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { RootTabParamList } from "@root/App";
import i18next from "@root/i18n.config";
import ApiErrorException from "@src/exception/ApiErrorException";
import ApiErrorResponse from "@src/response/ApiErrorResponse";
import ApiInformationResponse from "@src/response/ApiInformationResponse";
import SaluhudUserValidator from "@src/validator/user/SaluhudUserValidator";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SaluhudMobileAppConfiguration from "@resources/saluhud_mobile_app_configuration.json";
import LoadingModal from "@components/modal/LoadingModal";
import InformationModal, { InformationModalVariant } from "@components/modal/InformationModal";
import SaluhudUserAuthenticationDTO from "@src/dto/SaluhudUserAuthenticationDTO";
import { useSaluhudMobileAppAuthenticationContext } from "@src/global/SaluhudMobileAppContext";

let saluhudUserValidator = new SaluhudUserValidator();

type LogInScreenNavigationProp = BottomTabNavigationProp<RootTabParamList, 'Log_In_Screen'>;

export default function LogInScreen()
{
    const navigation = useNavigation<LogInScreenNavigationProp>();
    const {height, width} = useWindowDimensions();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const saluhudLogoWidth = (width - 40); //20px padding left + 20px padding right
    const [loadingModalVisible, setLoadingModalVisible] = useState(false);
    const [informationModalVisible, setInformationModalVisible] = useState(false);
    const [informationModalMessage, setInformationModalMessage] = useState("");
    const [informationModalVariant, setInformationModalVariant] = useState(InformationModalVariant.ERROR);
    const saluhudMobileAppAuthenticationContext = useSaluhudMobileAppAuthenticationContext();

    const { t } = useTranslation();

    function validateUsername(username: string): FormTextInputValidationResult {
        const validationResult: FormTextInputValidationResult = {
            validationResult: true,
            errorMessage: ""
        };

        let usernameValidationFailure = saluhudUserValidator.validateUsername(username);

        if(usernameValidationFailure !== undefined)
        {
            validationResult.validationResult = false;
            validationResult.errorMessage = usernameValidationFailure.message;
        }

        return validationResult;
    }

    function validatePassword(password: string): FormTextInputValidationResult {
        const validationResult: FormTextInputValidationResult = {
            validationResult: true,
            errorMessage: ""
        };

        let passwordValidationFailure = saluhudUserValidator.validatePassword(password);

        if(passwordValidationFailure !== undefined)
        {
            validationResult.validationResult = false;
            validationResult.errorMessage = passwordValidationFailure.message;
        }

        return validationResult;
    }

    let loginButtonDisabled = !(validateUsername(username).validationResult === true && validatePassword(password).validationResult === true);

    async function loginUser(username: string, password: string) {
        console.log("Username: " + username + ", password: " + password);

        let saluhudUserLoginDTO = new SaluhudUserAuthenticationDTO(username, password);
        setLoadingModalVisible(true);

        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 60000);

            const response = await fetch("http://" + SaluhudMobileAppConfiguration.backendURL + SaluhudMobileAppConfiguration.userAuthenticationEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Accept-Language": i18next.language,
                    "X-API-KEY": SaluhudMobileAppConfiguration.apiKey
                },
                body: JSON.stringify(saluhudUserLoginDTO),
                signal: controller.signal
            });

            clearTimeout(timeout);

            if (!response.ok) {
                const apiErrorResponse: ApiErrorResponse = await response.json();
                throw new ApiErrorException(apiErrorResponse.errorMessage, response.status, apiErrorResponse.apiEndPoint);
            }

            const responseJSON = await response.json();

            setLoadingModalVisible(false);

            saluhudMobileAppAuthenticationContext.jwt = responseJSON.jwt;
            navigation.navigate("Home_Screen");
            
        } catch (error) {
            console.error(error);

            let errorMessage = i18next.t("USER_AUTHENTICATION_UNKNOW_ERROR", { ns: "login_screen_translations" });

            if (error instanceof Error) {
                switch (error.name) {
                    case "AbortError":
                        errorMessage = i18next.t("USER_AUTHENTICATION_NETWORK_TIMEOUT_ERROR", { ns: "login_screen_translations" });
                        break;
                    case "ApiErrorException":
                        errorMessage = error.message;
                        break;
                    default:
                        errorMessage = i18next.t("USER_AUTHENTICATION_UNKNOW_ERROR", { ns: "login_screen_translations" });
                        break;
                }
            }

            setLoadingModalVisible(false);
            setInformationModalVariant(InformationModalVariant.ERROR);
            setInformationModalMessage(errorMessage);
            setInformationModalVisible(true);
        }
    }
    
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>

            <LoadingModal visible={loadingModalVisible} message={t("LOADING_MODAL_LOGIN_IN_MESSAGE", { ns: "login_screen_translations" })}/>
            <InformationModal visible={informationModalVisible} message={informationModalMessage} acceptButtonText={t("ACCEPT_BUTTON_TEXT")} variant={informationModalVariant}
            acceptButtonOnPress={() => {setInformationModalVisible(false)}}/>

            <ScrollView contentContainerStyle={logInScreenStyles.mainView}>
                <Image style={[logInScreenStyles.saluhudLogo, { width: saluhudLogoWidth, height: saluhudLogoWidth }]} resizeMode={"contain"}
                    source={require("@resources/images/general/Saluhud_logo512x512.png")}></Image>

                <FormTextInput labelText={t("USERNAME_TEXT_FIELD_LABEL", {ns: "login_screen_translations"})} placeholder={t("USERNAME_TEXT_FIELD_PLACEHOLDER", {ns: "login_screen_translations"})}
                    formTextInputContainerStyle={logInScreenStyles.formTextInput}
                    autoCapitalize={AutoCapitalizeOptions.None}
                    labelIcon={require("@resources/icons/user_icon.png")} validateFunction={validateUsername} mandatory={true}
                    value={username} setValue={setUsername}></FormTextInput>

                <FormTextInput labelText={t("PASSWORD_FIELD_LABEL", {ns: "login_screen_translations"})} placeholder={t("PASSWORD_FIELD_PLACEHOLDER", {ns: "login_screen_translations"})}
                    formTextInputContainerStyle={logInScreenStyles.formTextInput}
                    autoCapitalize={AutoCapitalizeOptions.None}
                    labelIcon={require("@resources/icons/password_icon.png")} validateFunction={validatePassword} mandatory={true}
                    value={password} setValue={setPassword} secureTextEntry={true}></FormTextInput>

                <StandardButton title={t("LOGIN_BUTTON_TEXT", {ns: "login_screen_translations"})} onPress={() => {loginUser(username, password);}} 
                style={{ width: (width - 40), marginBottom: 20 }} disabled={loginButtonDisabled}></StandardButton>
                <Text style={logInScreenStyles.signUpText}>{t("NO_ACCOUNT_SUGGESTION_TEXT", {ns: "login_screen_translations"})}</Text>
                <Text style={logInScreenStyles.signUpPressableText} onPress={() => {navigation.navigate("Sign_Up_Screen");}}>
                    {t("SIGN_UP_TEXT", {ns: "login_screen_translations"})}
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const logInScreenStyles = StyleSheet.create({
    mainView:
    {
        //flex: 1,
        //justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 20
    },

    saluhudLogo:
    {
        backgroundColor: 'white',
        marginBottom: 20
    },

    formTextInput:
    {
        flex: 0,
        width: '100%',
        height: 85,
        marginBottom: 20
    },

    logInButton:
    {
        marginBottom: 20
    },

    signUpText:
    {
        fontSize: 16,
        color: 'black'
    },

    signUpPressableText:
    {
        fontSize: 16,
        color: '#a80a2e',
        fontWeight: '600'
    }
});