import { StyleSheet, useWindowDimensions, View, StyleProp, ViewStyle, GestureResponderEvent } from "react-native";
import ContainerModal from "@components/modal/ContainerModal";
import { SetStateAction, useEffect, useState } from "react";
import NumericInput, { NumericInputType } from "@components/inputs/NumericInput";
import { useTranslation } from "react-i18next";
import StandardButton from "@components/buttons/StandardButton";
import SaluhudUserFitnessDataDTO from "@src/dto/user/SaluhudUserFitnessDataDTO";
import { Dropdown } from "react-native-element-dropdown";
import { BiologicalSexEnum } from "@src/entity/BiologicalSexEnum";
import StandardDropdown from "@components/inputs/StandardDropdown";
import { HarrisBenedictActivityFactorEnum } from "@src/entity/HarrisBenedictActivityFactorEnum";
import SaveSaluhudUserFitnessDataDTO from "@src/dto/user/SaveSaluhudUserFitnessDataDTO";
import BodyCompositionDTO from "@src/dto/user/BodyCompositionDTO";
import SaluhudMobileAppConfiguration from "@resources/saluhud_mobile_app_configuration.json";
import { useSaluhudMobileAppAuthenticationContext } from "@src/global/SaluhudMobileAppContext";
import { executePostRequest, getSaluhudUserFitnessData } from "@src/api/SaluhudMobileAppApiService";
import LoadingModal from "../LoadingModal";
import ApiInformationResponse from "@src/response/ApiInformationResponse";
import { InformationModalVariant } from "../InformationModal";

interface CreateFitnessDataModalProps
{
    title: string;
    visible: boolean;
    setVisible: (value: SetStateAction<boolean>) => void;
    style?: StyleProp<ViewStyle>;
    fitnessData?: SaluhudUserFitnessDataDTO;
    setLoadingModalVisible: (value: SetStateAction<boolean>) => void;
    setInformationModalVisible: (value: SetStateAction<boolean>) => void;
    setInformationModalMessage: (value: SetStateAction<string>) => void;
    setInformationModalVariant: (value: SetStateAction<InformationModalVariant>) => void;
    setFitnessData: (value: SetStateAction<SaluhudUserFitnessDataDTO | undefined>) => void;
    setLoading: (value: SetStateAction<boolean>) => void;
}

