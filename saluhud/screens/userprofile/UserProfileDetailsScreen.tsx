import InformationModal, { InformationModalVariant } from "@components/modal/InformationModal";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { UserProfileScreenStackParamList } from "@root/App";
import { getSaluhudUserData } from "@src/api/SaluhudMobileAppApiService";
import SaluhudUserDTO from "@src/dto/user/SaluhudUserDTO";
import { useSaluhudMobileAppAuthenticationContext } from "@src/global/SaluhudMobileAppContext";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import SaluhudMobileAppConfiguration from "@resources/saluhud_mobile_app_configuration.json";
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import UserProfileIcon from "@resources/icons/user-profile-icon.svg";
import ReadonlyText from "@components/inputs/ReadonlyText";

type UserProfileScreenNavigationProp = StackNavigationProp<UserProfileScreenStackParamList, "User_Profile_Details_Screen">;

const UserProfileDetailsScreen = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<UserProfileScreenNavigationProp>();
    let customHeadersMap = new Map<string, string>();
    const saluhudMobileAppAuthenticationContext = useSaluhudMobileAppAuthenticationContext();
    customHeadersMap.set(SaluhudMobileAppConfiguration.jwtHttpHeader, saluhudMobileAppAuthenticationContext.jwt);
    const [loading, setLoading] = useState<boolean>(false);
    const [saluhudUser, setSaluhudUser] = useState<SaluhudUserDTO | null>(null);
    const [informationModalVisible, setInformationModalVisible] = useState(false);
    const [informationModalMessage, setInformationModalMessage] = useState("");
    const [informationModalVariant, setInformationModalVariant] = useState(InformationModalVariant.ERROR);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                await getSaluhudUserData(customHeadersMap, setSaluhudUser);
            } catch (error) {
                console.error(error);
                let errorMessage = t("NETWORK_UNKNOW_ERROR");

                if (error instanceof Error) {
                    switch (error.name) {
                        case "AbortError":
                            errorMessage = t("NETWORK_TIMEOUT_ERROR");
                            break;
                        case "ApiErrorException":
                            errorMessage = error.message;
                            break;
                        default:
                            errorMessage = t("NETWORK_UNKNOW_ERROR");
                            break;
                    }
                }

                setInformationModalMessage(errorMessage);
                setInformationModalVariant(InformationModalVariant.ERROR);
                setInformationModalVisible(true);

            } finally {
                setLoading(false);
            }
        }
        
        fetchData();
    }, []);

    const renderContent = () => {
        if(saluhudUser === null) {
            return (
                <Text>{informationModalMessage}</Text>
            );
        }

        return (
            <>
                <View style={userProfileDetailsScreenStyles.userProfilePicture}>
                    <UserProfileIcon width={200} height={200} fill={"#a80a2e"} />
                </View>

                <ReadonlyText
                    label={t("USER_DETAILS_PROFILE_NAME_AND_SURNAME_LABEL", { ns: "user_profile_screen_translations" })}
                    text={saluhudUser !== null ? saluhudUser.name + " " + saluhudUser.surname : ""}
                />

                <ReadonlyText
                    label={t("USER_DETAILS_PROFILE_USERNAME_LABEL", { ns: "user_profile_screen_translations" })}
                    text={saluhudUser !== null ? saluhudUser.username : ""}
                />

                <ReadonlyText
                    label={t("USER_DETAILS_PROFILE_EMAIL_LABEL", { ns: "user_profile_screen_translations" })}
                    text={saluhudUser !== null ? saluhudUser.email : ""}
                />

                <ReadonlyText
                    label={t("USER_DETAILS_PROFILE_PHONE_NUMBER_LABEL", { ns: "user_profile_screen_translations" })}
                    text={saluhudUser !== null ? saluhudUser.phoneNumber : ""}
                />
            </>
        );
    }
    
    return(
        <SafeAreaView style={{ flex: 1, backgroundColor: "whitesmoke" }}>
            <ScrollView contentContainerStyle={userProfileDetailsScreenStyles.mainView}>

                <InformationModal visible={informationModalVisible} message={informationModalMessage}
                    acceptButtonText={t("ACCEPT_BUTTON_TEXT")} variant={informationModalVariant}
                    acceptButtonOnPress={() => { setInformationModalVisible(false) }} />

                {loading ? <ActivityIndicator size="large" style={{ margin: 20 }} color="#a80a2e" /> :
                    renderContent()}
            </ScrollView>
        </SafeAreaView>
    );
}

const userProfileDetailsScreenStyles = StyleSheet.create({
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

export default UserProfileDetailsScreen;