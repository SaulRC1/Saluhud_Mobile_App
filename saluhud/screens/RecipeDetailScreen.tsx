import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RecipesScreenStackParamList } from "@root/App";
import { useSaluhudMobileAppAuthenticationContext } from "@src/global/SaluhudMobileAppContext";
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Text, View, SafeAreaView, ScrollView, ActivityIndicator, StyleSheet, Image, useWindowDimensions } from "react-native";
import SaluhudMobileAppConfiguration from "@resources/saluhud_mobile_app_configuration.json";
import RecipeDetailDTO from "@src/dto/nutrition/RecipeDetailDTO";
import { getRecipeDetailData } from "@src/api/SaluhudMobileAppApiService";
import InformationModal, { InformationModalVariant } from "@components/modal/InformationModal";
import ReadonlyText from "@components/inputs/ReadonlyText";
import { AllergenicEnum } from "@src/entity/AllergenicEnum";

type RecipesScreenNavigationProp = StackNavigationProp<RecipesScreenStackParamList, "Recipe_Detail_Screen">;
type RecipeDetailRouteProp = RouteProp<RecipesScreenStackParamList, 'Recipe_Detail_Screen'>;

const RecipeDetailScreen = () => {
    const route = useRoute<RecipeDetailRouteProp>();
    const recipeID = route.params.recipeID;
    const { t } = useTranslation();
    const navigation = useNavigation<RecipesScreenNavigationProp>();
    let customHeadersMap = new Map<string, string>();
    const saluhudMobileAppAuthenticationContext = useSaluhudMobileAppAuthenticationContext();
    customHeadersMap.set(SaluhudMobileAppConfiguration.jwtHttpHeader, saluhudMobileAppAuthenticationContext.jwt);
    const { width, height } = useWindowDimensions();
    const [loading, setLoading] = useState<boolean>(false);
    const [recipeDetail, setRecipeDetail] = useState<RecipeDetailDTO | null>(null);
    const [informationModalVisible, setInformationModalVisible] = useState(false);
    const [informationModalMessage, setInformationModalMessage] = useState("");
    const [informationModalVariant, setInformationModalVariant] = useState(InformationModalVariant.ERROR);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const recipeDetail: RecipeDetailDTO = await getRecipeDetailData(customHeadersMap, recipeID);
                console.log(recipeDetail);
                setRecipeDetail(recipeDetail);
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

    const isImageSourceEmpty = (imageSource: string | null | undefined) => {
        if (imageSource === undefined || imageSource === null || imageSource.trim().length === 0) {
            return true;
        }

        return false;
    }

    const getAllergenicImageComponent = (allergenic: number) => {
        switch (allergenic) {
            case AllergenicEnum.GLUTEN:
                return (<Image key={allergenic} source={require("@resources/images/allergenics/gluten.png")}
                    style={{ width: 40, height: 40 }} resizeMode="contain" />);
            case AllergenicEnum.CRUSTACEAN:
                return (<Image key={allergenic} source={require("@resources/images/allergenics/crustacean.png")}
                    style={{ width: 40, height: 40 }} resizeMode="contain" />);
            case AllergenicEnum.EGG:
                return (<Image key={allergenic} source={require("@resources/images/allergenics/egg.png")}
                    style={{ width: 40, height: 40 }} resizeMode="contain" />);
            case AllergenicEnum.FISH:
                return (<Image key={allergenic} source={require("@resources/images/allergenics/fish.png")}
                    style={{ width: 40, height: 40 }} resizeMode="contain" />);
            case AllergenicEnum.PEANUT:
                return (<Image key={allergenic} source={require("@resources/images/allergenics/peanuts.png")}
                    style={{ width: 40, height: 40 }} resizeMode="contain" />);
            case AllergenicEnum.SOYA_BEAN:
                return (<Image key={allergenic} source={require("@resources/images/allergenics/soya_beans.png")}
                    style={{ width: 40, height: 40 }} resizeMode="contain" />);
            case AllergenicEnum.CELERY:
                return (<Image key={allergenic} source={require("@resources/images/allergenics/celery.png")}
                    style={{ width: 40, height: 40 }} resizeMode="contain" />);
            case AllergenicEnum.MUSTARD:
                return (<Image key={allergenic} source={require("@resources/images/allergenics/mustard.png")}
                    style={{ width: 40, height: 40 }} resizeMode="contain" />);
            case AllergenicEnum.SESAME_SEED:
                return (<Image key={allergenic} source={require("@resources/images/allergenics/sesame_seeds.png")}
                    style={{ width: 40, height: 40 }} resizeMode="contain" />);
            case AllergenicEnum.SULFUR_DIOXIDE_AND_SULPHITES:
                return (<Image key={allergenic} source={require("@resources/images/allergenics/sulphites.png")}
                    style={{ width: 40, height: 40 }} resizeMode="contain" />);
            case AllergenicEnum.LUPIN_BEAN:
                return (<Image key={allergenic} source={require("@resources/images/allergenics/lupin_beans.png")}
                    style={{ width: 40, height: 40 }} resizeMode="contain" />);
            case AllergenicEnum.NUTS:
                return (<Image key={allergenic} source={require("@resources/images/allergenics/nuts.png")}
                    style={{ width: 40, height: 40 }} resizeMode="contain" />);
            case AllergenicEnum.MOLLUSK:
                return (<Image key={allergenic} source={require("@resources/images/allergenics/mollusk.png")}
                    style={{ width: 40, height: 40 }} resizeMode="contain" />);
            case AllergenicEnum.LACTOSE:
                return (<Image key={allergenic} source={require("@resources/images/allergenics/lactose.png")}
                    style={{ width: 40, height: 40 }} resizeMode="contain" />);
        }
    }

    const renderRecipeAllergenics = () => {

        if (recipeDetail?.recipeAllergenics !== null && recipeDetail?.recipeAllergenics !== undefined
            && recipeDetail.recipeAllergenics.length !== 0) {
            return (
                <>
                    <Text style={recipeDetailScreenStyles.recipeInformationSectionTitle}>
                        {t("RECIPE_DETAIL_ALLERGENICS_SECTION_TITLE", { ns: "recipes_screen_translations" })}
                    </Text>

                    <View style={[recipeDetailScreenStyles.sectionContent, recipeDetailScreenStyles.allergenicSection]}>
                        {recipeDetail.recipeAllergenics.map((recipeAllergenic) => (
                            <View key={recipeAllergenic.allergenicId} style={recipeDetailScreenStyles.allergenicComponent}>
                                {getAllergenicImageComponent(recipeAllergenic.allergenicId)}
                                <Text style={{fontSize: 16, color: "black"}}>{recipeAllergenic.allergenicName}</Text>
                            </View>
                        ))}
                    </View>
                </>
            );
        }

        return (
            <></>
        );
    }

    const renderContent = () => {
        if(recipeDetail === null) {
            return (
                <Text>{informationModalMessage}</Text>
            );
        }

        return (
            <>
                <View style={{ width: width, height: 250 }}>
                    <Image source={
                        isImageSourceEmpty(recipeDetail.imageSource) ? require("@resources/images/general/recipe_card_img_placeholder.png")
                            : { uri: recipeDetail.imageSource }
                        } style={{width: "100%", height: "100%"}}
                        resizeMode={isImageSourceEmpty(recipeDetail.imageSource) ? "contain" : "cover"}
                    />
                </View>

                <Text style={recipeDetailScreenStyles.recipeName}>{recipeDetail.name}</Text>

                <View style={recipeDetailScreenStyles.recipeInformationContainer}>

                    <Text style={recipeDetailScreenStyles.recipeInformationSectionTitle}>
                        {t("RECIPE_DETAIL_NUTRITIONAL_INFORMATION_SECTION_TITLE", { ns: "recipes_screen_translations" })}
                    </Text>

                    <View style={recipeDetailScreenStyles.sectionContent}>
                        <ReadonlyText
                            label={t("RECIPE_DETAIL_NUTRITIONAL_INFORMATION_ENERGY_VALUE_LABEL", { ns: "recipes_screen_translations" })}
                            text={recipeDetail.kilocalories + " Kcal / 100 g"}
                        />
                    </View>

                    {renderRecipeAllergenics()}
                </View>

                <View style={recipeDetailScreenStyles.recipeInformationContainer}>

                    <Text style={recipeDetailScreenStyles.recipeInformationSectionTitle}>
                        {t("RECIPE_DETAIL_INGREDIENTS_SECTION_TITLE", { ns: "recipes_screen_translations" })}
                    </Text>

                    <View style={recipeDetailScreenStyles.sectionContent}>
                        {recipeDetail.recipeIngredients.map((recipeIngredient) => (
                            <View key={recipeIngredient.ingredient.name} style={recipeDetailScreenStyles.ingredientComponent}>
                                <View style={recipeDetailScreenStyles.bullet} />
                                <Text style={{fontSize: 16, color: "black"}}>
                                    {recipeIngredient.ingredient.name + " (" + recipeIngredient.quantity + " " 
                                        + recipeIngredient.unit + ")"}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={recipeDetailScreenStyles.recipeInformationContainer}>

                    <Text style={recipeDetailScreenStyles.recipeInformationSectionTitle}>
                        {t("RECIPE_DETAIL_ELABORATION_STEPS_SECTION_TITLE", { ns: "recipes_screen_translations" })}
                    </Text>

                    <View style={recipeDetailScreenStyles.sectionContent}>
                        {recipeDetail.elaborationSteps.map((elaborationStep) => (
                            <View key={elaborationStep.stepNumber} style={recipeDetailScreenStyles.ingredientComponent}>
                                <Text style={recipeDetailScreenStyles.elaborationStepNumber}>{elaborationStep.stepNumber}</Text>
                                <Text style={{fontSize: 16, color: "black", flexWrap: "wrap"}}>
                                    {elaborationStep.stepDescription}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

            </>
        );
    }
    
    return(
        <SafeAreaView style={{ flex: 1, backgroundColor: "whitesmoke" }}>
            <ScrollView contentContainerStyle={recipeDetailScreenStyles.mainView}>

                <InformationModal visible={informationModalVisible} message={informationModalMessage}
                                    acceptButtonText={t("ACCEPT_BUTTON_TEXT")} variant={informationModalVariant}
                                    acceptButtonOnPress={() => { setInformationModalVisible(false) }} />

                {loading ? <ActivityIndicator size="large" style={{ margin: 20 }} color="#a80a2e" /> :
                    renderContent()}
                                    
            </ScrollView>
        </SafeAreaView>
    );
}

const recipeDetailScreenStyles = StyleSheet.create({
    mainView:
    {
        //flex: 1,
        //justifyContent: 'center',
        //alignItems: 'center',
        backgroundColor: 'whitesmoke',
        padding: 0,
        gap: 0
    },

    recipeInformationContainer: {
        paddingLeft: 0,
        paddingRight: 0
    },

    recipeName: {
        backgroundColor: "#a80a2e",
        color: "white",
        fontSize: 20,
        fontWeight: "600",
        width: "100%",
        paddingRight: 20,
        paddingLeft: 20,
        paddingTop: 10,
        paddingBottom: 10,
        textAlign: "center"
    },

    recipeInformationSectionTitle: {
        color: "#a80a2e",
        backgroundColor: "white",
        fontSize: 18,
        textAlign: "center",
        fontWeight: "600",
        paddingBottom: 10,
        paddingTop: 10,
        paddingLeft: 20,
        paddingRight: 20
    },

    sectionContent: {
        width: "100%",
        paddingRight: 20,
        paddingLeft: 20,
        paddingTop: 10,
        paddingBottom: 10,
        gap: 10
    },

    allergenicComponent: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 5
    },

    allergenicSection: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 15
    },

    bullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#a80a2e',
        marginRight: 8,
    },

    ingredientComponent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
        width: "90%"
    },

    elaborationStepNumber: {
        color: '#a80a2e',
        fontSize: 18
    }
});

export default RecipeDetailScreen;