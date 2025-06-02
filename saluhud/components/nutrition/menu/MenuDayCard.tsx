import React from "react";
import { GestureResponderEvent, Pressable, StyleProp, StyleSheet, Text, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

interface MenuDayCardProps {
    icon: React.FC<SvgProps>,
    id: bigint,
    weekDay: string,
    style?: StyleProp<ViewStyle>,
    onPress: (event: GestureResponderEvent) => void,
    onLongPress?: (event: GestureResponderEvent) => void
}

function MenuDayCardComponent({icon: Icon, id, weekDay, style, onPress, onLongPress} : Readonly<MenuDayCardProps>) {
    return(
        <Pressable style={({ pressed }) => [menuDayCardStyles.card, style, pressed && { transform: [{ scale: 0.95 }] }]} onPress={onPress} onLongPress={onLongPress}>
            <Icon width={40} height={40} fill={"#a80a2e"}/>
            <Text style={menuDayCardStyles.weekDay}>{weekDay}</Text>
        </Pressable>
    );
}

const MenuDayCard = React.memo(MenuDayCardComponent);

const menuDayCardStyles = StyleSheet.create({

    card: {
        backgroundColor: "white",
        minWidth: 250,
        minHeight: 25,
        padding: 10,
        borderRadius: 3,
        elevation: 5,
        shadowColor: "black",
        flexDirection: "row",
        gap: 10,
        alignItems: "center"
    },

    weekDay: {
        fontSize: 20,
        fontWeight: "600",
        color: "black",
        marginBottom: 2,
        flexShrink: 1,
        flexWrap: 'wrap'
    }
});

export default MenuDayCard;