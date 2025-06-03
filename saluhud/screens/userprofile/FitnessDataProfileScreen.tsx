import MenuButton from "@components/buttons/MenuButton";
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import FitnessDataProfileIcon from "@resources/icons/fitness-data-profile-icon.svg";
import SettingsIcon from "@resources/icons/settings-icon.svg";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { UserProfileScreenStackParamList } from "@root/App";
import { SetStateAction, useEffect, useState } from "react";
import SaluhudMobileAppConfiguration from "@resources/saluhud_mobile_app_configuration.json";
import { useSaluhudMobileAppAuthenticationContext } from "@src/global/SaluhudMobileAppContext";
import { getSaluhudUserFitnessData } from "@src/api/SaluhudMobileAppApiService";
import SaluhudUserFitnessDataDTO from "@src/dto/user/SaluhudUserFitnessDataDTO";
import StandardButton from "@components/buttons/StandardButton";
import { TFunction } from "i18next";
import ReadonlyText from "@components/inputs/ReadonlyText";
import { BiologicalSexEnum, fromBiologicalSexName } from "@src/entity/BiologicalSexEnum";
import { fromActivityFactorValue, HarrisBenedictActivityFactorEnum } from "@src/entity/HarrisBenedictActivityFactorEnum";
import CreateFitnessDataModal from "@components/modal/user/CreateFitnessDataModal";
import LoadingModal from "@components/modal/LoadingModal";
import InformationModal, { InformationModalVariant } from "@components/modal/InformationModal";
import { FitnessTargetEnum, fromFitnessTargetName } from "@src/entity/FitnessTargetEnum";

type FitnessDataProfileScreenNavigationProp = StackNavigationProp<UserProfileScreenStackParamList, "Fitness_Data_Profile_Screen">;

const getBiologicalSexTranslationKey = (biologicalSex: string) => {
    const sexEnum: BiologicalSexEnum | null = fromBiologicalSexName(biologicalSex);

    if(sexEnum === BiologicalSexEnum.MALE) {
        return "BIOLOGICAL_SEX_MALE";
    }

    if(sexEnum === BiologicalSexEnum.FEMALE) {
        return "BIOLOGICAL_SEX_FEMALE";
    }

    return "";
}

const getFitnessTargetTranslationKey = (fitnessTarget: string) => {
    const fitnessTargetEnum: FitnessTargetEnum | null = fromFitnessTargetName(fitnessTarget);

    if(fitnessTargetEnum === FitnessTargetEnum.WEIGHT_GAIN) {
        return "FITNESS_TARGET_WEIGHT_GAIN";
    }

    if(fitnessTargetEnum === FitnessTargetEnum.WEIGHT_LOSS) {
        return "FITNESS_TARGET_WEIGHT_LOSS";
    }

    if(fitnessTargetEnum === FitnessTargetEnum.MAINTENANCE) {
        return "FITNESS_TARGET_MAINTENANCE";
    }

    return "";
}

const getActivityFactorTranslation = (activityFactor: number) => {
    const activityFactorEnum: HarrisBenedictActivityFactorEnum | null = fromActivityFactorValue(activityFactor);

    if(activityFactorEnum === null) {
        return "";
    }

    switch(activityFactorEnum) {
        case HarrisBenedictActivityFactorEnum.SEDENTARY:
            return "FITNESS_DATA_ACTIVITY_LEVEL_SEDENTARY";
        case HarrisBenedictActivityFactorEnum.LIGHTLY_ACTIVE:
            return "FITNESS_DATA_ACTIVITY_LEVEL_LIGHTLY_ACTIVE";
        case HarrisBenedictActivityFactorEnum.MODERATELY_ACTIVE:
            return "FITNESS_DATA_ACTIVITY_LEVEL_MODERATELY_ACTIVE";
        case HarrisBenedictActivityFactorEnum.VERY_ACTIVE:
            return "FITNESS_DATA_ACTIVITY_LEVEL_VERY_ACTIVE";
        case HarrisBenedictActivityFactorEnum.EXTRA_ACTIVE:
            return "FITNESS_DATA_ACTIVITY_LEVEL_EXTRA_ACTIVE";
        case HarrisBenedictActivityFactorEnum.PROFESSIONAL_ATHLETE:
            return "FITNESS_DATA_ACTIVITY_LEVEL_PROFESSIONAL_ATHLETE";
        default:
            return "";
    }
}

