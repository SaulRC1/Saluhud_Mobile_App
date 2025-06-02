import StandardButton from "@components/buttons/StandardButton";
import FormTextInput from "@components/inputs/FormTextInput";
import ContainerModal from "@components/modal/ContainerModal";
import InformationModal, { InformationModalVariant } from "@components/modal/InformationModal";
import LoadingModal from "@components/modal/LoadingModal";
import RecipeCard from "@components/recipe/RecipeCard";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MenusScreenStackParamList } from "@root/App";
import ApiErrorException from "@src/exception/ApiErrorException";
import { useSaluhudMobileAppAuthenticationContext } from "@src/global/SaluhudMobileAppContext";
import ApiInformationResponse from "@src/response/ApiInformationResponse";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import SaluhudMobileAppConfiguration from "@resources/saluhud_mobile_app_configuration.json";
import MenuDayDetailDTO from "@src/dto/nutrition/MenuDayDetailDTO";
import { getMenuDayDetailData, getRecipesNameAndIdData, postAddRecipeToMenuDay, removeRecipeFromMenuDay } from "@src/api/SaluhudMobileAppApiService";
import MenuDayRecipeDTO from "@src/dto/nutrition/MenuDayRecipeDTO";
import { mapRecipeCardAllergenicDTOToAllergenicEnum } from "@src/entity/AllergenicEnum";
import MenuDayRecipeCard from "@components/nutrition/menu/MenuDayRecipeCard";
import StandardDropdown from "@components/inputs/StandardDropdown";
import RecipeNameAndIdDataDTO from "@src/dto/nutrition/RecipeNameAndIdDataDTO";
import AddRecipeToMenuDayDTO from "@src/dto/nutrition/AddRecipeToMenuDayDTO";

type MenuDayDetailScreenNavigationProp = StackNavigationProp<MenusScreenStackParamList, "Menu_Day_Detail_Screen">;
type MenuDayDetailRouteProp = RouteProp<MenusScreenStackParamList, 'Menu_Day_Detail_Screen'>;

