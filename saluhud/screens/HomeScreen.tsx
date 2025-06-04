import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { HomeScreenStackParamList, RootTabParamList } from "@root/App";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { useSaluhudMobileAppAuthenticationContext } from "@src/global/SaluhudMobileAppContext";
import SaluhudUserFitnessDataDTO from "@src/dto/user/SaluhudUserFitnessDataDTO";
import SaluhudMobileAppConfiguration from "@resources/saluhud_mobile_app_configuration.json";
import { ActivityIndicator, FlatList, GestureResponderEvent, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { getNextFavouriteMenuRecipe, getRecipeRecommendations, getSaluhudUserFitnessDataDTO } from "@src/api/SaluhudMobileAppApiService";
import RecipeCardDTO from "@src/dto/nutrition/RecipeCardDTO";
import StandardButton from "@components/buttons/StandardButton";
import { useTranslation } from "react-i18next";
import RecipeCard from "@components/recipe/RecipeCard";
import { mapRecipeCardAllergenicDTOToAllergenicEnum } from "@src/entity/AllergenicEnum";
import MenuDayRecipeDTO from "@src/dto/nutrition/MenuDayRecipeDTO";
import MenuDayRecipeCard from "@components/nutrition/menu/MenuDayRecipeCard";
import { ScrollView } from "react-native-gesture-handler";
import { StackNavigationProp } from "@react-navigation/stack";

type HomeScreenNavigationProp = StackNavigationProp<HomeScreenStackParamList, 'Home_Main_Screen'>;

export default function HomeScreen() {
    const { t } = useTranslation();
    const {height, width} = useWindowDimensions();
    const navigation = useNavigation<HomeScreenNavigationProp>();
    let customHeadersMap = new Map<string, string>();
    const saluhudMobileAppAuthenticationContext = useSaluhudMobileAppAuthenticationContext();
    const [loading, setLoading] = useState<boolean>(false);
    customHeadersMap.set(SaluhudMobileAppConfiguration.jwtHttpHeader, saluhudMobileAppAuthenticationContext.jwt);
    const [recommendedRecipes, setRecommendedRecipes] = useState<RecipeCardDTO[]>([]);
    const [upcomingFavouriteMenuRecipe, setUpcomingFavouriteMenuRecipe] = useState<MenuDayRecipeDTO | null>(null);

    const fetchData = async () => {
        setLoading(true);

        try {
            const recipeRecommendations: RecipeCardDTO[] = await getRecipeRecommendations(customHeadersMap);

            setRecommendedRecipes(recipeRecommendations);
        } catch (error) {
            
        }
        
        try {
            const upcomingFavouriteMenuRecipe: MenuDayRecipeDTO = await getNextFavouriteMenuRecipe(customHeadersMap);

            setUpcomingFavouriteMenuRecipe(upcomingFavouriteMenuRecipe);
        } catch (error) {
            
        }
        

        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const renderRecipeCardItem = useCallback(({ item }: { item: RecipeCardDTO }) => (
        <RecipeCard id={item.recipeID} name={item.recipeName} kilocalories={item.recipeKcal}
            style={{ width: 0.9 * width }} imageSource={item.recipeImageSource}
            allergenics={mapRecipeCardAllergenicDTOToAllergenicEnum(item.recipeAllergenics)}
            onPress={() => {
                navigation.navigate('Home_Recipe_Detail_Screen', {
                    recipeID: item.recipeID
                });
            }} />), []);
    
    const renderContent = () => {
        if(upcomingFavouriteMenuRecipe !== null) {
            return (
                <View style={{ backgroundColor: "whitesmoke", marginBottom: 10, width: "100%"}}>
                    <Text style={homeScreenStyles.title}>{t("UPCOMING_FAVOURITE_MENU_RECIPE_TITLE")}</Text>
                    <View style={{ backgroundColor: "whitesmoke", padding: 20, width: "100%", flex: 1 }}>
                        <MenuDayRecipeCard id={upcomingFavouriteMenuRecipe.id} 
                            name={upcomingFavouriteMenuRecipe.recipe.recipeName} 
                            kilocalories={upcomingFavouriteMenuRecipe.recipe.recipeKcal} 
                            onPress={() => {
                                navigation.navigate('Home_Recipe_Detail_Screen', {
                                    recipeID: upcomingFavouriteMenuRecipe.recipe.recipeID
                                });
                            }} 
                            startTime={upcomingFavouriteMenuRecipe.startTime} 
                            endTime={upcomingFavouriteMenuRecipe.endTime} 
                            imageSource={upcomingFavouriteMenuRecipe.recipe.recipeImageSource}
                            allergenics={mapRecipeCardAllergenicDTOToAllergenicEnum(upcomingFavouriteMenuRecipe.recipe.recipeAllergenics)}
                        />
                    </View>
                    {
                        recommendedRecipes.length > 0 ?
                            <View style={{ backgroundColor: "whitesmoke", marginBottom: 10, width: "100%"}}>
                                <Text style={homeScreenStyles.title}>{t("RECOMMENDED_RECIPES_TITLE")}</Text>
                                <FlatList
                                    data={recommendedRecipes}
                                    renderItem={renderRecipeCardItem}
                                    contentContainerStyle={homeScreenStyles.recipeListContentContainer}
                                    style={homeScreenStyles.recipeList}
                                    onEndReached={() => { }}
                                    onEndReachedThreshold={0.5}
                                />
                            </View>
                            :
                            <Text style={homeScreenStyles.noDataMessage}>
                                {t("ERROR_LOADING_RECIPE_RECOMMENDATIONS")}
                            </Text>
                    }  
                </View>
            );
        }

        return (
            <>
                {
                    recommendedRecipes.length > 0 ?
                        <View style={{backgroundColor: "whitesmoke", marginBottom: 10, width: "100%", flex: 1}}>
                            <Text style={homeScreenStyles.title}>{"Recetas recomendadas"}</Text>
                            <FlatList
                                data={recommendedRecipes}
                                renderItem={renderRecipeCardItem}
                                contentContainerStyle={homeScreenStyles.recipeListContentContainer}
                                style={homeScreenStyles.recipeList}
                                onEndReached={() => { }}
                                onEndReachedThreshold={0.5}
                            />
                        </View>
                        :
                        <Text style={homeScreenStyles.noDataMessage}>
                            {t("ERROR_LOADING_RECIPE_RECOMMENDATIONS")}
                        </Text>
                }
            </>
        );
    };

    return(
        <SafeAreaView style={{ flex: 1, backgroundColor: "whitesmoke" }}>
            <ScrollView>
                {loading ? <ActivityIndicator size="large" style={{ margin: 20 }} color="#a80a2e"/> 
                : renderContent()}
            </ScrollView>
        </SafeAreaView>
    );
}

const homeScreenStyles = StyleSheet.create({
    mainView: { 
        flex: 1, 
        backgroundColor: "whitesmoke", 
        justifyContent: "center", 
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 10 
    },

    recipeList: {
        backgroundColor: "whitesmoke",
        marginBottom: 10,
        width: "100%",
        flex: 1
    },

    recipeListContentContainer: {
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
    },

    title: {
        fontSize: 20,
        fontWeight: "600",
        color: "white",
        backgroundColor: "#a80a2e",
        textAlign: "center",
        padding: 10
    }
});