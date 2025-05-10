import { Dispatch, SetStateAction, useRef, useState } from "react";
import { NativeSyntheticEvent, StyleProp, StyleSheet, Text, TextInput, TextInputFocusEventData, View, ViewStyle } from "react-native";

interface NumericInputProps {
    numericInputType: NumericInputType,
    label: string;
    minValue?: number,
    maxValue?: number,
    style?: StyleProp<ViewStyle>,
    value: string,
    setValue: Dispatch<SetStateAction<string>>
}

export const enum NumericInputType 
{
    NUMERIC = "numeric",
    DECIMAL = "decimal"
}

const numericInputRegex = /^-?\d*$/;
const decimalInputRegex = /^-?\d+(\.\d*)?$/;

const JAVA_INTEGER_MAX_VALUE: number = 2147483647;
const JAVA_FLOAT_MAX_VALUE: number = 3.4028235e+38;

const setMinimumInputValue = (minValue: number | undefined, numericInputType: NumericInputType) => {
    if(minValue === undefined || minValue === null) {
        switch(numericInputType) {
            case NumericInputType.NUMERIC:
                return 0;
            case NumericInputType.DECIMAL:
                return 0;
        }
    }

    return minValue;
}

const setMaximumInputValue = (maxValue: number | undefined, numericInputType: NumericInputType) => {
    if(maxValue === undefined || maxValue === null) {
        switch(numericInputType) {
            case NumericInputType.NUMERIC:
                return JAVA_INTEGER_MAX_VALUE;
            case NumericInputType.DECIMAL:
                return JAVA_FLOAT_MAX_VALUE;
        }
    }

    if(numericInputType === NumericInputType.NUMERIC && maxValue > JAVA_INTEGER_MAX_VALUE) {
        return JAVA_INTEGER_MAX_VALUE;
    }

    if(numericInputType === NumericInputType.DECIMAL && maxValue > JAVA_FLOAT_MAX_VALUE) {
        return JAVA_FLOAT_MAX_VALUE;
    }

    return maxValue;
}

const NumericInput = ({numericInputType, label, minValue, maxValue, style, value, setValue}: NumericInputProps) => {
    
    const minimumInputValue = setMinimumInputValue(minValue, numericInputType);
    const maximumInputValue = setMaximumInputValue(maxValue, numericInputType);

    const filterInput = (text: string) => {
        let value = "";

        if (numericInputType === NumericInputType.DECIMAL) {

            value = decimalInputRegex.test(text) ? text : "";

            setValue(value);

        } else if (numericInputType === NumericInputType.NUMERIC) {

            value = numericInputRegex.test(text) ? text : "";

            if (value === "") {
                setValue("");
                return;
            }

            const numericValue = parseInt(value);

            if (numericValue > maximumInputValue || numericValue < minimumInputValue) {
                setValue("");
                return;
            }

            setValue(value);
        }
    }

    const filterInputOnBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        if (NumericInputType.DECIMAL) {
            if (value.endsWith(".")) {
                let newValue = value + "0";
                setValue(newValue);
            }
        }
    }

    return (
        <View style={[numericInputStyles.containerStyle, style]}>
            <Text style={[numericInputStyles.labelStyle]}>{label}</Text>
            <TextInput style={numericInputStyles.inputStyle} inputMode={numericInputType} 
                onChangeText={filterInput} value={value} onBlur={filterInputOnBlur}/>
        </View>
    );
}

const numericInputStyles = StyleSheet.create({
    containerStyle: {
    },

    labelStyle: {
        fontWeight: "600",
        color: "#a80a2e",
    },

    inputStyle: {
        borderBottomWidth: 2,
        borderBottomColor: "#a80a2e",
        padding: 0,
        flex: 1,
    }
});

export default NumericInput;