const renderBodyComposition = (fitnessData: SaluhudUserFitnessDataDTO, translation: TFunction<"translation", undefined>) => {
    if (fitnessData.bodyComposition !== null && fitnessData.bodyComposition.leanBodyMassPercentage !== 0
        && fitnessData.bodyComposition.bodyFatPercentage !== 0 && fitnessData.bodyComposition.bodyFatWeight !== 0
        && fitnessData.bodyComposition.leanBodyMassWeight !== 0
    ) {
        return (
            <>
                <ReadonlyText
                    label={translation("FITNESS_DATA_BODY_FAT_WEIGHT_LABEL", { ns: "user_profile_screen_translations" })}
                    text={fitnessData.bodyComposition.bodyFatWeight + " kg (" + fitnessData.bodyComposition.bodyFatPercentage + " %)"} />
                <ReadonlyText
                    label={translation("FITNESS_DATA_LEAN_BODY_MASS_WEIGHT_LABEL", { ns: "user_profile_screen_translations" })}
                    text={fitnessData.bodyComposition.leanBodyMassWeight + " kg (" + fitnessData.bodyComposition.leanBodyMassPercentage + " %)"} />
            </>
        );
    }

    return null;
}

const ViewFitnessData = (
    {translation, fitnessData, setFitnessData, setLoading, customHeadersMap}: 
    {translation: TFunction<"translation", undefined>, fitnessData: SaluhudUserFitnessDataDTO,
        setFitnessData: (value: SetStateAction<SaluhudUserFitnessDataDTO | undefined>) => void,
        setLoading: (value: SetStateAction<boolean>) => void,
        customHeadersMap: Map<string, string>
    }) => {

    const [editFitnessDataModalVisible, setEditFitnessDataModalVisible] = useState(false);
    const [loadingModalVisible, setLoadingModalVisible] = useState(false);
    const [informationModalVisible, setInformationModalVisible] = useState(false);
    const [informationModalMessage, setInformationModalMessage] = useState("");
    const [informationModalVariant, setInformationModalVariant] =
        useState<InformationModalVariant>(InformationModalVariant.INFORMATION);

    return(
        <View style={{gap: 20}}>

            <CreateFitnessDataModal setVisible={setEditFitnessDataModalVisible} visible={editFitnessDataModalVisible}
                title={translation("FITNESS_DATA_EDIT_PROFILE_DIALOG_TITLE", { ns: "user_profile_screen_translations" })} 
                fitnessData={fitnessData} setLoadingModalVisible={setLoadingModalVisible}
                setInformationModalMessage={setInformationModalMessage} setInformationModalVisible={setInformationModalVisible}
                setInformationModalVariant={setInformationModalVariant} setFitnessData={setFitnessData} setLoading={setLoading}/>
            
            <LoadingModal visible={loadingModalVisible} message={translation("SAVING_LOADING_MODAL_MESSAGE")}/>

            <InformationModal visible={informationModalVisible} message={informationModalMessage} 
                acceptButtonText={translation("ACCEPT_BUTTON_TEXT")} variant={informationModalVariant}
                acceptButtonOnPress={() => {
                    setInformationModalVisible(false);
                    getSaluhudUserFitnessData(setLoading, customHeadersMap, setFitnessData);
                }}/>

            <StandardButton title={translation("EDIT_BUTTON_TEXT")} onPress={() => setEditFitnessDataModalVisible(true)}/>

            <ReadonlyText label={translation("FITNESS_DATA_WEIGHT_LABEL", { ns: "user_profile_screen_translations" })} 
                text={fitnessData.weight.toString() + " kg"}/>
            <ReadonlyText label={translation("FITNESS_DATA_HEIGHT_LABEL", { ns: "user_profile_screen_translations" })} 
                text={fitnessData.height.toString() + " cm"}/>
            <ReadonlyText 
                label={translation("FITNESS_DATA_BIOLOGICAL_SEX_LABEL", { ns: "user_profile_screen_translations" })} 
                text={translation(getBiologicalSexTranslationKey(fitnessData.biologicalSex))}/>

            <ReadonlyText 
                label={translation("FITNESS_DATA_FITNESS_TARGET_LABEL", { ns: "user_profile_screen_translations" })} 
                text={translation(getFitnessTargetTranslationKey(fitnessData.fitnessTarget))}/>

            <ReadonlyText label={translation("FITNESS_DATA_AGE_LABEL", { ns: "user_profile_screen_translations" })} 
                text={fitnessData.age.toString() + " " + 
                    translation("FITNESS_DATA_AGE_YEARS_LABEL", { ns: "user_profile_screen_translations" })}/>
            <ReadonlyText 
                label={translation("FITNESS_DATA_RECOMMENDED_DAILY_WATER_LITERS_LABEL", { ns: "user_profile_screen_translations" })} 
                text={fitnessData.recommendedDailyWaterLiters.toString() + " L"}/>
            <ReadonlyText 
                label={translation("FITNESS_DATA_RECOMMENDED_SLEEP_HOURS_LABEL", { ns: "user_profile_screen_translations" })} 
                text={fitnessData.recommendedSleepHours.toString() + " " +
                    translation("FITNESS_DATA_RECOMMENDED_SLEEP_HOURS_UNIT_LABEL", { ns: "user_profile_screen_translations" })}/>
            <ReadonlyText 
                label={translation("FITNESS_DATA_RECOMMENDED_DAILY_KILOCALORIES_LABEL", { ns: "user_profile_screen_translations" })} 
                text={fitnessData.dailyKilocaloriesObjective.toString() + " kcal"}/>

            <ReadonlyText 
                label={translation("FITNESS_DATA_RECOMMENDED_DAILY_KILOCALORIES_FOR_FITNESS_TARGET_LABEL", { ns: "user_profile_screen_translations" })} 
                text={fitnessData.fitnessTargetRecommendedKilocalories.toString() + " kcal"}/>

            <ReadonlyText label={translation("FITNESS_DATA_RECOMMENDED_DAILY_STEPS_LABEL", { ns: "user_profile_screen_translations" })} 
                text={fitnessData.recommendedDailySteps.toString()}/>
            <ReadonlyText 
                label={translation("FITNESS_DATA_BODY_MASS_INDEX_LABEL", { ns: "user_profile_screen_translations" })} 
                text={fitnessData.bodyMassIndex.toFixed(2)}/>
            <ReadonlyText 
                label={translation("FITNESS_DATA_ACTIVITY_FACTOR_LABEL", { ns: "user_profile_screen_translations" })} 
                text={translation(getActivityFactorTranslation(fitnessData.activityFactor))}/>

            {renderBodyComposition(fitnessData, translation)}
        </View>
    );
}

