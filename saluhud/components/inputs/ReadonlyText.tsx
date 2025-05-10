import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

interface ReadonlyProps {
    label: string;
    text: string;
    style?: ViewStyle;
    labelStyle?: TextStyle;
    textStyle?: TextStyle;
}

const ReadonlyText = ({label, text, style, labelStyle, textStyle} : Readonly<ReadonlyProps>) => {
    return (
        <View style={[readonlyTextStyles.readonlyComponent, style]}>
            <Text style={[readonlyTextStyles.label, labelStyle]}>
                {label}
            </Text>
            <Text style={[readonlyTextStyles.text, textStyle]}>
                {text}
            </Text>
        </View>
    );
}

const readonlyTextStyles = StyleSheet.create({
    readonlyComponent: {
        flexDirection: "column",
        gap: 10
    },

    label: {
        fontSize: 18,
        fontWeight: 500,
        color: "#a80a2e"
    },

    text: {
        fontSize: 16,
        color: "black"
    }
});

export default ReadonlyText;