import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { RootTabParamList } from "@root/App";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import RecipeCard from "@components/recipe/RecipeCard";
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, useWindowDimensions, View } from "react-native";
import RecipeCardDTO from "@src/dto/nutrition/RecipeCardDTO";
import SearchBar from "@components/filter/SearchBar";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useRef, useState } from "react";
import SaluhudMobileAppConfiguration from "@resources/saluhud_mobile_app_configuration.json";
import { executeGetRequest } from "@src/api/SaluhudMobileAppApiService";
import ContainerModal from "@components/modal/ContainerModal";
import StandardButton from "@components/buttons/StandardButton";
import NumericInput, { NumericInputType } from "@components/inputs/NumericInput";
import { AdvancedCheckbox, CheckboxGroup } from "react-native-advanced-checkbox";
import { AllergenicEnum, fromAllergenicId } from "@src/entity/AllergenicEnum";
import RecipeCardAllergenicDTO from "@src/dto/nutrition/RecipeCardAllergenicDTO";
import { useSaluhudMobileAppAuthenticationContext } from "@src/global/SaluhudMobileAppContext";

type RecipesScreenNavigationProp = BottomTabNavigationProp<RootTabParamList, 'Recipes_Screen'>;

function stringToBoolean(value: string | boolean): boolean {
    if(typeof value === "boolean") {
        return value;
    }

    return value.toLowerCase() === 'true';
}

