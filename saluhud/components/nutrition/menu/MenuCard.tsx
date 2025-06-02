import React, { useState } from "react";
import { GestureResponderEvent, LayoutChangeEvent, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import MenuIcon from "@resources/icons/recipe-menu-icon.svg";
import FavouriteIcon from "@resources/icons/star-full-icon.svg";

interface MenuCardProps {
    id: bigint,
    name: string,
    style?: StyleProp<ViewStyle>,
    onPress: (event: GestureResponderEvent) => void,
    onLongPress?: (event: GestureResponderEvent) => void,
    isFavourite?: boolean
}

function MenuCardComponent({id, name, style, onPress, onLongPress, isFavourite = false} : Readonly<MenuCardProps>) {
    const [height, setHeight] = useState(0);

    const handleLayout = (event: LayoutChangeEvent) => {
        const { height } = event.nativeEvent.layout;
        setHeight(height);
    };
    
    return(
        <Pressable style={({ pressed }) => [menuCardStyles.card, style, pressed && { transform: [{ scale: 0.95 }] },
            isFavourite && menuCardStyles.favouritePressable]} 
            onPress={onPress} onLongPress={onLongPress} onLayout={handleLayout}>
            {isFavourite ?
                <View style={[menuCardStyles.favourite, {height: height}]}>
                    <FavouriteIcon width={40} height={40} fill={"white"} /> 
                </View> 
                : null
            }
            <View style={[menuCardStyles.information, {height: height}]}>
                <MenuIcon width={40} height={40} fill={"#a80a2e"}/>
                <Text style={menuCardStyles.menuName}>{name}</Text>
            </View>
        </Pressable>
    );
}

const MenuCard = React.memo(MenuCardComponent);

const menuCardStyles = StyleSheet.create({

    card: {
        backgroundColor: "white",
        minWidth: 250,
        minHeight: 25,
        padding: 0,
        borderRadius: 3,
        elevation: 5,
        shadowColor: "black",
        flexDirection: "row",
        gap: 0,
        alignItems: "center"
    },

    menuName: {
        fontSize: 20,
        fontWeight: "600",
        color: "black",
        marginBottom: 2,
        flexShrink: 1,
        flexWrap: 'wrap'
    },

    information: {
        gap: 10, 
        padding: 10, 
        flexDirection: "row",
        alignItems: "center",
    },

    favourite: {
        backgroundColor: "#a80a2e",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        borderTopLeftRadius: 3,
        borderBottomLeftRadius: 3
    },

    favouritePressable: {
        borderBottomWidth: 3,
        borderBottomColor: "#a80a2e",
        borderTopWidth: 3,
        borderTopColor: "#a80a2e",
        borderRightWidth: 3,
        borderRightColor: "#a80a2e"
    }
});

export default MenuCard;