export default function CreateFitnessDataModal({title, visible, setVisible, style, fitnessData, 
    setLoadingModalVisible, setInformationModalVisible, setInformationModalMessage, 
    setInformationModalVariant, setFitnessData, setLoading} : Readonly<CreateFitnessDataModalProps>)
{
    const {height, width} = useWindowDimensions();
    const saluhudMobileAppAuthenticationContext = useSaluhudMobileAppAuthenticationContext();
    const { t } = useTranslation();
    const [fitnessDataWeight, setFitnessDataWeight] = useState("");
    const [fitnessDataHeight, setFitnessDataHeight] = useState("");
    const [fitnessDataAge, setFitnessDataAge] = useState("");
    const [leanBodyMassPercentage, setLeanBodyMassPercentage] = useState("");
    const [bodyFatPercentage, setBodyFatPercentage] = useState("");
    const [bodyFatWeight, setBodyFatWeight] = useState("");
    const [leanBodyMassWeight, setLeanBodyMassWeight] = useState("");
    const [biologicalSex, setBiologicalSex] = useState("");
    const [activityFactor, setActivityFactor] = useState("");

    const biologicalSexData = [
        {label: t("BIOLOGICAL_SEX_MALE"), value: BiologicalSexEnum.MALE},
        {label: t("BIOLOGICAL_SEX_FEMALE"), value: BiologicalSexEnum.FEMALE},
    ];

    const activityFactorData = [
        {label: t("FITNESS_DATA_ACTIVITY_LEVEL_SEDENTARY"), value: HarrisBenedictActivityFactorEnum.SEDENTARY.toString()},
        {label: t("FITNESS_DATA_ACTIVITY_LEVEL_LIGHTLY_ACTIVE"), value: HarrisBenedictActivityFactorEnum.LIGHTLY_ACTIVE.toString()},
        {label: t("FITNESS_DATA_ACTIVITY_LEVEL_MODERATELY_ACTIVE"), value: HarrisBenedictActivityFactorEnum.MODERATELY_ACTIVE.toString()},
        {label: t("FITNESS_DATA_ACTIVITY_LEVEL_VERY_ACTIVE"), value: HarrisBenedictActivityFactorEnum.VERY_ACTIVE.toString()},
        {label: t("FITNESS_DATA_ACTIVITY_LEVEL_EXTRA_ACTIVE"), value: HarrisBenedictActivityFactorEnum.EXTRA_ACTIVE.toString()},
        {label: t("FITNESS_DATA_ACTIVITY_LEVEL_PROFESSIONAL_ATHLETE"), value: HarrisBenedictActivityFactorEnum.PROFESSIONAL_ATHLETE.toString()},
    ];

    useEffect(() => {
        if(fitnessData !== undefined && fitnessData !== null) {
            setFitnessDataWeight(fitnessData.weight.toFixed(2));
            setFitnessDataHeight(fitnessData.height.toFixed(2));
            setFitnessDataAge(fitnessData.age.toString());
            setBiologicalSex(fitnessData.biologicalSex);
            setActivityFactor(fitnessData.activityFactor.toString());
            setLeanBodyMassPercentage(fitnessData.bodyComposition.leanBodyMassPercentage.toFixed(2));
            setBodyFatPercentage(fitnessData.bodyComposition.bodyFatPercentage.toFixed(2));
            setBodyFatWeight(fitnessData.bodyComposition.bodyFatWeight.toFixed(2));
            setLeanBodyMassWeight(fitnessData.bodyComposition.leanBodyMassWeight.toFixed(2));
        }
    }, [visible]);

    const renderCreateFitnessDataModalContent = () => {
        return (
            <View style={createFitnessDataModalStyles.content}>
                <NumericInput numericInputType={NumericInputType.DECIMAL}
                    label={t("FITNESS_DATA_WEIGHT_LABEL", { ns: "user_profile_screen_translations" }) + " (kg)"}
                    style={{ width: "100%", height: 50 }} value={fitnessDataWeight} setValue={setFitnessDataWeight} />

                <NumericInput numericInputType={NumericInputType.DECIMAL}
                    label={t("FITNESS_DATA_HEIGHT_LABEL", { ns: "user_profile_screen_translations" }) + " (cm)"}
                    style={{ width: "100%", height: 50 }} value={fitnessDataHeight} setValue={setFitnessDataHeight} />

                <NumericInput numericInputType={NumericInputType.NUMERIC}
                    label={t("FITNESS_DATA_AGE_LABEL", { ns: "user_profile_screen_translations" }) + " (" +
                        t("FITNESS_DATA_AGE_YEARS_LABEL", { ns: "user_profile_screen_translations" }) + ")"}
                    style={{ width: "100%", height: 50 }} value={fitnessDataAge} setValue={setFitnessDataAge} />
                
                <StandardDropdown label={t("FITNESS_DATA_BIOLOGICAL_SEX_LABEL", { ns: "user_profile_screen_translations" })}
                    data={biologicalSexData} mode={"modal"} value={biologicalSex} setValue={setBiologicalSex} 
                    placeholder={t("FITNESS_DATA_BIOLOGICAL_SEX_DROPDOWN_PLACEHOLDER", { ns: "user_profile_screen_translations" })} />

                <StandardDropdown label={t("FITNESS_DATA_ACTIVITY_FACTOR_LABEL", { ns: "user_profile_screen_translations" })}
                    data={activityFactorData} mode={"modal"} value={activityFactor} setValue={setActivityFactor} 
                    placeholder={t("FITNESS_DATA_ACTIVITY_FACTOR_DROPDOWN_PLACEHOLDER", { ns: "user_profile_screen_translations" })} />

                <NumericInput numericInputType={NumericInputType.DECIMAL}
                    label={t("FITNESS_DATA_LEAN_BODY_MASS_PERCENTAGE_LABEL", { ns: "user_profile_screen_translations" }) + " (%)"}
                    style={{ width: "100%", height: 50 }} value={leanBodyMassPercentage} setValue={setLeanBodyMassPercentage} 
                    maxValue={100}/>

                <NumericInput numericInputType={NumericInputType.DECIMAL}
                    label={t("FITNESS_DATA_BODY_FAT_PERCENTAGE_LABEL", { ns: "user_profile_screen_translations" }) + " (%)"}
                    style={{ width: "100%", height: 50 }} value={bodyFatPercentage} setValue={setBodyFatPercentage} 
                    maxValue={100}/>

                <NumericInput numericInputType={NumericInputType.DECIMAL}
                    label={t("FITNESS_DATA_BODY_FAT_WEIGHT_LABEL", { ns: "user_profile_screen_translations" }) + " (kg)"}
                    style={{ width: "100%", height: 50 }} value={bodyFatWeight} setValue={setBodyFatWeight} />

                <NumericInput numericInputType={NumericInputType.DECIMAL}
                    label={t("FITNESS_DATA_LEAN_BODY_MASS_WEIGHT_LABEL", { ns: "user_profile_screen_translations" }) + " (kg)"}
                    style={{ width: "100%", height: 50 }} value={leanBodyMassWeight} setValue={setLeanBodyMassWeight} />
            </View>
        );
    }

    const saveSaluhudUserFitnessData = async () => {
        let bodyComposition: BodyCompositionDTO = new BodyCompositionDTO(Number(leanBodyMassPercentage), Number(bodyFatPercentage), 
        Number(bodyFatWeight), Number(leanBodyMassWeight));

        let saveFitnessDataDTO: SaveSaluhudUserFitnessDataDTO = new SaveSaluhudUserFitnessDataDTO(Number(fitnessDataWeight), 
        Number(fitnessDataHeight), biologicalSex, Number(fitnessDataAge), Number(leanBodyMassPercentage), 
        Number(bodyFatPercentage), Number(bodyFatWeight), Number(leanBodyMassWeight), Number(activityFactor));

        let customHeadersMap = new Map<string, string>();
        customHeadersMap.set(SaluhudMobileAppConfiguration.jwtHttpHeader, saluhudMobileAppAuthenticationContext.jwt);

        setLoadingModalVisible(true);
        setVisible(false);

        try {
            const response = await executePostRequest(customHeadersMap, "http://" + SaluhudMobileAppConfiguration.backendURL
                + SaluhudMobileAppConfiguration.saluhudUserFitnessDataEndpoint, saveFitnessDataDTO);

            const responseJSON : ApiInformationResponse = await response.json();

            setInformationModalMessage(responseJSON.message);
            setInformationModalVariant(InformationModalVariant.SUCCESS);
            
            console.log(responseJSON);
        } catch (error) {
            console.log(error);
            setInformationModalMessage(t("FITNESS_DATA_SAVING_GENERIC_ERROR_MESSAGE"));
            setInformationModalVariant(InformationModalVariant.ERROR);
        } finally {
            setInformationModalVisible(true);
            setLoadingModalVisible(false);
        }
    }
    
    const renderCreateFitnessDataModalFooter = () => {
        return (
            <View style={createFitnessDataModalStyles.footer}>
                <StandardButton title={t("ACCEPT_BUTTON_TEXT")} onPress={() => {saveSaluhudUserFitnessData();}}/>
                <StandardButton title={t("CANCEL_BUTTON_TEXT")} onPress={() => setVisible(false)}/>
            </View>
        );
    }

    return (
        <ContainerModal title={title}
            visible={visible} renderContent={renderCreateFitnessDataModalContent}
            renderFooter={renderCreateFitnessDataModalFooter} style={[{ width: width * 0.9 }, style]}
            onRequestClose={() => setVisible(false)} />
    );
}

const createFitnessDataModalStyles = StyleSheet.create({
    content: {
        gap: 20,
        marginBottom: 20
    },

    footer: {
        flexDirection: "row",
        gap: 20,
        padding: 20,
        justifyContent: "center",
        alignItems: "center"
    }
});