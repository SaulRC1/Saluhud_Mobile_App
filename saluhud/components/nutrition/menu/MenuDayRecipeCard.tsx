import { AllergenicEnum } from "@src/entity/AllergenicEnum";
import React from "react";
import { GestureResponderEvent, Image, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

interface MenuDayRecipeCardProps {
    id: bigint,
    name: string,
    kilocalories: number,
    imageSource?: string,
    allergenics?: AllergenicEnum[],
    style?: StyleProp<ViewStyle>,
    onPress: (event: GestureResponderEvent) => void,
    startTime: string,
    endTime: string,
    onLongPress?: (event: GestureResponderEvent) => void
}

const renderAllergenics = (allergenics: AllergenicEnum[]) => {

    return (
        <View style={{ backgroundColor: "white", flexDirection: "row", gap: 5, flexWrap: "wrap", marginTop: 10 }}>
            {allergenics.map((allergenic => {
                switch (allergenic) {
                    case AllergenicEnum.GLUTEN:
                        return (<Image key={allergenic} source={require("@resources/images/allergenics/gluten.png")} 
                        style={{width: 30, height: 30}} resizeMode="contain"/>);
                    case AllergenicEnum.CRUSTACEAN:
                        return (<Image key={allergenic} source={require("@resources/images/allergenics/crustacean.png")} 
                        style={{width: 30, height: 30}} resizeMode="contain"/>);
                    case AllergenicEnum.EGG:
                        return (<Image key={allergenic} source={require("@resources/images/allergenics/egg.png")} 
                        style={{width: 30, height: 30}} resizeMode="contain"/>);
                    case AllergenicEnum.FISH:
                        return (<Image key={allergenic} source={require("@resources/images/allergenics/fish.png")} 
                        style={{width: 30, height: 30}} resizeMode="contain"/>);
                    case AllergenicEnum.PEANUT:
                        return (<Image key={allergenic} source={require("@resources/images/allergenics/peanuts.png")} 
                        style={{width: 30, height: 30}} resizeMode="contain"/>);
                    case AllergenicEnum.SOYA_BEAN:
                        return (<Image key={allergenic} source={require("@resources/images/allergenics/soya_beans.png")} 
                        style={{width: 30, height: 30}} resizeMode="contain"/>);
                    case AllergenicEnum.CELERY:
                        return (<Image key={allergenic} source={require("@resources/images/allergenics/celery.png")} 
                        style={{width: 30, height: 30}} resizeMode="contain"/>);
                    case AllergenicEnum.MUSTARD:
                        return (<Image key={allergenic} source={require("@resources/images/allergenics/mustard.png")} 
                        style={{width: 30, height: 30}} resizeMode="contain"/>);
                    case AllergenicEnum.SESAME_SEED:
                        return (<Image key={allergenic} source={require("@resources/images/allergenics/sesame_seeds.png")} 
                        style={{width: 30, height: 30}} resizeMode="contain"/>);
                    case AllergenicEnum.SULFUR_DIOXIDE_AND_SULPHITES:
                        return (<Image key={allergenic} source={require("@resources/images/allergenics/sulphites.png")} 
                        style={{width: 30, height: 30}} resizeMode="contain"/>);
                    case AllergenicEnum.LUPIN_BEAN:
                        return (<Image key={allergenic} source={require("@resources/images/allergenics/lupin_beans.png")} 
                        style={{width: 30, height: 30}} resizeMode="contain"/>);
                    case AllergenicEnum.NUTS:
                        return (<Image key={allergenic} source={require("@resources/images/allergenics/nuts.png")} 
                        style={{width: 30, height: 30}} resizeMode="contain"/>);
                    case AllergenicEnum.MOLLUSK:
                        return (<Image key={allergenic} source={require("@resources/images/allergenics/mollusk.png")} 
                        style={{width: 30, height: 30}} resizeMode="contain"/>);
                    case AllergenicEnum.LACTOSE:
                        return (<Image key={allergenic} source={require("@resources/images/allergenics/lactose.png")} 
                        style={{width: 30, height: 30}} resizeMode="contain"/>);
                }
            }))}
        </View>
    );
}

function MenuDayRecipeCardComponent({id, name, kilocalories, imageSource, allergenics, style, onPress, startTime, endTime, onLongPress} 
    : Readonly<MenuDayRecipeCardProps>) {

    let emptyImageSource = false;

    if(imageSource === undefined || imageSource === null || imageSource.trim().length === 0)
    {
        emptyImageSource = true;
    }

    return(
        <Pressable 
            style={({ pressed }) => [menuDayRecipeCardStyles.card, style, pressed && { transform: [{ scale: 0.95 }] }]} 
            onPress={onPress} onLongPress={onLongPress}>
            <Text style={menuDayRecipeCardStyles.timeSpanText}>{startTime + " - " + endTime}</Text>
            <Image source={emptyImageSource ? require("@resources/images/general/recipe_card_img_placeholder.png") 
                : {uri: imageSource}} style={menuDayRecipeCardStyles.recipeImage} resizeMode={emptyImageSource ? "contain" : "cover"}/>
            <Text style={menuDayRecipeCardStyles.recipeName}>{name}</Text>
            <Text style={menuDayRecipeCardStyles.kilocaloriesText}>{kilocalories + " Kcal"}</Text>
            {allergenics !== undefined && allergenics !== null ? renderAllergenics(allergenics) : null}
        </Pressable>
    );
}

const MenuDayRecipeCard = React.memo(MenuDayRecipeCardComponent);

const menuDayRecipeCardStyles = StyleSheet.create({

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
    },

    timeSpanText: {
        fontSize: 20,
        fontWeight: "600",
        color: "#a80a2e",
        marginBottom: 10
    }
});

export default MenuDayRecipeCard;