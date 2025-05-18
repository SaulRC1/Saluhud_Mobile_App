import ReadonlyText from "@components/inputs/ReadonlyText";
import InformationModal, { InformationModalVariant } from "@components/modal/InformationModal";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { UserProfileScreenStackParamList } from "@root/App";
import { getSaluhudUserData } from "@src/api/SaluhudMobileAppApiService";
import SaluhudUserDTO from "@src/dto/user/SaluhudUserDTO";
import { useSaluhudMobileAppAuthenticationContext } from "@src/global/SaluhudMobileAppContext";
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Text, View, SafeAreaView, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import SaluhudMobileAppConfiguration from "@resources/saluhud_mobile_app_configuration.json";
import StandardDropdown from "@components/inputs/StandardDropdown";
import i18next from "i18next";
import StandardButton from "@components/buttons/StandardButton";

type UserProfileScreenNavigationProp = StackNavigationProp<UserProfileScreenStackParamList, "General_Settings_Screen">;

const GeneralSettingsScreen = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<UserProfileScreenNavigationProp>();
    let customHeadersMap = new Map<string, string>();
    const saluhudMobileAppAuthenticationContext = useSaluhudMobileAppAuthenticationContext();
    customHeadersMap.set(SaluhudMobileAppConfiguration.jwtHttpHeader, saluhudMobileAppAuthenticationContext.jwt);
    const [language, setLanguage] = useState("");
    const languageRef = useRef(language);

    const languagesData = [
        {label: t("GENERAL_SETTINGS_LANGUAGE_DROPDOWN_SPANISH_LABEL", { ns: "user_profile_screen_translations" }), value: "es"},
        {label: t("GENERAL_SETTINGS_LANGUAGE_DROPDOWN_ENGLISH_LABEL", { ns: "user_profile_screen_translations" }), value: "en"}
    ];

    useEffect(() => {
        setLanguage(i18next.language);
    }, []);

    useEffect(() => {
        languageRef.current = language;
    }, [language]);

    useEffect(() => {
        const unsubscribe = navigation.addListener("beforeRemove", () => {
            console.log(languageRef.current);
            i18next.changeLanguage(languageRef.current);
        });

        return unsubscribe;
    }, [navigation]);
    
    return(
        <SafeAreaView style={{ flex: 1, backgroundColor: "whitesmoke" }}>
            <ScrollView contentContainerStyle={generalSettingsScreenStyles.mainView}>

                <StandardDropdown label={t("GENERAL_SETTINGS_LANGUAGE_DROPDOWN_LABEL", { ns: "user_profile_screen_translations" })} 
                    data={languagesData} mode={undefined} value={language} setValue={setLanguage} placeholder={""} />

            </ScrollView>
        </SafeAreaView>
    );
}

const generalSettingsScreenStyles = StyleSheet.create({
    mainView:
    {
        //flex: 1,
        //justifyContent: 'center',
        //alignItems: 'center',
        backgroundColor: 'whitesmoke',
        padding: 20,
        gap: 10
    },

    userProfilePicture: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        height: 200
    },

    dataView: {
        flexDirection: "row",
        gap: 5
    },

    dataViewLabel: {
        fontWeight: "600",
        color: "#a80a2e",
        fontSize: 16
    },

    dataViewText: {
        fontSize: 16,
        color: "black"
    }
});

export default GeneralSettingsScreen;