const EmptyFitnessDataProfile = (
    {translation, setFitnessData, setLoading, customHeadersMap}: 
    {translation: TFunction<"translation", undefined>, 
        setFitnessData: (value: SetStateAction<SaluhudUserFitnessDataDTO | undefined>) => void,
        setLoading: (value: SetStateAction<boolean>) => void,
        customHeadersMap: Map<string, string>
    }) => {

    const [createFitnessDataModalVisible, setCreateFitnessDataModalVisible] = useState(false);
    const [loadingModalVisible, setLoadingModalVisible] = useState(false);
    const [informationModalVisible, setInformationModalVisible] = useState(false);
    const [informationModalMessage, setInformationModalMessage] = useState("");
    const [informationModalVariant, setInformationModalVariant] =
        useState<InformationModalVariant>(InformationModalVariant.INFORMATION);

    return(
        <View style={{gap: 20}}>

            <CreateFitnessDataModal setVisible={setCreateFitnessDataModalVisible} visible={createFitnessDataModalVisible}
                title={translation("FITNESS_DATA_CREATE_PROFILE_DIALOG_TITLE", { ns: "user_profile_screen_translations" })} 
                fitnessData={undefined} setLoadingModalVisible={setLoadingModalVisible}
                setInformationModalMessage={setInformationModalMessage} setInformationModalVisible={setInformationModalVisible}
                setInformationModalVariant={setInformationModalVariant} setFitnessData={setFitnessData} setLoading={setLoading}/>
            
            <LoadingModal visible={loadingModalVisible} message={translation("SAVING_LOADING_MODAL_MESSAGE")}/>

            <InformationModal visible={informationModalVisible} message={informationModalMessage} 
                acceptButtonText={translation("ACCEPT_BUTTON_TEXT")} variant={informationModalVariant}
                acceptButtonOnPress={() => {
                    setInformationModalVisible(false);
                    getSaluhudUserFitnessData(setLoading, customHeadersMap, setFitnessData);
                }}/>
            
            <Text style={{fontSize: 16}}>{translation("FITNESS_DATA_NO_DATA_MESSAGE", { ns: "user_profile_screen_translations" })}</Text>
            <StandardButton title={translation("FITNESS_DATA_CREATE_PROFILE_TEXT", { ns: "user_profile_screen_translations" })} 
                onPress={() => setCreateFitnessDataModalVisible(true)} />
        </View>
    );
}