export default function RecipesScreen() {

    const navigation = useNavigation<RecipesScreenNavigationProp>();
    const saluhudMobileAppAuthenticationContext = useSaluhudMobileAppAuthenticationContext();
    let customHeadersMap = new Map<string, string>();
    const {height, width} = useWindowDimensions();
    const { t } = useTranslation();
    const [page, setPage] = useState(0);
    const PAGE_SIZE = 10;
    const [recipes, setRecipes] = useState<RecipeCardDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtersModalVisible, setFiltersModalVisible] = useState(false);
    const [minKcal, setMinKcal] = useState("");
    const [maxKcal, setMaxKcal] = useState("");
    const [excludedAllergenic1, setExcludedAllergenic1] = useState(false);
    const [excludedAllergenic2, setExcludedAllergenic2] = useState(false);
    const [excludedAllergenic3, setExcludedAllergenic3] = useState(false);
    const [excludedAllergenic4, setExcludedAllergenic4] = useState(false);
    const [excludedAllergenic5, setExcludedAllergenic5] = useState(false);
    const [excludedAllergenic6, setExcludedAllergenic6] = useState(false);
    const [excludedAllergenic7, setExcludedAllergenic7] = useState(false);
    const [excludedAllergenic8, setExcludedAllergenic8] = useState(false);
    const [excludedAllergenic9, setExcludedAllergenic9] = useState(false);
    const [excludedAllergenic10, setExcludedAllergenic10] = useState(false);
    const [excludedAllergenic11, setExcludedAllergenic11] = useState(false);
    const [excludedAllergenic12, setExcludedAllergenic12] = useState(false);
    const [excludedAllergenic13, setExcludedAllergenic13] = useState(false);
    const [excludedAllergenic14, setExcludedAllergenic14] = useState(false);
    const [checkedAllergenics, setcheckedAllergenics] = useState<AllergenicEnum[]>([]);
    const [filterRecipeName, setFilterRecipeName] = useState("");
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const recipeCardStyles = StyleSheet.create({
        recipeCard: {
            width: 0.9 * width
        }
    });

    useEffect(() => {
        const getRecipeCardData = async () => {
            setLoading(true);
            try {
                customHeadersMap.set(SaluhudMobileAppConfiguration.jwtHttpHeader, saluhudMobileAppAuthenticationContext.jwt);

                const response = await executeGetRequest(customHeadersMap,"http://" + SaluhudMobileAppConfiguration.backendURL 
                    + SaluhudMobileAppConfiguration.recipeCardDataEndpoint + "?page=" + page + "&pageSize=" + PAGE_SIZE
                    + "&minimumKilocalories=" + minKcal + "&maximumKilocalories=" + maxKcal 
                    + "&excludedAllergenicCodes=" + checkedAllergenics.join(",") + "&filterRecipeName=" + filterRecipeName);

                const responseRecipes: RecipeCardDTO[] = await response.json();

                setRecipes(prev => [...prev, ...responseRecipes]);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }  
        };
        
        getRecipeCardData();
        
    }, [page]);

    const renderRecipeListFooter = () => {
        if(!loading) {
            return null;
        }

        return (<ActivityIndicator size="large" style={{ margin: 20 }} color="#a80a2e" />);
    }

    const mapRecipeCardAllergenicDTOToAllergenicEnum = (recipeAllergenics: RecipeCardAllergenicDTO[]) => {
        let allergenicEnums: AllergenicEnum[] = [];

        recipeAllergenics.forEach((recipeAllergenic) => {
            let allergenicEnum = fromAllergenicId(recipeAllergenic.allergenicId);
            
            if(allergenicEnum !== undefined) {
                allergenicEnums.push(allergenicEnum);
                //console.log("Pushed allergenic: " + allergenicEnum);
            }
        });

        return allergenicEnums;
    }

    const renderRecipeCardItem = useCallback(({ item }: { item: RecipeCardDTO }) => (
    <RecipeCard id={item.recipeID} name={item.recipeName} kilocalories={item.recipeKcal}
    style={recipeCardStyles.recipeCard} imageSource={item.recipeImageSource} 
    allergenics={mapRecipeCardAllergenicDTOToAllergenicEnum(item.recipeAllergenics)}/>), []);

    const FiltersModal = () => {

        const [filterMinKcal, setFilterMinKcal] = useState("");
        const [filterMaxKcal, setFilterMaxKcal] = useState("");
        const [checkedAllergenic1, setCheckedAllergenic1] = useState(false);
        const [checkedAllergenic2, setCheckedAllergenic2] = useState(false);
        const [checkedAllergenic3, setCheckedAllergenic3] = useState(false);
        const [checkedAllergenic4, setCheckedAllergenic4] = useState(false);
        const [checkedAllergenic5, setCheckedAllergenic5] = useState(false);
        const [checkedAllergenic6, setCheckedAllergenic6] = useState(false);
        const [checkedAllergenic7, setCheckedAllergenic7] = useState(false);
        const [checkedAllergenic8, setCheckedAllergenic8] = useState(false);
        const [checkedAllergenic9, setCheckedAllergenic9] = useState(false);
        const [checkedAllergenic10, setCheckedAllergenic10] = useState(false);
        const [checkedAllergenic11, setCheckedAllergenic11] = useState(false);
        const [checkedAllergenic12, setCheckedAllergenic12] = useState(false);
        const [checkedAllergenic13, setCheckedAllergenic13] = useState(false);
        const [checkedAllergenic14, setCheckedAllergenic14] = useState(false);
        const [filterCheckedAllergenics, setFilterCheckedAllergenics] = useState<AllergenicEnum[]>([]);

        useEffect(() => {
            setFilterMinKcal(minKcal);
            setFilterMaxKcal(maxKcal);
            setCheckedAllergenic1(excludedAllergenic1);
            setCheckedAllergenic2(excludedAllergenic2);
            setCheckedAllergenic3(excludedAllergenic3);
            setCheckedAllergenic4(excludedAllergenic4);
            setCheckedAllergenic5(excludedAllergenic5);
            setCheckedAllergenic6(excludedAllergenic6);
            setCheckedAllergenic7(excludedAllergenic7);
            setCheckedAllergenic8(excludedAllergenic8);
            setCheckedAllergenic9(excludedAllergenic9);
            setCheckedAllergenic10(excludedAllergenic10);
            setCheckedAllergenic11(excludedAllergenic11);
            setCheckedAllergenic12(excludedAllergenic12);
            setCheckedAllergenic13(excludedAllergenic13);
            setCheckedAllergenic14(excludedAllergenic14);
            setFilterCheckedAllergenics(checkedAllergenics);
        }, [filtersModalVisible]);

        const onAccept = () => {
            setMinKcal(filterMinKcal);
            setMaxKcal(filterMaxKcal);
            setExcludedAllergenic1(checkedAllergenic1);
            setExcludedAllergenic2(checkedAllergenic2);
            setExcludedAllergenic3(checkedAllergenic3);
            setExcludedAllergenic4(checkedAllergenic4);
            setExcludedAllergenic5(checkedAllergenic5);
            setExcludedAllergenic6(checkedAllergenic6);
            setExcludedAllergenic7(checkedAllergenic7);
            setExcludedAllergenic8(checkedAllergenic8);
            setExcludedAllergenic9(checkedAllergenic9);
            setExcludedAllergenic10(checkedAllergenic10);
            setExcludedAllergenic11(checkedAllergenic11);
            setExcludedAllergenic12(checkedAllergenic12);
            setExcludedAllergenic13(checkedAllergenic13);
            setExcludedAllergenic14(checkedAllergenic14);
            setcheckedAllergenics(filterCheckedAllergenics);

            //Trigger recipes reload with the new applied filters
            setPage(0);
            setRecipes([]);
        }

        const renderFiltersModalContent = () => {
            return(
                <View style={{gap: 15}}>
                    <NumericInput numericInputType={NumericInputType.NUMERIC}
                        label={t("FILTERS_MODAL_MINIMUM_KILOCALORIES_INPUT_LABEL", { ns: "recipes_screen_translations" })}
                        style={{ width: "100%", height: 50 }} value={filterMinKcal} setValue={setFilterMinKcal}/>
    
                    <NumericInput numericInputType={NumericInputType.NUMERIC}
                        label={t("FILTERS_MODAL_MAXIMUM_KILOCALORIES_INPUT_LABEL", { ns: "recipes_screen_translations" })}
                        style={{ width: "100%", height: 50 }} value={filterMaxKcal} setValue={setFilterMaxKcal}/>
                    
                    <Text style={{fontSize: 16, fontWeight: 600, color: "#a80a2e"}}>{t("FILTERS_MODAL_EXCLUDE_ALLERGENICS_LABEL", { ns: "recipes_screen_translations" })}</Text>
                    
                    <View style={{marginBottom: 20}}>
                        <AdvancedCheckbox label={t("ALLERGENIC_1")} value={checkedAllergenic1}
                            onValueChange={(value) => {
                                if(stringToBoolean(value) === true) {
                                    setFilterCheckedAllergenics((prev) => [...prev, AllergenicEnum.GLUTEN]);
                                } else {
                                    setFilterCheckedAllergenics((prev) => prev.filter((item) => item !== AllergenicEnum.GLUTEN));
                                }
                                setCheckedAllergenic1(stringToBoolean(value));
                            }} checkedColor="#a80a2e" />
                        <AdvancedCheckbox label={t("ALLERGENIC_2")} value={checkedAllergenic2}
                            onValueChange={(value) => {
                                if(stringToBoolean(value) === true) {
                                    setFilterCheckedAllergenics((prev) => [...prev, AllergenicEnum.CRUSTACEAN]);
                                } else {
                                    setFilterCheckedAllergenics((prev) => prev.filter((item) => item !== AllergenicEnum.CRUSTACEAN));
                                }
                                setCheckedAllergenic2(stringToBoolean(value));
                            }} checkedColor="#a80a2e" />
                        <AdvancedCheckbox label={t("ALLERGENIC_3")} value={checkedAllergenic3}
                            onValueChange={(value) => {
                                if(stringToBoolean(value) === true) {
                                    setFilterCheckedAllergenics((prev) => [...prev, AllergenicEnum.EGG]);
                                } else {
                                    setFilterCheckedAllergenics((prev) => prev.filter((item) => item !== AllergenicEnum.EGG));
                                }
                                setCheckedAllergenic3(stringToBoolean(value));
                            }} checkedColor="#a80a2e" />
                        <AdvancedCheckbox label={t("ALLERGENIC_4")} value={checkedAllergenic4}
                            onValueChange={(value) => {
                                if(stringToBoolean(value) === true) {
                                    setFilterCheckedAllergenics((prev) => [...prev, AllergenicEnum.FISH]);
                                } else {
                                    setFilterCheckedAllergenics((prev) => prev.filter((item) => item !== AllergenicEnum.FISH));
                                }
                                setCheckedAllergenic4(stringToBoolean(value));
                            }} checkedColor="#a80a2e" />
                        <AdvancedCheckbox label={t("ALLERGENIC_5")} value={checkedAllergenic5}
                            onValueChange={(value) => {
                                if(stringToBoolean(value) === true) {
                                    setFilterCheckedAllergenics((prev) => [...prev, AllergenicEnum.PEANUT]);
                                } else {
                                    setFilterCheckedAllergenics((prev) => prev.filter((item) => item !== AllergenicEnum.PEANUT));
                                }
                                setCheckedAllergenic5(stringToBoolean(value));
                            }} checkedColor="#a80a2e" />
                        <AdvancedCheckbox label={t("ALLERGENIC_6")} value={checkedAllergenic6}
                            onValueChange={(value) => {
                                if(stringToBoolean(value) === true) {
                                    setFilterCheckedAllergenics((prev) => [...prev, AllergenicEnum.SOYA_BEAN]);
                                } else {
                                    setFilterCheckedAllergenics((prev) => prev.filter((item) => item !== AllergenicEnum.SOYA_BEAN));
                                }
                                setCheckedAllergenic6(stringToBoolean(value));
                            }} checkedColor="#a80a2e" />
                        <AdvancedCheckbox label={t("ALLERGENIC_7")} value={checkedAllergenic7}
                            onValueChange={(value) => {
                                if(stringToBoolean(value) === true) {
                                    setFilterCheckedAllergenics((prev) => [...prev, AllergenicEnum.CELERY]);
                                } else {
                                    setFilterCheckedAllergenics((prev) => prev.filter((item) => item !== AllergenicEnum.CELERY));
                                }
                                setCheckedAllergenic7(stringToBoolean(value));
                            }} checkedColor="#a80a2e" />
                        <AdvancedCheckbox label={t("ALLERGENIC_8")} value={checkedAllergenic8}
                            onValueChange={(value) => {
                                if(stringToBoolean(value) === true) {
                                    setFilterCheckedAllergenics((prev) => [...prev, AllergenicEnum.MUSTARD]);
                                } else {
                                    setFilterCheckedAllergenics((prev) => prev.filter((item) => item !== AllergenicEnum.MUSTARD));
                                }
                                setCheckedAllergenic8(stringToBoolean(value));
                            }} checkedColor="#a80a2e" />
                        <AdvancedCheckbox label={t("ALLERGENIC_9")} value={checkedAllergenic9}
                            onValueChange={(value) => {
                                if(stringToBoolean(value) === true) {
                                    setFilterCheckedAllergenics((prev) => [...prev, AllergenicEnum.SESAME_SEED]);
                                } else {
                                    setFilterCheckedAllergenics((prev) => prev.filter((item) => item !== AllergenicEnum.SESAME_SEED));
                                }
                                setCheckedAllergenic9(stringToBoolean(value));
                            }} checkedColor="#a80a2e" />
                        <AdvancedCheckbox label={t("ALLERGENIC_10")} value={checkedAllergenic10}
                            onValueChange={(value) => {
                                if(stringToBoolean(value) === true) {
                                    setFilterCheckedAllergenics((prev) => [...prev, AllergenicEnum.SULFUR_DIOXIDE_AND_SULPHITES]);
                                } else {
                                    setFilterCheckedAllergenics((prev) => prev.filter((item) => item !== AllergenicEnum.SULFUR_DIOXIDE_AND_SULPHITES));
                                }
                                setCheckedAllergenic10(stringToBoolean(value));
                            }} checkedColor="#a80a2e" />
                        <AdvancedCheckbox label={t("ALLERGENIC_11")} value={checkedAllergenic11}
                            onValueChange={(value) => {
                                if(stringToBoolean(value) === true) {
                                    setFilterCheckedAllergenics((prev) => [...prev, AllergenicEnum.LUPIN_BEAN]);
                                } else {
                                    setFilterCheckedAllergenics((prev) => prev.filter((item) => item !== AllergenicEnum.LUPIN_BEAN));
                                }
                                setCheckedAllergenic11(stringToBoolean(value));
                            }} checkedColor="#a80a2e" />
                        <AdvancedCheckbox label={t("ALLERGENIC_12")} value={checkedAllergenic12}
                            onValueChange={(value) => {
                                if(stringToBoolean(value) === true) {
                                    setFilterCheckedAllergenics((prev) => [...prev, AllergenicEnum.NUTS]);
                                } else {
                                    setFilterCheckedAllergenics((prev) => prev.filter((item) => item !== AllergenicEnum.NUTS));
                                }
                                setCheckedAllergenic12(stringToBoolean(value));
                            }} checkedColor="#a80a2e" />
                        <AdvancedCheckbox label={t("ALLERGENIC_13")} value={checkedAllergenic13}
                            onValueChange={(value) => {
                                if(stringToBoolean(value) === true) {
                                    setFilterCheckedAllergenics((prev) => [...prev, AllergenicEnum.MOLLUSK]);
                                } else {
                                    setFilterCheckedAllergenics((prev) => prev.filter((item) => item !== AllergenicEnum.MOLLUSK));
                                }
                                setCheckedAllergenic13(stringToBoolean(value));
                            }} checkedColor="#a80a2e" />
                        <AdvancedCheckbox label={t("ALLERGENIC_14")} value={checkedAllergenic14}
                            onValueChange={(value) => {
                                if(stringToBoolean(value) === true) {
                                    setFilterCheckedAllergenics((prev) => [...prev, AllergenicEnum.LACTOSE]);
                                } else {
                                    setFilterCheckedAllergenics((prev) => prev.filter((item) => item !== AllergenicEnum.LACTOSE));
                                }
                                setCheckedAllergenic14(stringToBoolean(value));
                            }} checkedColor="#a80a2e" />
                    </View>
                </View>
            );
        };
    
        const renderFiltersModalFooter = () => {
            return (
                <View style={{padding: 15, flexDirection: "row", gap: 10}}>
                    <StandardButton style={{flex: 1}} title={t("FILTERS_MODAL_ACCEPT_BUTTON_TEXT", {ns: "recipes_screen_translations"})} 
                        onPress={() => {
                            onAccept();
                            setFiltersModalVisible(false);
                        }} />
                    <StandardButton style={{flex: 1}} title={t("FILTERS_MODAL_CANCEL_BUTTON_TEXT", {ns: "recipes_screen_translations"})} 
                        onPress={() => setFiltersModalVisible(false)} />
                </View>
            );
        }

        return(
            <ContainerModal title={t("FILTERS_MODAL_TITLE", {ns: "recipes_screen_translations"})} 
                visible={filtersModalVisible} renderContent={renderFiltersModalContent}
                renderFooter={renderFiltersModalFooter} style={{width: width * 0.9}} 
                onRequestClose={(e) => setFiltersModalVisible(false)}/>
        );
    };

    return(
        <SafeAreaView style={recipesScreenStyles.mainView}>
            <FiltersModal />

            <SearchBar placeholder={t("SEARCH_BAR_PLACEHOLDER_TEXT", {ns: "recipes_screen_translations"})} 
                width={width - 40} height={40}
                style={{ margin: 20, marginBottom: 10 }} 
                onPressFiltersButton={() => setFiltersModalVisible(true)}
                onChangeSearchText={(text) => {
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                    }
                  
                    timeoutRef.current = setTimeout(() => {
                        setFilterRecipeName(text);
                        setPage(0);
                        setRecipes([]);
                    }, 500);
                }} />

            <FlatList
                data={recipes}
                renderItem={renderRecipeCardItem}
                contentContainerStyle={recipesScreenStyles.recipeListContentContainer}
                style={recipesScreenStyles.recipeList}
                onEndReached={() => setPage(page + 1)}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderRecipeListFooter}
            />
        </SafeAreaView>
    );
}

const recipesScreenStyles = StyleSheet.create({

    mainView: {
        flex: 1,
    },

    recipeList: {
        backgroundColor: "whitesmoke",
        marginBottom: 10,
        flex: 1
    },

    recipeListContentContainer: {
        gap: 10,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "whitesmoke"
    },

    searchBar: {
    }

});