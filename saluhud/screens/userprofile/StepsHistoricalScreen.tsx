import ReadonlyText from "@components/inputs/ReadonlyText";
import InformationModal, { InformationModalVariant } from "@components/modal/InformationModal";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { UserProfileScreenStackParamList } from "@root/App";
import { getCurrentWeekDailyStepHistoricalEntries, getSaluhudUserData, getWeekDailyStepHistoricalEntries, getWeekDailyStepHistoricalEntriesByDate, postRegisterNewDailyStepsHistoricalEntry } from "@src/api/SaluhudMobileAppApiService";
import SaluhudUserDTO from "@src/dto/user/SaluhudUserDTO";
import { useSaluhudMobileAppAuthenticationContext } from "@src/global/SaluhudMobileAppContext";
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Text, View, SafeAreaView, ScrollView, ActivityIndicator, StyleSheet, processColor, useWindowDimensions } from "react-native";
import SaluhudMobileAppConfiguration from "@resources/saluhud_mobile_app_configuration.json";
import StandardDropdown from "@components/inputs/StandardDropdown";
import i18next from "i18next";
import StandardButton from "@components/buttons/StandardButton";
import {BarChart} from 'react-native-charts-wrapper';
import DailyStepsHistoricalEntryDTO from "@src/dto/user/DailyStepsHistoricalEntryDTO";
import DailyStepsHistoricalDateRangeDTO from "@src/dto/user/DailyStepsHistoricalDateRangeDTO";
import ContainerModal from "@components/modal/ContainerModal";
import FormTextInput, { FormTextInputValidationResult } from "@components/inputs/FormTextInput";
import LoadingModal from "@components/modal/LoadingModal";
import RegisterDailyStepsHistoricalEntryDTO from "@src/dto/user/RegisterDailyStepsHistoricalEntryDTO";
import ApiInformationResponse from "@src/response/ApiInformationResponse";

type UserProfileScreenNavigationProp = StackNavigationProp<UserProfileScreenStackParamList, "Steps_Historical_Screen">;