const renderContent = (loading: boolean, t: TFunction<"translation", undefined>, 
    fitnessData: SaluhudUserFitnessDataDTO | undefined | null,
    setFitnessData: (value: SetStateAction<SaluhudUserFitnessDataDTO | undefined>) => void,
    setLoading: (value: SetStateAction<boolean>) => void,
    customHeadersMap: Map<string, string>
) => {
    if(loading) {
        return (<ActivityIndicator size="large" style={{ margin: 20 }} color="#a80a2e" />);
    }

    if(fitnessData !== undefined && fitnessData !== null) {
        return (
            <ViewFitnessData translation={t} fitnessData={fitnessData} setFitnessData={setFitnessData}
                setLoading={setLoading} customHeadersMap={customHeadersMap}/>
        );
    }

    return (
        <EmptyFitnessDataProfile translation={t} setFitnessData={setFitnessData}
                setLoading={setLoading} customHeadersMap={customHeadersMap}/>
    );
}

const FitnessDataProfileScreen = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<FitnessDataProfileScreenNavigationProp>();
    let customHeadersMap = new Map<string, string>();
    const saluhudMobileAppAuthenticationContext = useSaluhudMobileAppAuthenticationContext();
    const [loading, setLoading] = useState<boolean>(false);
    const [fitnessData, setFitnessData] = useState<SaluhudUserFitnessDataDTO>();
    customHeadersMap.set(SaluhudMobileAppConfiguration.jwtHttpHeader, saluhudMobileAppAuthenticationContext.jwt);

    useEffect(() => {
        getSaluhudUserFitnessData(setLoading, customHeadersMap, setFitnessData);
    }, []);

    return(
        <SafeAreaView style={{ flex: 1, backgroundColor: "whitesmoke" }}>
            <ScrollView contentContainerStyle={fitnessDataProfileScreenStyles.mainView}>
                {renderContent(loading, t, fitnessData, setFitnessData, setLoading, customHeadersMap)}
            </ScrollView>
        </SafeAreaView>
    );
}

const fitnessDataProfileScreenStyles = StyleSheet.create({
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

export default FitnessDataProfileScreen;