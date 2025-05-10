import { useState } from "react";
import { GestureResponderEvent, LayoutChangeEvent, Pressable, StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

interface MenuButtonProps
{
  icon: React.FC<SvgProps>;
  onPress: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  iconColor?: string;
  text: string;
}

const DEFAULT_ICON_COLOR = "#a80a2e"

const MenuButton = ({icon: Icon, onPress, style, textStyle, iconColor, text} : Readonly<MenuButtonProps>) => {

    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const onLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setDimensions({ width: height - 15, height: height - 15 });
    };
      
    return (
        <Pressable style={[menuButtonStyles.pressable, style]} onLayout={onLayout} onPress={onPress}>
            <Icon width={dimensions.width} height={dimensions.height} fill={iconColor ?? DEFAULT_ICON_COLOR}/>
            <Text style={[menuButtonStyles.textStyle, textStyle]}>{text}</Text>
        </Pressable>
    );
}

const menuButtonStyles = StyleSheet.create({
    pressable: {
        backgroundColor: "white",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 15,
        paddingTop: 15,
        flexDirection: "row",
        gap: 15,
        borderRadius: 3,
        elevation: 5,
        shadowColor: "black"
    },

    textStyle: {
        fontSize: 16,
        color: "black"
    }
});

export default MenuButton;