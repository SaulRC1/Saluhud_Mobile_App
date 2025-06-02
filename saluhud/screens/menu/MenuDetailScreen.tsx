import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MenusScreenStackParamList } from "@root/App";
import { useSaluhudMobileAppAuthenticationContext } from "@src/global/SaluhudMobileAppContext";
import { useTranslation } from "react-i18next";
import SaluhudMobileAppConfiguration from "@resources/saluhud_mobile_app_configuration.json";
import { useCallback, useEffect, useState } from "react";
import InformationModal, { InformationModalVariant } from "@components/modal/InformationModal";
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import ApiErrorException from "@src/exception/ApiErrorException";
import MenuDayDTO from "@src/dto/nutrition/MenuDayDTO";
import StandardButton from "@components/buttons/StandardButton";
import ContainerModal from "@components/modal/ContainerModal";
import LoadingModal from "@components/modal/LoadingModal";
import MenuDayCard from "@components/nutrition/menu/MenuDayCard";
import { getMenuDetailData, postAddMenuDayToMenu, removeMenuDayFromMenu } from "@src/api/SaluhudMobileAppApiService";
import { fromWeekDayName, WeekDayEnum } from "@src/entity/WeekDayEnum";
import MondayIcon from "@resources/icons/monday-icon.svg";
import TuesdayIcon from "@resources/icons/tuesday-icon.svg";
import WednesdayIcon from "@resources/icons/wednesday-icon.svg";
import ThursdayIcon from "@resources/icons/thursday-icon.svg";
import FridayIcon from "@resources/icons/friday-icon.svg";
import SaturdayIcon from "@resources/icons/saturday-icon.svg";
import SundayIcon from "@resources/icons/sunday-icon.svg";
import i18next from "i18next";
import FormTextInput from "@components/inputs/FormTextInput";
import StandardDropdown from "@components/inputs/StandardDropdown";
import ApiInformationResponse from "@src/response/ApiInformationResponse";
import AddMenuDayToMenuDTO from "@src/dto/nutrition/AddMenuDayToMenuDTO";

type MenuDetailScreenNavigationProp = StackNavigationProp<MenusScreenStackParamList, "Menu_Detail_Screen">;
type MenuDetailRouteProp = RouteProp<MenusScreenStackParamList, 'Menu_Detail_Screen'>;

