import { SetStateAction } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

interface StandardDropdownProps {
    label: string;
    data: {
        label: string;
        value: string;
    }[];
    mode: "modal" | "default" | "auto" | undefined;
    value: string;
    setValue: (value: SetStateAction<string>) => void;
    placeholder: string;
}

const StandardDropdown = ({label, data, mode, value, setValue, placeholder} : Readonly<StandardDropdownProps>) => {
    return (
        <View style={standardDropdownStyles.containerStyle}>
            <Text style={[standardDropdownStyles.labelStyle]}>{label}</Text>
            <Dropdown data={data} labelField={"label"} valueField={"value"} onChange={item => setValue(item.value)}
                style={standardDropdownStyles.dropdown} selectedTextStyle={standardDropdownStyles.dropdownSelectedTextStyle}
                mode={mode} value={value} containerStyle={{}} placeholder={placeholder} 
                placeholderStyle={standardDropdownStyles.dropdownPlaceholder}
                    /*renderItem={renderItem}*/ />
        </View>
    );
}

const standardDropdownStyles = StyleSheet.create({
    containerStyle: {
        gap: 10,
        borderBottomWidth: 2,
        borderBottomColor: "#a80a2e"
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
    },

    dropdown: {
        marginBottom: 5
    },

    dropdownSelectedTextStyle: {
        color: "black",
        fontSize: 14
    },

    dropdownPlaceholder: {
        fontSize: 14
    }
});

export default StandardDropdown;
