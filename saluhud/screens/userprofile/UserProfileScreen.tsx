import MenuButton from "@components/buttons/MenuButton";
import { ActivityIndicator, GestureResponderEvent, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import FitnessDataProfileIcon from "@resources/icons/fitness-data-profile-icon.svg";
import SettingsIcon from "@resources/icons/settings-icon.svg";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { UserProfileScreenStackParamList } from "@root/App";
import UserProfileButton from "@components/buttons/UserProfileButton";
import { useEffect, useState } from "react";
import { getSaluhudUserData } from "@src/api/SaluhudMobileAppApiService";
import { useSaluhudMobileAppAuthenticationContext } from "@src/global/SaluhudMobileAppContext";
import SaluhudMobileAppConfiguration from "@resources/saluhud_mobile_app_configuration.json";
import SaluhudUserDTO from "@src/dto/user/SaluhudUserDTO";
import InformationModal, { InformationModalVariant } from "@components/modal/InformationModal";
import StepsIcon from "@resources/icons/steps-icon.svg";
import WeightIcon from "@resources/icons/kg-measure-weight-icon.svg";
import SleepIcon from "@resources/icons/snoring-icon.svg";

type UserProfileScreenNavigationProp = StackNavigationProp<UserProfileScreenStackParamList, "User_Profile_Main_Screen">;

const UserProfileScreen = () => {
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
                <UserProfileButton onPress={() => { navigation.navigate("User_Profile_Details_Screen"); }}
                    title={t("USER_PROFILE_TITLE", { ns: "user_profile_screen_translations" })}
                    style={userProfileScreenStyles.userProfileButton}
                    username={saluhudUser !== null ? saluhudUser.username : ""}
                    name={saluhudUser !== null ? saluhudUser.name : ""}
                    surname={saluhudUser !== null ? saluhudUser.surname : ""}
                />

                <MenuButton icon={FitnessDataProfileIcon}
                    text={t("FITNESS_DATA_PROFILE_TITLE", { ns: "user_profile_screen_translations" })}
                    style={userProfileScreenStyles.menuButton}
                    onPress={() => {
                        navigation.navigate("Fitness_Data_Profile_Screen");
                    }}
                />

                <MenuButton icon={SettingsIcon}
                    text={t("GENERAL_SETTINGS_TITLE", { ns: "user_profile_screen_translations" })}
                    style={userProfileScreenStyles.menuButton} onPress={() => {navigation.navigate("General_Settings_Screen");}}
                />

                <MenuButton icon={StepsIcon}
                    text={t("DAILY_STEPS_HISTORICAL_TITLE", { ns: "user_profile_screen_translations" })}
                    style={userProfileScreenStyles.menuButton} onPress={() => {navigation.navigate("Steps_Historical_Screen");}}
                />

                <MenuButton icon={WeightIcon}
                    text={t("WEIGHT_HISTORICAL_TITLE", { ns: "user_profile_screen_translations" })}
                    style={userProfileScreenStyles.menuButton} onPress={() => {navigation.navigate("Weight_Historical_Screen");}}
                />

                <MenuButton icon={SleepIcon}
                    text={t("SLEEP_HISTORICAL_TITLE", { ns: "user_profile_screen_translations" })}
                    style={userProfileScreenStyles.menuButton} onPress={() => {navigation.navigate("Sleep_Historical_Screen");}}
                />
            </>
        );
    }
    
    return(
        <SafeAreaView style={{ flex: 1, backgroundColor: "whitesmoke" }}>
            <ScrollView contentContainerStyle={userProfileScreenStyles.mainView}>

                <InformationModal visible={informationModalVisible} message={informationModalMessage}
                    acceptButtonText={t("ACCEPT_BUTTON_TEXT")} variant={informationModalVariant}
                    acceptButtonOnPress={() => { setInformationModalVisible(false) }} />

                {loading ? <ActivityIndicator size="large" style={{ margin: 20 }} color="#a80a2e" /> :
                    renderContent()
                }
            </ScrollView>
        </SafeAreaView>
    );
}

const userProfileScreenStyles = StyleSheet.create({
    mainView:
    {
        //flex: 1,
        //justifyContent: 'center',
        //alignItems: 'center',
        backgroundColor: 'whitesmoke',
        padding: 20,
        gap: 10
    },

    menuButton: {
        height: 50,
        width: "100%"
    },

    userProfileButton: {
        height: 100,
        width: "100%"
    }
});

export default UserProfileScreen;