const MenuDetailScreen = () => {
    const route = useRoute<MenuDetailRouteProp>();
    const { t } = useTranslation();
    const navigation = useNavigation<MenuDetailScreenNavigationProp>();
    let customHeadersMap = new Map<string, string>();
    const saluhudMobileAppAuthenticationContext = useSaluhudMobileAppAuthenticationContext();
    const [loading, setLoading] = useState<boolean>(false);
    customHeadersMap.set(SaluhudMobileAppConfiguration.jwtHttpHeader, saluhudMobileAppAuthenticationContext.jwt);
    const [informationModalVisible, setInformationModalVisible] = useState(false);
    const [informationModalMessage, setInformationModalMessage] = useState("");
    const [informationModalVariant, setInformationModalVariant] = useState(InformationModalVariant.ERROR);
    const { width, height } = useWindowDimensions();
    const [menuDays, setMenuDays] = useState<MenuDayDTO[]>([]);
    const [loadingModalVisible, setLoadingModalVisible] = useState(false);
    const [loadingModalMessage, setLoadingModalMessage] = useState("");
    const [addNewMenuDayModalVisible, setAddNewMenuDayModalVisible] = useState(false);
    const [newMenuDayWeekDay, setNewMenuDayWeekDay] = useState("");
    const weekDaysData = [
        {label: t("WEEK_DAY_MONDAY"), value: "MONDAY"},
        {label: t("WEEK_DAY_TUESDAY"), value: "TUESDAY"},
        {label: t("WEEK_DAY_WEDNESDAY"), value: "WEDNESDAY"},
        {label: t("WEEK_DAY_THURSDAY"), value: "THURSDAY"},
        {label: t("WEEK_DAY_FRIDAY"), value: "FRIDAY"},
        {label: t("WEEK_DAY_SATURDAY"), value: "SATURDAY"},
        {label: t("WEEK_DAY_SUNDAY"), value: "SUNDAY"}
    ]
    const [addNewMenuDaySuccess, setAddNewMenuDaySuccess] = useState(false);
    const [reloadTrigger, setReloadTrigger] = useState(0);
    const [menuDayOptionsModalVisible, setMenuDayOptionsModalVisible] = useState(false);
    const [targetedMenuDayId, setTargetedMenuDayId] = useState<bigint>(0n);
    const [removedMenuDaySuccess, setRemovedMenuDaySuccess] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const menuDays: MenuDayDTO[] = await getMenuDetailData(customHeadersMap, route.params.menuID);
            console.log(menuDays);
            setMenuDays(menuDays);
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

            let informationModalVisible: boolean = true;
            if ((error as Error).name === "ApiErrorException") {
                let apiError: ApiErrorException = error as ApiErrorException;

                informationModalVisible = apiError.httpCode !== 404;
            }

            setInformationModalVisible(informationModalVisible);

        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [reloadTrigger]);

    const renderMenuDayCardItem = useCallback(({ item }: { item: MenuDayDTO }) => (
        <MenuDayCard icon={getMenuDayCardIcon(item.weekDay)} id={item.id} weekDay={getMenuDayCardWeekDayTranslation(item.weekDay)} 
            style={{width: width - 20}}
            onPress={() => {
                navigation.navigate('Menu_Day_Detail_Screen', {
                    menuDayID: item.id
                });
            }}

            onLongPress={() => {
                setTargetedMenuDayId(item.id);
                setMenuDayOptionsModalVisible(true);
            }}
        />
    ), []);

    const renderContent = () => {
        return (
            <>
                {
                    menuDays.length > 0 ?
                        <FlatList
                            data={menuDays}
                            renderItem={renderMenuDayCardItem}
                            contentContainerStyle={menuDetailScreenStyles.menuListContentContainer}
                            style={menuDetailScreenStyles.menuList}
                            onEndReached={() => { }}
                            onEndReachedThreshold={0.5}
                        />
                        :
                        <Text style={menuDetailScreenStyles.noDataMessage}>
                            {t("NO_MENU_DAY_DATA_FOR_THIS_MENU_MESSAGE", { ns: "menus_screen_translations" })}
                        </Text>
                }
                <StandardButton title={t("ADD_MENU_DAY_TO_MENU_BUTTON_TEXT", { ns: "menus_screen_translations" })} 
                    onPress={() => setAddNewMenuDayModalVisible(true)}/>
            </>
        );
    }

    const onNewMenuDayAdded = async (newMenuDayWeekDay: string) => {
        setAddNewMenuDayModalVisible(false);
        
        try {
            setLoadingModalMessage(t("ADDING_NEW_MENU_DAY_TO_MENU_LOADING_MODAL_MESSAGE", { ns: "menus_screen_translations" }));
            setLoadingModalVisible(true);

            const response: ApiInformationResponse = await postAddMenuDayToMenu(customHeadersMap, 
                new AddMenuDayToMenuDTO(route.params.menuID, newMenuDayWeekDay));
            setAddNewMenuDaySuccess(true);

            setLoadingModalVisible(false);
            setInformationModalMessage(response.message);
            setInformationModalVariant(InformationModalVariant.SUCCESS);
            setInformationModalVisible(true);
        } catch (error) {
            console.error(error);
            let errorMessage = t("NETWORK_UNKNOW_ERROR");

            if (error instanceof Error) {
                switch (error.name) {
                    case "AbortError":
                        errorMessage = t("NETWORK_TIMEOUT_ERROR");
                        break;
                    case "ApiErrorException":
                        console.log(error.message);
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
            setNewMenuDayWeekDay("");
        }
    }

    const renderAddNewMenuDayModalContent = () => {
        return (
            <View>
                <StandardDropdown label={t("ADD_NEW_MENU_DAY_TO_MENU_LABEL", { ns: "menus_screen_translations" })}
                    data={weekDaysData} mode={"modal"} value={newMenuDayWeekDay} setValue={setNewMenuDayWeekDay} 
                    placeholder={t("ADD_NEW_MENU_DAY_TO_MENU_PLACEHOLDER", { ns: "menus_screen_translations" })} />
            </View>
        );
    }

    const renderAddNewMenuDayModalFooter = () => {
        return (
            <View style={{ padding: 15, flexDirection: "row", gap: 10 }}>
                <StandardButton style={{ flex: 1 }} 
                    title={t("ACCEPT_BUTTON_TEXT")}
                    onPress={() => {
                        onNewMenuDayAdded(newMenuDayWeekDay);
                    }} disabled={newMenuDayWeekDay === ""}/>
                <StandardButton style={{ flex: 1 }} 
                    title={t("CANCEL_BUTTON_TEXT")}
                    onPress={() => {
                        setAddNewMenuDayModalVisible(false);
                        setNewMenuDayWeekDay("");
                    }} />
            </View>
        );
    }

    const onRemoveMenuDayFromMenu = async (menuDayId: bigint) => {
        setMenuDayOptionsModalVisible(false);
        
        try {
            setLoadingModalMessage(t("REMOVING_MENU_DAY_FROM_MENU_LOADING_MODAL_MESSAGE", { ns: "menus_screen_translations" }));
            setLoadingModalVisible(true);

            const response: ApiInformationResponse = await removeMenuDayFromMenu(customHeadersMap, route.params.menuID, menuDayId);
            setRemovedMenuDaySuccess(true);

            setLoadingModalVisible(false);
            setInformationModalMessage(response.message);
            setInformationModalVariant(InformationModalVariant.SUCCESS);
            setInformationModalVisible(true);
        } catch (error) {
            console.error(error);
            let errorMessage = t("NETWORK_UNKNOW_ERROR");

            if (error instanceof Error) {
                switch (error.name) {
                    case "AbortError":
                        errorMessage = t("NETWORK_TIMEOUT_ERROR");
                        break;
                    case "ApiErrorException":
                        console.log(error.message);
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
        }
    }

    const renderMenuDayOptionsModalContent = () => {
        return (
            <View>
                <StandardButton style={{ flex: 1 }} 
                    title={t("DELETE_BUTTON_TEXT")}
                    onPress={() => {
                        onRemoveMenuDayFromMenu(targetedMenuDayId);
                    }} 
                />
            </View>
        );
    }

    return(
        <SafeAreaView style={menuDetailScreenStyles.mainView}>

            <InformationModal visible={informationModalVisible} message={informationModalMessage}
                acceptButtonText={t("ACCEPT_BUTTON_TEXT")} variant={informationModalVariant}
                acceptButtonOnPress={() => { 
                    setInformationModalVisible(false);
                    if(addNewMenuDaySuccess || removedMenuDaySuccess) {
                        //Reset success flag
                        setAddNewMenuDaySuccess(false);

                        setRemovedMenuDaySuccess(false);
                        
                        //Triggers re-render
                        setReloadTrigger(prev => prev + 1);
                    } 
                }} 
            />
            
            <ContainerModal title={t("ADD_MENU_DAY_TO_MENU_BUTTON_TEXT", { ns: "menus_screen_translations" })} 
                visible={addNewMenuDayModalVisible} renderContent={renderAddNewMenuDayModalContent} 
                onRequestClose={() => setAddNewMenuDayModalVisible(false)} style={{width: width * 0.9}}
                renderFooter={renderAddNewMenuDayModalFooter}
            />

            <ContainerModal title={t("MENU_DAY_OPTIONS_MODAL_TITLE", { ns: "menus_screen_translations" })} 
                visible={menuDayOptionsModalVisible} renderContent={renderMenuDayOptionsModalContent} 
                onRequestClose={() => setMenuDayOptionsModalVisible(false)} style={{width: width * 0.9}}
            />

            <LoadingModal visible={loadingModalVisible} message={loadingModalMessage}/>

            {loading ? <ActivityIndicator size="large" style={{ margin: 20 }} color="#a80a2e" /> :
                renderContent()}
        </SafeAreaView>
    );
}

const getMenuDayCardIcon = (weekDay: string) => {
    const weekDayEnum = fromWeekDayName(weekDay);

    if(weekDayEnum === undefined || weekDayEnum === null) {
        return MondayIcon;
    }

    switch(weekDayEnum) {
        case WeekDayEnum.MONDAY:
            return MondayIcon;
        case WeekDayEnum.TUESDAY:
            return TuesdayIcon;
        case WeekDayEnum.WEDNESDAY:
            return WednesdayIcon;
        case WeekDayEnum.THURSDAY:
            return ThursdayIcon;
        case WeekDayEnum.FRIDAY:
            return FridayIcon;
        case WeekDayEnum.SATURDAY:
            return SaturdayIcon;
        case WeekDayEnum.SUNDAY:
            return SundayIcon;
        default:
            return MondayIcon;
    }
}

const getMenuDayCardWeekDayTranslation = (weekDay: string) => {
    const weekDayEnum = fromWeekDayName(weekDay);

    if(weekDayEnum === undefined || weekDayEnum === null) {
        return "";
    }

    switch(weekDayEnum) {
        case WeekDayEnum.MONDAY:
            return i18next.t("MENU_DAY_MONDAY_TEXT", { ns: "menus_screen_translations" });
        case WeekDayEnum.TUESDAY:
            return i18next.t("MENU_DAY_TUESDAY_TEXT", { ns: "menus_screen_translations" });;
        case WeekDayEnum.WEDNESDAY:
            return i18next.t("MENU_DAY_WEDNESDAY_TEXT", { ns: "menus_screen_translations" });;
        case WeekDayEnum.THURSDAY:
            return i18next.t("MENU_DAY_THURSDAY_TEXT", { ns: "menus_screen_translations" });;
        case WeekDayEnum.FRIDAY:
            return i18next.t("MENU_DAY_FRIDAY_TEXT", { ns: "menus_screen_translations" });;
        case WeekDayEnum.SATURDAY:
            return i18next.t("MENU_DAY_SATURDAY_TEXT", { ns: "menus_screen_translations" });;
        case WeekDayEnum.SUNDAY:
            return i18next.t("MENU_DAY_SUNDAY_TEXT", { ns: "menus_screen_translations" });;
        default:
            return "";
    }
}

const menuDetailScreenStyles = StyleSheet.create({
    mainView: { 
        flex: 1, 
        backgroundColor: "whitesmoke", 
        justifyContent: "center", 
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 10 
    },

    menuList: {
        backgroundColor: "whitesmoke",
        marginBottom: 10,
        width: "100%",
        flex: 1
    },

    menuListContentContainer: {
        gap: 20,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "whitesmoke"
    },

    noDataMessage: {
        fontSize: 20,
        marginBottom: 18,
    },

    formTextInputContainerStyle:
    {
        flex: 0,
        width: '100%',
        height: 85
    }
});

export default MenuDetailScreen;