const MenuDayDetailScreen = () => {
    const route = useRoute<MenuDayDetailRouteProp>();
    const { t } = useTranslation();
    const navigation = useNavigation<MenuDayDetailScreenNavigationProp>();
    let customHeadersMap = new Map<string, string>();
    const saluhudMobileAppAuthenticationContext = useSaluhudMobileAppAuthenticationContext();
    const [loading, setLoading] = useState<boolean>(false);
    const [menuDayDetail, setMenuDayDetail] = useState<MenuDayDetailDTO | null>(null);
    customHeadersMap.set(SaluhudMobileAppConfiguration.jwtHttpHeader, saluhudMobileAppAuthenticationContext.jwt);
    const [informationModalVisible, setInformationModalVisible] = useState(false);
    const [informationModalMessage, setInformationModalMessage] = useState("");
    const [informationModalVariant, setInformationModalVariant] = useState(InformationModalVariant.ERROR);
    const { width, height } = useWindowDimensions();
    const [addNewRecipeToMenuDayModal, setAddNewRecipeToMenuDayModal] = useState(false);
    const [newMenuName, setNewMenuName] = useState("");
    const [loadingModalVisible, setLoadingModalVisible] = useState(false);
    const [loadingModalMessage, setLoadingModalMessage] = useState("");
    const [reloadTrigger, setReloadTrigger] = useState(0);
    const [addedRecipeToMenuDaySuccess, setAddedRecipeToMenuDaySuccess] = useState(false);
    const [newRecipeStartTime, setNewRecipeStartTime] = useState("");
    const [newRecipeEndTime, setNewRecipeEndTime] = useState("");
    const timeSpanData = generateTimeSpanData();
    const [recipesNameAndIdData, setRecipesNameAndIdData] = useState<{ label: string, value: string }[]>([]);
    const [newRecipeId, setNewRecipeId] = useState("");
    const [recipeSettingsModalVisible, setRecipeSettingsModalVisible] = useState(false);
    const [targetedMenuDayRecipeId, setTargetedMenuDayRecipeId] = useState(0n);
    const [removedRecipeFromMenuDaySuccess, setRemovedRecipeFromMenuDaySuccess] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const menuDayDetail: MenuDayDetailDTO = await getMenuDayDetailData(customHeadersMap, route.params.menuDayID);
            console.log(menuDayDetail);
            setMenuDayDetail(menuDayDetail);
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

    const fetchRecipesNameAndIdData = async () => {
        setRecipesNameAndIdData(await getRecipeNameAndIdDataLabelValue(customHeadersMap));
    }

    useEffect(() => {
        fetchData();
        fetchRecipesNameAndIdData();
    }, [reloadTrigger]);

    const renderMenuCardItem = useCallback(({ item }: { item: MenuDayRecipeDTO }) => (
        <MenuDayRecipeCard id={item.recipe.recipeID} name={item.recipe.recipeName} style={{ width: width - 20 }}
            onPress={() => {
                navigation.navigate('Menu_Day_Recipe_Detail_Screen', {
                    recipeID: item.recipe.recipeID
                });
            }}

            onLongPress={() => {
                setRecipeSettingsModalVisible(true);
                setTargetedMenuDayRecipeId(item.id);
            }}

            kilocalories={item.recipe.recipeKcal}
            allergenics={mapRecipeCardAllergenicDTOToAllergenicEnum(item.recipe.recipeAllergenics)}
            imageSource={item.recipe.recipeImageSource} startTime={item.startTime} endTime={item.endTime}
        />
    ), []);

    const renderContent = () => {
        return (
            <>
                {
                    menuDayDetail?.menuDayRecipes !== undefined && menuDayDetail.menuDayRecipes.length > 0 ?
                        <FlatList
                            data={menuDayDetail?.menuDayRecipes}
                            renderItem={renderMenuCardItem}
                            contentContainerStyle={menuDayDetailScreenStyles.menuListContentContainer}
                            style={menuDayDetailScreenStyles.menuList}
                            onEndReached={() => { }}
                            onEndReachedThreshold={0.5}
                        />
                        :
                        <Text style={menuDayDetailScreenStyles.noDataMessage}>
                            {t("NO_RECIPE_DATA_IN_MENU_DAY_ERROR_MESSAGE", { ns: "menus_screen_translations" })}
                        </Text>
                }
                <StandardButton title={t("ADD_NEW_RECIPE_TO_MENU_DAY_BUTTON_TEXT", { ns: "menus_screen_translations" })} 
                    onPress={() => setAddNewRecipeToMenuDayModal(true)} style={{width: "80%", height: 50}}/>
            </>
        );
    }

    const onAddRecipeToMenuDay = async (newRecipeId: string, newRecipeStartTime: string, newRecipeEndTime: string) => {
        setAddNewRecipeToMenuDayModal(false);
        
        try {
            setLoadingModalMessage(t("ADDING_NEW_RECIPE_TO_MENU_DAY_LOADING_MODAL_MESSAGE", { ns: "menus_screen_translations" }));
            setLoadingModalVisible(true);

            const newRecipeToBeAdded: AddRecipeToMenuDayDTO = new AddRecipeToMenuDayDTO(route.params.menuDayID, 
                newRecipeId, newRecipeStartTime, newRecipeEndTime);

            console.log(newRecipeToBeAdded);

            const response: ApiInformationResponse = await postAddRecipeToMenuDay(customHeadersMap, newRecipeToBeAdded);
            setAddedRecipeToMenuDaySuccess(true);

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
            setNewRecipeStartTime("");
            setNewRecipeEndTime("");
            setNewRecipeId("");
        }
    }

    const renderAddRecipeToMenuDayModalContent = () => {
        return (
            <View style={{gap: 20}}>
                <StandardDropdown label={t("ADD_NEW_RECIPE_TO_MENU_DAY_START_TIME_LABEL", { ns: "menus_screen_translations" })}
                    data={timeSpanData} mode={"modal"} value={newRecipeStartTime} setValue={setNewRecipeStartTime} 
                    placeholder={t("ADD_NEW_RECIPE_TO_MENU_DAY_START_TIME_PLACEHOLDER", { ns: "menus_screen_translations" })} />
                
                <StandardDropdown label={t("ADD_NEW_RECIPE_TO_MENU_DAY_END_TIME_LABEL", { ns: "menus_screen_translations" })}
                    data={timeSpanData} mode={"modal"} value={newRecipeEndTime} setValue={setNewRecipeEndTime} 
                    placeholder={t("ADD_NEW_RECIPE_TO_MENU_DAY_END_TIME_PLACEHOLDER", { ns: "menus_screen_translations" })} />
                
                <StandardDropdown label={t("ADD_NEW_RECIPE_TO_MENU_DAY_RECIPE_LABEL", { ns: "menus_screen_translations" })}
                    data={recipesNameAndIdData} mode={"modal"} value={newRecipeId} setValue={setNewRecipeId} 
                    placeholder={t("ADD_NEW_RECIPE_TO_MENU_DAY_RECIPE_PLACEHOLDER", { ns: "menus_screen_translations" })} />
            </View>
        );
    }

    const renderAddRecipeToMenuDayModalFooter = () => {
        return (
            <View style={{ padding: 15, flexDirection: "row", gap: 10 }}>
                <StandardButton style={{ flex: 1 }} 
                    title={t("ACCEPT_BUTTON_TEXT")}
                    onPress={() => {
                        onAddRecipeToMenuDay(newRecipeId, newRecipeStartTime, newRecipeEndTime);
                    }} disabled={newRecipeId === "" || newRecipeStartTime === "" || newRecipeEndTime === ""}/>
                <StandardButton style={{ flex: 1 }} 
                    title={t("CANCEL_BUTTON_TEXT")}
                    onPress={() => {
                        setAddNewRecipeToMenuDayModal(false);
                        setNewRecipeStartTime("");
                        setNewRecipeEndTime("");
                        setNewRecipeId("");
                    }} />
            </View>
        );
    }

    const onRemoveRecipeFromMenuDay = async (recipeId: bigint) => {
        setRecipeSettingsModalVisible(false);
        
        try {
            setLoadingModalMessage(t("REMOVING_RECIPE_FROM_MENU_DAY_LOADING_MODAL_MESSAGE", { ns: "menus_screen_translations" }));
            setLoadingModalVisible(true);

            const response: ApiInformationResponse = await removeRecipeFromMenuDay(customHeadersMap, route.params.menuDayID, recipeId);
            setRemovedRecipeFromMenuDaySuccess(true);

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
        }
    }

    const renderRecipeSettingsModalContent = () => {
        return (
            <View style={{gap: 20}}>
                <StandardButton style={{ flex: 1 }} 
                    title={t("DELETE_BUTTON_TEXT")}
                    onPress={() => {
                        onRemoveRecipeFromMenuDay(targetedMenuDayRecipeId);
                    }} />
            </View>
        );
    }

    return(
        <SafeAreaView style={menuDayDetailScreenStyles.mainView}>

            <InformationModal visible={informationModalVisible} message={informationModalMessage}
                acceptButtonText={t("ACCEPT_BUTTON_TEXT")} variant={informationModalVariant}
                acceptButtonOnPress={() => { 
                    setInformationModalVisible(false);
                    if(addedRecipeToMenuDaySuccess || removedRecipeFromMenuDaySuccess) {
                        //Reset success flag
                        setAddedRecipeToMenuDaySuccess(false);
                        setRemovedRecipeFromMenuDaySuccess(false);
                        
                        //Triggers re-render
                        setReloadTrigger(prev => prev + 1);
                    } 
                }} 
            />
            
            <ContainerModal title={t("ADD_NEW_RECIPE_TO_MENU_DAY_BUTTON_TEXT", { ns: "menus_screen_translations" })} 
                visible={addNewRecipeToMenuDayModal} renderContent={renderAddRecipeToMenuDayModalContent} 
                onRequestClose={() => setAddNewRecipeToMenuDayModal(false)} style={{width: width * 0.9}}
                renderFooter={renderAddRecipeToMenuDayModalFooter}
            />

            <ContainerModal title={t("RECIPE_OPTIONS_MODAL_TITLE", { ns: "menus_screen_translations" })} 
                visible={recipeSettingsModalVisible} renderContent={renderRecipeSettingsModalContent} 
                onRequestClose={() => setRecipeSettingsModalVisible(false)} style={{width: width * 0.9}}
            />

            <LoadingModal visible={loadingModalVisible} message={loadingModalMessage}/>

            {loading ? <ActivityIndicator size="large" style={{ margin: 20 }} color="#a80a2e" /> :
                renderContent()}
        </SafeAreaView>
    );
}

const generateTimeSpanData = (): { label: string, value: string }[] => {
  const intervalos: { label: string, value: string }[] = [];

  for (let hora = 0; hora < 24; hora++) {
    for (let minuto = 0; minuto < 60; minuto += 15) {
      const hh = hora.toString().padStart(2, '0');
      const mm = minuto.toString().padStart(2, '0');
      const tiempo = `${hh}:${mm}`;
      intervalos.push({ label: tiempo, value: tiempo });
    }
  }

  return intervalos;
};

const getRecipeNameAndIdDataLabelValue = async (customHeadersMap: Map<string, string>) => {
    const recipesNameAndIdData: RecipeNameAndIdDataDTO[] = await getRecipesNameAndIdData(customHeadersMap);

    const labelValue: { label: string, value: string }[] = [];

    recipesNameAndIdData.forEach(recipeNameAndIdData =>
        labelValue.push({ label: recipeNameAndIdData.recipeName, value: recipeNameAndIdData.recipeId.toString() }));

    return labelValue;
}

const menuDayDetailScreenStyles = StyleSheet.create({
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

export default MenuDayDetailScreen;