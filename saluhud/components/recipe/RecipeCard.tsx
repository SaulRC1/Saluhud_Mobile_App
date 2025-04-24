import React from "react";
import { Image, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

interface RecipeCardProps {
    id: bigint,
    name: string,
    kilocalories: number,
    imageSource?: string,
    style?: StyleProp<ViewStyle>
}

function RecipeCardComponent({id, name, kilocalories, imageSource, style} : Readonly<RecipeCardProps>) {

    let emptyImageSource = false;

    if(imageSource === undefined || imageSource === null || imageSource.trim().length === 0)
    {
        emptyImageSource = true;
    }

    return(
        <View style={[recipeCardStyles.card, style]}>
            <Image source={emptyImageSource ? require("@resources/images/general/recipe_card_img_placeholder.png") 
                : {uri: imageSource}} style={recipeCardStyles.recipeImage} resizeMode={emptyImageSource ? "contain" : "cover"}/>
            <Text style={recipeCardStyles.recipeName}>{name}</Text>
            <Text style={recipeCardStyles.kilocaloriesText}>{kilocalories + " Kcal"}</Text>
        </View>
    );
}

const RecipeCard = React.memo(RecipeCardComponent);

const recipeCardStyles = StyleSheet.create({

    card: {
        backgroundColor: "white",
        minWidth: 250,
        minHeight: 250,
        padding: 10,
        borderRadius: 3,
        elevation: 5,
        shadowColor: "black"
    },

    recipeImage: {
        height: 150,
        width: "auto",
        backgroundColor: "whitesmoke",
        marginBottom: 10
    },

    recipeName: {
        fontSize: 20,
        fontWeight: "600",
        color: "black",
        marginBottom: 2
    },

    kilocaloriesText: {
        fontSize: 16
    }
});

export default RecipeCard;