const StepsHistoricalScreen = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<UserProfileScreenNavigationProp>();
    let customHeadersMap = new Map<string, string>();
    const saluhudMobileAppAuthenticationContext = useSaluhudMobileAppAuthenticationContext();
    customHeadersMap.set(SaluhudMobileAppConfiguration.jwtHttpHeader, saluhudMobileAppAuthenticationContext.jwt);
    const [loading, setLoading] = useState<boolean>(false);
    const [stepsValues, setStepsValues] = useState<number[]>([]);
    const [burnedKilocaloriesValues, setBurnedKilocaloriesValues] = useState<number[]>([]);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [moveWeek, setMoveWeek] = useState<number | null>(null); //0 - backwards | 1 - forward
    const [reloadTrigger, setReloadTrigger] = useState(0);
    const [registerNewEntryModalVisible, setRegisterNewEntryModalVisible] = useState(false);
    const { width, height } = useWindowDimensions();
    const [entryDate, setEntryDate] = useState("");
    const [numberOfSteps, setNumberOfSteps] = useState("");
    const [registeredNewEntrySuccess, setRegisteredNewEntrySuccess] = useState(false);
    const [loadingModalVisible, setLoadingModalVisible] = useState(false);
    const [loadingModalMessage, setLoadingModalMessage] = useState("");
    const [informationModalVisible, setInformationModalVisible] = useState(false);
    const [informationModalMessage, setInformationModalMessage] = useState("");
    const [informationModalVariant, setInformationModalVariant] = useState(InformationModalVariant.ERROR);

    const fetchData = async () => {

        try {
            setLoading(true);

            const entriesByDateRange: DailyStepsHistoricalDateRangeDTO = 
                await getCurrentWeekDailyStepHistoricalEntries(customHeadersMap);

            const stepsValues: number[] = [];
            const burnedKcalValues: number[] = [];

            entriesByDateRange.entries.forEach(entry => {
                stepsValues.push(entry.doneSteps);
                burnedKcalValues.push(entry.kilocaloriesBurned);
            });

            setStepsValues(stepsValues);
            setBurnedKilocaloriesValues(burnedKcalValues);
            setStartDate(entriesByDateRange.startDate);
            setEndDate(entriesByDateRange.endDate);

            console.log(entriesByDateRange);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const fetchDataByWeek = async () => {

        try {
            setLoading(true);

            const date: string = convertDate(startDate);
            let entriesByDateRange;

            if(moveWeek === null) {
                entriesByDateRange = await getWeekDailyStepHistoricalEntriesByDate(customHeadersMap, date);
            } else {
                entriesByDateRange = await getWeekDailyStepHistoricalEntries(customHeadersMap, moveWeek, date);
            }

            const stepsValues: number[] = [];
            const burnedKcalValues: number[] = [];

            entriesByDateRange.entries.forEach(entry => {
                stepsValues.push(entry.doneSteps);
                burnedKcalValues.push(entry.kilocaloriesBurned);
            });

            setStepsValues(stepsValues);
            setBurnedKilocaloriesValues(burnedKcalValues);
            setStartDate(entriesByDateRange.startDate);
            setEndDate(entriesByDateRange.endDate);

            console.log(entriesByDateRange);
        } catch (error) {
            //console.error(error);

            setStepsValues([]);
            setBurnedKilocaloriesValues([]);
            setStartDate(convertDayToddMMyyyy(addWeeks(convertDate(startDate), moveWeek === 0 ? -1 : 1)));
            setEndDate(convertDayToddMMyyyy(addWeeks(convertDate(endDate), moveWeek === 0 ? -1 : 1)));

        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchDataByWeek();
    }, [reloadTrigger]);

    const renderContent = () => {
        return(
            <View style={{flex: 1, gap: 20}}>
                <Text style={stepsHistoricalScreenStyles.weekTitle}>{t("WEEK") + " " + startDate + " - " + endDate}</Text>

                <Text style={[stepsHistoricalScreenStyles.chartTitle, {backgroundColor: "#d32f2f"}]}>
                    {t("DAILY_STEPS_HISTORICAL_CHART_LEGEND_LABEL", { ns: "user_profile_screen_translations" })}
                </Text>
                {stepsValues.length > 0 ? <BarChart
                    style={stepsHistoricalScreenStyles.chart}
                    data={{
                        dataSets: [{
                            values: stepsValues,
                            label: t("DAILY_STEPS_HISTORICAL_CHART_LEGEND_LABEL", { ns: "user_profile_screen_translations" }),
                            config: {
                                color: processColor('#d32f2f'),
                                barShadowColor: processColor('#f0f0f0'),
                                highlightAlpha: 90,
                                highlightColor: processColor('red'),
                                valueTextSize: 12
                            },
                        }],
                        config: {
                            barWidth: 0.7,
                        },
                    }}
                    xAxis={{
                        valueFormatter: [
                            t("WEEK_DAY_MONDAY_SHORT"),
                            t("WEEK_DAY_TUESDAY_SHORT"),
                            t("WEEK_DAY_WEDNESDAY_SHORT"),
                            t("WEEK_DAY_THURSDAY_SHORT"),
                            t("WEEK_DAY_FRIDAY_SHORT"),
                            t("WEEK_DAY_SATURDAY_SHORT"),
                            t("WEEK_DAY_SUNDAY_SHORT")
                        ],
                        granularityEnabled: true,
                        granularity: 1,
                        drawLabels: true,
                        position: 'BOTTOM',
                        textSize: 14
                    }}
                    yAxis={{
                        left: {
                            axisMinimum: 0,
                            drawGridLines: true,
                            textSize: 14
                        },
                        right: {
                            enabled: false,
                        },
                    }}
                    animation={{
                        durationX: 600,
                    }}
                    legend={{
                        enabled: true,
                        textSize: 14,
                        form: 'SQUARE',
                    }}
                    chartDescription={{ text: '' }}
                    drawValueAboveBar={true}
                    drawBarShadow={false}
                    marker={{
                        enabled: true,
                        markerColor: processColor('#2c3e50'),
                        textColor: processColor('#ffffff'),
                        textSize: 14,
                    }}
                /> : <Text>{t("NO_HISTORICAL_DATA_FOR_CURRENT_WEEK", { ns: "user_profile_screen_translations" })}</Text>}

                <Text style={[stepsHistoricalScreenStyles.chartTitle, {backgroundColor: "#e65100"}]}>
                    {t("DAILY_STEPS_HISTORICAL_BURNED_KCAL_CHART_LEGEND_LABEL", { ns: "user_profile_screen_translations" })}
                </Text>
                {burnedKilocaloriesValues.length > 0 ? <BarChart
                    style={stepsHistoricalScreenStyles.chart}
                    data={{
                        dataSets: [{
                            values: burnedKilocaloriesValues,
                            label: t("DAILY_STEPS_HISTORICAL_BURNED_KCAL_CHART_LEGEND_LABEL", { ns: "user_profile_screen_translations" }),
                            config: {
                                color: processColor('#e65100'),
                                barShadowColor: processColor('#f0f0f0'),
                                highlightAlpha: 90,
                                highlightColor: processColor('red'),
                                valueTextSize: 12
                            },
                        }],
                        config: {
                            barWidth: 0.7,
                        },
                    }}
                    xAxis={{
                        valueFormatter: [
                            t("WEEK_DAY_MONDAY_SHORT"),
                            t("WEEK_DAY_TUESDAY_SHORT"),
                            t("WEEK_DAY_WEDNESDAY_SHORT"),
                            t("WEEK_DAY_THURSDAY_SHORT"),
                            t("WEEK_DAY_FRIDAY_SHORT"),
                            t("WEEK_DAY_SATURDAY_SHORT"),
                            t("WEEK_DAY_SUNDAY_SHORT")
                        ],
                        granularityEnabled: true,
                        granularity: 1,
                        drawLabels: true,
                        position: 'BOTTOM',
                        textSize: 14
                    }}
                    yAxis={{
                        left: {
                            axisMinimum: 0,
                            drawGridLines: true,
                            textSize: 14
                        },
                        right: {
                            enabled: false,
                        },
                    }}
                    animation={{
                        durationX: 600,
                    }}
                    legend={{
                        enabled: true,
                        textSize: 14,
                        form: 'SQUARE',
                    }}
                    chartDescription={{ text: '' }}
                    drawValueAboveBar={true}
                    drawBarShadow={false}
                    marker={{
                        enabled: true,
                        markerColor: processColor('#2c3e50'),
                        textColor: processColor('#ffffff'),
                        textSize: 14,
                    }}
                /> : <Text>{t("NO_HISTORICAL_DATA_FOR_CURRENT_WEEK", { ns: "user_profile_screen_translations" })}</Text>}

                <StandardButton title={t("REGISTER_NEW_ENTRY_IN_HISTORICAL_BUTTON_TEXT", { ns: "user_profile_screen_translations" })} 
                    onPress={() => setRegisterNewEntryModalVisible(true)} />

                <StandardButton title={t("GO_A_WEEK_BACKWARDS_BUTTON_TEXT", { ns: "user_profile_screen_translations" })} 
                    onPress={() => {
                        setMoveWeek(0);
                        setReloadTrigger(prev => prev + 1);
                    }} />
                
                <StandardButton title={t("GO_A_WEEK_FORWARD_BUTTON_TEXT", { ns: "user_profile_screen_translations" })} 
                    onPress={() => {
                        setMoveWeek(1);
                        setReloadTrigger(prev => prev + 1);
                    }} />
            </View>
        );
    }

    const registerNewEntry = async () => {
        setRegisterNewEntryModalVisible(false);
        setLoadingModalMessage(t("REGISTER_NEW_ENTRY_LOADING_MODAL_MESSAGE", { ns: "user_profile_screen_translations" }));
        setLoadingModalVisible(true);

        try {
            const newEntry: RegisterDailyStepsHistoricalEntryDTO = 
                new RegisterDailyStepsHistoricalEntryDTO(convertDate(entryDate), Number(numberOfSteps));

            const response: ApiInformationResponse = await postRegisterNewDailyStepsHistoricalEntry(customHeadersMap, newEntry);
            console.log("Response");
            console.log(response);
            setRegisteredNewEntrySuccess(true);

            setLoadingModalVisible(false);
            setInformationModalMessage(response.message);
            setInformationModalVariant(InformationModalVariant.SUCCESS);
            setInformationModalVisible(true);
        } catch (error) {
            let errorMessage = t("NETWORK_UNKNOW_ERROR");

            if (error instanceof Error) {
                console.error(error);
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

            setLoadingModalVisible(false);
            setInformationModalMessage(errorMessage);
            setInformationModalVariant(InformationModalVariant.ERROR);
            setInformationModalVisible(true);
        } finally {
            setEntryDate("");
            setNumberOfSteps("");
        }
    }
    
    const renderRegisterNewEntryModalContent = () => {
        return (
            <View style={{gap: 20}}>

                

                <FormTextInput labelText={t("REGISTER_NEW_ENTRY_MODAL_ENTRY_DATE_INPUT_LABEL", { ns: "user_profile_screen_translations" })}
                    placeholder={t("REGISTER_NEW_ENTRY_MODAL_ENTRY_DATE_INPUT_PLACEHOLDER", { ns: "user_profile_screen_translations" })}
                    validateFunction={validateEntryDate} mandatory={true} value={entryDate}
                    setValue={(entryDate: string) => setEntryDate(entryDate)}
                    formTextInputContainerStyle={stepsHistoricalScreenStyles.formTextInputContainerStyle}
                />

                <FormTextInput labelText={t("REGISTER_NEW_ENTRY_MODAL_NUMBER_OF_STEPS_INPUT_LABEL", { ns: "user_profile_screen_translations" })}
                    placeholder={t("REGISTER_NEW_ENTRY_MODAL_NUMBER_OF_STEPS_INPUT_PLACEHOLDER", { ns: "user_profile_screen_translations" })}
                    validateFunction={validateEntryDate} mandatory={true} value={numberOfSteps}
                    setValue={(entryDate: string) => setNumberOfSteps(entryDate)}
                    formTextInputContainerStyle={stepsHistoricalScreenStyles.formTextInputContainerStyle}
                />

                <StandardButton title={t("ACCEPT_BUTTON_TEXT")} onPress={() => {registerNewEntry();}} />
            </View>
        );
    }
    
    return(
        <SafeAreaView style={{ flex: 1, backgroundColor: "whitesmoke" }}>
            <ScrollView contentContainerStyle={stepsHistoricalScreenStyles.mainView}>

                <InformationModal visible={informationModalVisible} message={informationModalMessage}
                    acceptButtonText={t("ACCEPT_BUTTON_TEXT")} variant={informationModalVariant}
                    acceptButtonOnPress={() => {
                        setInformationModalVisible(false);
                        if (registeredNewEntrySuccess) {
                            //Reset success flag
                            setRegisteredNewEntrySuccess(false);
                            
                            //Reset move week flag
                            setMoveWeek(null);
                            
                            //Triggers re-render
                            setReloadTrigger(prev => prev + 1);
                        }
                    }}
                />

                <LoadingModal visible={loadingModalVisible} message={loadingModalMessage}/>

                <ContainerModal title={t("REGISTER_NEW_ENTRY_IN_HISTORICAL_BUTTON_TEXT", { ns: "user_profile_screen_translations" })}
                    visible={registerNewEntryModalVisible} renderContent={renderRegisterNewEntryModalContent}
                    onRequestClose={() => setRegisterNewEntryModalVisible(false)} style={{ width: width * 0.9 }}
                />

                {loading ? <ActivityIndicator size="large" style={{ margin: 20 }} color="#a80a2e" /> :
                    renderContent()}
                
            </ScrollView>
        </SafeAreaView>
    );
}

function convertDate(fecha: string): string {
  const [day, month, year] = fecha.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

function addWeeks(date: string, weeks: number): string {
  const fecha = new Date(date);
  fecha.setDate(fecha.getDate() + weeks * 7);

  const yyyy = fecha.getFullYear();
  const mm = String(fecha.getMonth() + 1).padStart(2, '0');
  const dd = String(fecha.getDate()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}`;
}

function convertDayToddMMyyyy(date: string): string {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

const validateEntryDate = (entryDate: string): FormTextInputValidationResult => {
    const validationResult: FormTextInputValidationResult = {
        validationResult: true,
        errorMessage: ""
    };

    return validationResult;
}

const stepsHistoricalScreenStyles = StyleSheet.create({
    mainView:
    {
        backgroundColor: 'whitesmoke',
        padding: 20,
        gap: 10
    },

    chart: {
        height: 400,
        width: '100%',
    },

    weekTitle: {
        fontSize: 16,
        fontWeight: "600",
        backgroundColor: "#a80a2e",
        padding: 10,
        color: "white"
    },

    chartTitle: {
        fontSize: 14,
        padding: 10,
        color: "white",
        fontWeight: "600"
    },

    formTextInputContainerStyle:
    {
        flex: 0,
        width: '100%',
        height: 85
    }
});

export default StepsHistoricalScreen;