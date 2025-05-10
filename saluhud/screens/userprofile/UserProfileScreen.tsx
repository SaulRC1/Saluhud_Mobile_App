import MenuButton from "@components/buttons/MenuButton";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import FitnessDataProfileIcon from "@resources/icons/fitness-data-profile-icon.svg";
import SettingsIcon from "@resources/icons/settings-icon.svg";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { UserProfileScreenStackParamList } from "@root/App";

type UserProfileScreenNavigationProp = StackNavigationProp<UserProfileScreenStackParamList, "User_Profile_Screen">;

const UserProfileScreen = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<UserProfileScreenNavigationProp>();
    
    return(
        <SafeAreaView style={{ flex: 1, backgroundColor: "whitesmoke" }}>
            <ScrollView contentContainerStyle={userProfileScreenStyles.mainView}>
                <MenuButton icon={FitnessDataProfileIcon}
                    text={t("FITNESS_DATA_PROFILE_TITLE", { ns: "user_profile_screen_translations" })}
                    style={userProfileScreenStyles.menuButton} 
                    onPress={() => {
                        navigation.navigate("Fitness_Data_Profile_Screen");
                    }}
                />
                <MenuButton icon={SettingsIcon}
                    text={t("GENERAL_SETTINGS_TITLE", { ns: "user_profile_screen_translations" })}
                    style={userProfileScreenStyles.menuButton} onPress={() => { }}
                />
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
    }
});

export default UserProfileScreen;