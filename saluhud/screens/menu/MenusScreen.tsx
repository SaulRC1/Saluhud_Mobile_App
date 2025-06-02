import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MenusScreenStackParamList } from "@root/App";
import { useSaluhudMobileAppAuthenticationContext } from "@src/global/SaluhudMobileAppContext";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SaluhudMobileAppConfiguration from "@resources/saluhud_mobile_app_configuration.json";
import { ActivityIndicator, FlatList, NativeSyntheticEvent, SafeAreaView, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import MenuCardDTO from "@src/dto/nutrition/MenuCardDTO";
import { getMenuCardData, postCreateNewMenu, putEditMenu, putSetMenuAsFavourite, removeMenu } from "@src/api/SaluhudMobileAppApiService";
import InformationModal, { InformationModalVariant } from "@components/modal/InformationModal";
import ApiErrorException from "@src/exception/ApiErrorException";
import MenuCard from "@components/nutrition/menu/MenuCard";
import StandardButton from "@components/buttons/StandardButton";
import ContainerModal from "@components/modal/ContainerModal";
import FormTextInput, { FormTextInputValidationResult } from "@components/inputs/FormTextInput";
import i18next from "i18next";
import CreateNewMenuDTO from "@src/dto/nutrition/CreateNewMenuDTO";
import LoadingModal from "@components/modal/LoadingModal";
import ApiInformationResponse from "@src/response/ApiInformationResponse";
import EditMenuDTO from "@src/dto/nutrition/EditMenuDTO";

type MenusScreenNavigationProp = StackNavigationProp<MenusScreenStackParamList, "Menus_Main_Screen">;

const MenusScreen = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<MenusScreenNavigationProp>();
    let customHeadersMap = new Map<string, string>();
    const saluhudMobileAppAuthenticationContext = useSaluhudMobileAppAuthenticationContext();
    const [loading, setLoading] = useState<boolean>(false);
    const [menus, setMenus] = useState<MenuCardDTO[]>([]);
    customHeadersMap.set(SaluhudMobileAppConfiguration.jwtHttpHeader, saluhudMobileAppAuthenticationContext.jwt);
    const [informationModalVisible, setInformationModalVisible] = useState(false);
    const [informationModalMessage, setInformationModalMessage] = useState("");
    const [informationModalVariant, setInformationModalVariant] = useState(InformationModalVariant.ERROR);
    const { width, height } = useWindowDimensions();
    const [createNewMenuModalVisible, setCreateNewMenuModalVisible] = useState(false);
    const [newMenuName, setNewMenuName] = useState("");
    const [loadingModalVisible, setLoadingModalVisible] = useState(false);
    const [loadingModalMessage, setLoadingModalMessage] = useState("");
    const [reloadTrigger, setReloadTrigger] = useState(0);
    const [createNewMenuSuccess, setCreateNewMenuSuccess] = useState(false);
    const [menuOptionsModalVisible, setMenuOptionsModalVisible] = useState(false);
    const [targetedMenuId, setTargetedMenuId] = useState<bigint>(0n);
    const [removeMenuSuccess, setRemoveMenuSuccess] = useState(false);
    const [editMenuModalVisible, setEditMenuModalVisible] = useState(false);
    const [editedMenuSuccess, setEditedMenuSuccess] = useState(false);
    const [menuAsFavouriteSuccess, setMenuAsFavouriteSuccess] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const menuCardData: MenuCardDTO[] = await getMenuCardData(customHeadersMap);
            console.log(menuCardData);
            setMenus(menuCardData);
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

    const renderMenuCardItem = useCallback(({ item }: { item: MenuCardDTO }) => (
        <MenuCard id={item.menuID} name={item.menuName} style={{width: width - 20, height: 60}}
            onPress={() => {
                navigation.navigate('Menu_Detail_Screen', {
                    menuID: item.menuID
                });
            }}

            onLongPress={() => {
                setTargetedMenuId(item.menuID);
                setMenuOptionsModalVisible(true);
            }}
            isFavourite={item.isFavourite}
        />
    ), []);

    const renderContent = () => {
        return (
            <>
                {
                    menus.length > 0 ?
                        <FlatList
                            data={menus}
                            renderItem={renderMenuCardItem}
                            contentContainerStyle={menusScreenStyles.menuListContentContainer}
                            style={menusScreenStyles.menuList}
                            onEndReached={() => { }}
                            onEndReachedThreshold={0.5}
                        />
                        :
                        <Text style={menusScreenStyles.noDataMessage}>
                            {t("NO_MENU_DATA_FOR_THIS_USER_MESSAGE", { ns: "menus_screen_translations" })}
                        </Text>
                }
                <StandardButton title={t("CREATE_NEW_MENU_BUTTON_TEXT", { ns: "menus_screen_translations" })} 
                    onPress={() => setCreateNewMenuModalVisible(true)} style={{width: "80%", height: 50}}/>
            </>
        );
    }

    const onNewMenuCreation = async (newMenuName: string) => {
        setCreateNewMenuModalVisible(false);
        
        try {
            setLoadingModalMessage(t("CREATING_NEW_MENU_LOADING_MODAL_MESSAGE", { ns: "menus_screen_translations" }));
            setLoadingModalVisible(true);

            const response: ApiInformationResponse = await postCreateNewMenu(customHeadersMap, new CreateNewMenuDTO(newMenuName));
            setCreateNewMenuSuccess(true);

            setLoadingModalVisible(false);
            setInformationModalMessage(response.message);
            setInformationModalVariant(InformationModalVariant.SUCCESS);
            setInformationModalVisible(true);
        } catch (error) {
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

            setLoadingModalVisible(false);
            setInformationModalMessage(errorMessage);
            setInformationModalVariant(InformationModalVariant.ERROR);
            setInformationModalVisible(true);
        } finally {
            setNewMenuName("");
        }
    }

    const renderCreateNewMenuModalContent = () => {
        return (
            <View>
                <FormTextInput labelText={t("CREATE_NEW_MENU_MODAL_MENU_NAME_INPUT_LABEL", { ns: "menus_screen_translations" })} 
                    placeholder={t("CREATE_NEW_MENU_MODAL_MENU_NAME_INPUT_PLACEHOLDER", { ns: "menus_screen_translations" })} 
                    validateFunction={validateMenuName} mandatory={true} value={newMenuName} 
                    setValue={(text: string) => setNewMenuName(text)} 
                    formTextInputContainerStyle={menusScreenStyles.formTextInputContainerStyle}
                />
            </View>
        );
    }

    const renderCreateNewMenuModalFooter = () => {
        return (
            <View style={{ padding: 15, flexDirection: "row", gap: 10 }}>
                <StandardButton style={{ flex: 1 }} 
                    title={t("ACCEPT_CREATE_NEW_MENU_BUTTON_TEXT", { ns: "menus_screen_translations" })}
                    onPress={() => {
                        onNewMenuCreation(newMenuName);
                    }} disabled={validateMenuName(newMenuName).validationResult === false}/>
                <StandardButton style={{ flex: 1 }} 
                    title={t("CANCEL_BUTTON_TEXT")}
                    onPress={() => {
                        setCreateNewMenuModalVisible(false);
                        setNewMenuName("");
                    }} />
            </View>
        );
    }

    const onRemoveMenu = async (menuId: bigint) => {
        setMenuOptionsModalVisible(false);
        
        try {
            setLoadingModalMessage(t("REMOVING_MENU_LOADING_MODAL_MESSAGE", { ns: "menus_screen_translations" }));
            setLoadingModalVisible(true);

            const response: ApiInformationResponse = await removeMenu(customHeadersMap, menuId);
            setRemoveMenuSuccess(true);

            setLoadingModalVisible(false);
            setInformationModalMessage(response.message);
            setInformationModalVariant(InformationModalVariant.SUCCESS);
            setInformationModalVisible(true);
        } catch (error) {
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

            setLoadingModalVisible(false);
            setInformationModalMessage(errorMessage);
            setInformationModalVariant(InformationModalVariant.ERROR);
            setInformationModalVisible(true);
        } finally {
        }
    }

    const onSetMenuAsFavourite = async (menuId: bigint) => {
        setMenuOptionsModalVisible(false);
        
        try {
            setLoadingModalMessage(t("SETTING_MENU_AS_FAVOURITE_LOADING_MODAL_MESSAGE", { ns: "menus_screen_translations" }));
            setLoadingModalVisible(true);

            const response: ApiInformationResponse = await putSetMenuAsFavourite(customHeadersMap, menuId);
            setMenuAsFavouriteSuccess(true);

            setLoadingModalVisible(false);
            setInformationModalMessage(response.message);
            setInformationModalVariant(InformationModalVariant.SUCCESS);
            setInformationModalVisible(true);
        } catch (error) {
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

            setLoadingModalVisible(false);
            setInformationModalMessage(errorMessage);
            setInformationModalVariant(InformationModalVariant.ERROR);
            setInformationModalVisible(true);
        } finally {
        }
    }

    const renderMenuOptionsModalContent = () => {
        return (
            <View style={{gap: 20}}>
                <StandardButton style={{ flex: 1 }} 
                    title={t("SET_MENU_AS_FAVORITE_BUTTON_TEXT", { ns: "menus_screen_translations" })}
                    onPress={() => {
                        onSetMenuAsFavourite(targetedMenuId);
                    }}
                />

                <StandardButton style={{ flex: 1 }} 
                    title={t("EDIT_BUTTON_TEXT")}
                    onPress={() => {
                        setMenuOptionsModalVisible(false);
                        setEditMenuModalVisible(true);
                    }}
                />

                <StandardButton style={{ flex: 1 }} 
                    title={t("DELETE_BUTTON_TEXT")}
                    onPress={() => {
                        onRemoveMenu(targetedMenuId);
                    }}
                />
            </View>
        );
    }

    const onMenuModification = async (newMenuName: string) => {
        setEditMenuModalVisible(false);
        
        try {
            setLoadingModalMessage(t("MODIFYING_MENU_LOADING_MODAL_MESSAGE", { ns: "menus_screen_translations" }));
            setLoadingModalVisible(true);

            const response: ApiInformationResponse = await putEditMenu(customHeadersMap, 
                new EditMenuDTO(targetedMenuId, newMenuName));
            setEditedMenuSuccess(true);

            setLoadingModalVisible(false);
            setInformationModalMessage(response.message);
            setInformationModalVariant(InformationModalVariant.SUCCESS);
            setInformationModalVisible(true);
        } catch (error) {
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

            setLoadingModalVisible(false);
            setInformationModalMessage(errorMessage);
            setInformationModalVariant(InformationModalVariant.ERROR);
            setInformationModalVisible(true);
        } finally {
            setNewMenuName("");
        }
    }

    const renderEditMenuModalContent = () => {
        return (
            <View style={{gap: 20}}>
                <FormTextInput labelText={t("CREATE_NEW_MENU_MODAL_MENU_NAME_INPUT_LABEL", { ns: "menus_screen_translations" })} 
                    placeholder={t("CREATE_NEW_MENU_MODAL_MENU_NAME_INPUT_PLACEHOLDER", { ns: "menus_screen_translations" })} 
                    validateFunction={validateMenuName} mandatory={true} value={newMenuName} 
                    setValue={(text: string) => setNewMenuName(text)} 
                    formTextInputContainerStyle={menusScreenStyles.formTextInputContainerStyle}
                />
            </View>
        );
    }
    
    const renderEditMenuModalFooter = () => {
        return (
            <View style={{ padding: 15, flexDirection: "row", gap: 10 }}>
                <StandardButton style={{ flex: 1 }} 
                    title={t("ACCEPT_BUTTON_TEXT")}
                    onPress={() => {
                        onMenuModification(newMenuName);
                    }} disabled={validateMenuName(newMenuName).validationResult === false}/>
                <StandardButton style={{ flex: 1 }} 
                    title={t("CANCEL_BUTTON_TEXT")}
                    onPress={() => {
                        setEditMenuModalVisible(false);
                        setNewMenuName("");
                    }} />
            </View>
        );
    }

    return(
        <SafeAreaView style={menusScreenStyles.mainView}>

            <InformationModal visible={informationModalVisible} message={informationModalMessage}
                acceptButtonText={t("ACCEPT_BUTTON_TEXT")} variant={informationModalVariant}
                acceptButtonOnPress={() => { 
                    setInformationModalVisible(false);
                    if(createNewMenuSuccess || removeMenuSuccess || editedMenuSuccess || menuAsFavouriteSuccess) {
                        //Reset success flags
                        setCreateNewMenuSuccess(false);
                        setRemoveMenuSuccess(false);
                        setEditedMenuSuccess(false);
                        setMenuAsFavouriteSuccess(false);
                        
                        //Triggers re-render
                        setReloadTrigger(prev => prev + 1);
                    } 
                }} 
            />
            
            <ContainerModal title={t("CREATE_NEW_MENU_BUTTON_TEXT", { ns: "menus_screen_translations" })} 
                visible={createNewMenuModalVisible} renderContent={renderCreateNewMenuModalContent} 
                onRequestClose={() => setCreateNewMenuModalVisible(false)} style={{width: width * 0.9}}
                renderFooter={renderCreateNewMenuModalFooter}
            />

            <ContainerModal title={t("MENU_OPTIONS_MODAL_TITLE", { ns: "menus_screen_translations" })} 
                visible={menuOptionsModalVisible} renderContent={renderMenuOptionsModalContent} 
                onRequestClose={() => setMenuOptionsModalVisible(false)} style={{width: width * 0.9}}
            />

            <ContainerModal title={t("EDIT_MENU_MODAL_TITLE", { ns: "menus_screen_translations" })} 
                visible={editMenuModalVisible} renderContent={renderEditMenuModalContent} 
                onRequestClose={() => setEditMenuModalVisible(false)} style={{width: width * 0.9}}
                renderFooter={renderEditMenuModalFooter}
            />

            <LoadingModal visible={loadingModalVisible} message={loadingModalMessage}/>

            {loading ? <ActivityIndicator size="large" style={{ margin: 20 }} color="#a80a2e" /> :
                renderContent()}
        </SafeAreaView>
    );
}

const validateMenuName = (name: string): FormTextInputValidationResult => {
    const validationResult: FormTextInputValidationResult = {
        validationResult: true,
        errorMessage: ""
    };

    if(name === undefined || name === null || name.trim().length === 0) {
        validationResult.validationResult = false;
        validationResult.errorMessage = i18next.t("MENU_NAME_INPUT_EMPTY_NAME_ERROR_MESSAGE", { ns: "menus_screen_translations" });

        return validationResult;
    }

    if(name.trim().length < 2) {
        validationResult.validationResult = false;
        validationResult.errorMessage = i18next.t("MENU_NAME_INPUT_TOO_SHORT_NAME_ERROR_MESSAGE", { ns: "menus_screen_translations" });

        return validationResult;
    }

    if(name.trim().length > 255) {
        validationResult.validationResult = false;
        validationResult.errorMessage = i18next.t("MENU_NAME_INPUT_TOO_LONG_NAME_ERROR_MESSAGE", { ns: "menus_screen_translations" });

        return validationResult;
    }

    return validationResult;
}

const menusScreenStyles = StyleSheet.create({
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

export default MenusScreen;