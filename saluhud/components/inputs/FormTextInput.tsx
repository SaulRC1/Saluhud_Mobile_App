import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet, TextStyle, ViewStyle, Image, ImageStyle, ImageSourcePropType, LayoutChangeEvent } from 'react-native';

export enum AutoCapitalizeOptions 
{
    None = "none",
    Sentences = "sentences",
    Words = "words",
    Characters = "characters",
}

export interface FormTextInputValidationResult
{
    validationResult: boolean;
    errorMessage: string;
}

interface FormTextInputProps
{
  labelText: string;
  placeholder: string;
  labelStyle?: TextStyle;
  textInputStyle?: TextStyle;
  formTextInputContainerStyle?: ViewStyle;
  autoCapitalize?: AutoCapitalizeOptions;
  labelIcon?: ImageSourcePropType;
  labelIconStyle?: ImageStyle;
  secureTextEntry?: boolean;
  validateFunction: (text: string) => FormTextInputValidationResult;
  mandatory: boolean;
}

interface Size
{
    width: number;
    height: number;
}

export default function FormTextInput({labelText, placeholder, labelStyle, textInputStyle, 
    formTextInputContainerStyle, autoCapitalize, labelIcon, labelIconStyle, secureTextEntry, validateFunction, mandatory} : Readonly<FormTextInputProps>) 
{
    const [validityImageSource, setValidityImageSource] = useState(require("@resources/icons/form_input_error.png"));

    function executeValidateFunction(text: string, validateFunction: (text: string) => FormTextInputValidationResult) 
    {
        setIsVisibleValidityImage(true);
        let dataValidation = validateFunction(text);

        if (dataValidation.validationResult === true) 
        {
            console.log("Correcto");
            setValidityImageSource(require("@resources/icons/form_input_accepted.png"));
            setIsVisibleErrorMessage(false);
            setErrorMessageSize({width: 0, height: 0});
        }
        else 
        {
            console.log("Incorrecto: " + dataValidation.errorMessage);
            setValidityImageSource(require("@resources/icons/form_input_error.png"));
            setIsVisibleErrorMessage(true);
            setErrorMessage(dataValidation.errorMessage);
            /*setFormTextInputSize({
                width: formTextInputSize.width,
                height: formTextInputSize.height + 25//errorMessageSize.height
            });*/
        }
    }

    const [isVisibleErrorMessage, setIsVisibleErrorMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [formTextInputSize, setFormTextInputSize] = useState<Size>({ width: 0, height: 0 });
    const formTextInputDynamicSize = isVisibleErrorMessage? {width: formTextInputSize.width, height: formTextInputSize.height} : {};

    function formTextInputOnLayoutEventFunction(event: LayoutChangeEvent)
    {
        const {width, height} = event.nativeEvent.layout;

        console.log("Ancho: " + width + ", Alto: " + height);

        setFormTextInputSize({
            width: width,
            height: height
        });
    }

    const [errorMessageSize, setErrorMessageSize] = useState<Size>({width: 0, height: 0});

    function errorMessageOnLayoutEventFunction(event: LayoutChangeEvent)
    {
        if(errorMessageSize.height === 0)
        {
            const { width, height } = event.nativeEvent.layout;

            console.log("Error Message Ancho: " + width + ", Error Message Alto: " + height);

            setErrorMessageSize({
                width: width,
                height: height
            });

            setFormTextInputSize({
                width: formTextInputSize.width,
                height: formTextInputSize.height + height
            });
        }
    }

    const [isVisibleValidityImage, setIsVisibleValidityImage] = useState(false);
    
    if(labelIcon !== null && labelIcon !== undefined)
    {
        return (
            <View style={[formTextInputStandardStyles.containerStyle, formTextInputContainerStyle, formTextInputDynamicSize]} onLayout={formTextInputOnLayoutEventFunction}>
                <View style={formTextInputStandardStyles.labelContainerStyle}>
                    <Image source={labelIcon} style={[formTextInputStandardStyles.labelIconStyle, labelIconStyle]} resizeMode="contain"></Image>
                    <Text style={[formTextInputStandardStyles.labelIconTextStyle, labelStyle]}>{mandatory? labelText + " *" : labelText}</Text>
                </View>

                <View style={formTextInputStandardStyles.textInputContainerStyle}>
                    <TextInput style={[formTextInputStandardStyles.textInputStyle, textInputStyle]} placeholder={placeholder} autoCapitalize={autoCapitalize}
                    secureTextEntry={secureTextEntry} onChangeText={(text) => executeValidateFunction(text, validateFunction)} 
                    /*onPressIn={() => {setIsVisibleValidityImage(true); executeValidateFunction("", validateFunction)}}*/></TextInput>
                    <Image source={validityImageSource} style={[formTextInputStandardStyles.textInputValidityImageStyle, { display: isVisibleValidityImage ? 'flex' : 'none' }]} resizeMode="contain"></Image>
                </View>
                <View style={{ display: isVisibleErrorMessage ? 'flex' : 'none', /*backgroundColor: "black"*/ }} onLayout={errorMessageOnLayoutEventFunction}>
                    <Text style={formTextInputStandardStyles.errorMessageStyle}>{errorMessage}</Text>
                </View>
            </View>
        );
    }
    return (
        <View style={[formTextInputStandardStyles.containerStyle, formTextInputContainerStyle, formTextInputDynamicSize]} onLayout={formTextInputOnLayoutEventFunction}>
            <Text style={[formTextInputStandardStyles.textStyle, labelStyle]}>{mandatory? labelText + " *" : labelText}</Text>
            <View style={formTextInputStandardStyles.textInputContainerStyle}>
                <TextInput style={[formTextInputStandardStyles.textInputStyle, textInputStyle]} placeholder={placeholder} autoCapitalize={autoCapitalize}
                    secureTextEntry={secureTextEntry} onChangeText={(text) => executeValidateFunction(text, validateFunction)}
                    /*onPressIn={() => {setIsVisibleValidityImage(true); executeValidateFunction("", validateFunction)}}*/></TextInput>
                <Image source={validityImageSource} style={[formTextInputStandardStyles.textInputValidityImageStyle, { display: isVisibleValidityImage ? 'flex' : 'none' }]} resizeMode="contain"></Image>
            </View>
            <View style={{ display: isVisibleErrorMessage ? 'flex' : 'none', /*backgroundColor: "black"*/ }} onLayout={errorMessageOnLayoutEventFunction}>
                <Text style={formTextInputStandardStyles.errorMessageStyle}>{errorMessage}</Text>
            </View>
        </View>
    );
}

const formTextInputStandardStyles = StyleSheet.create({
    textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Roboto',
        //backgroundColor: 'blue',
        flex: 3,
        textAlignVertical: 'center',
        color: '#a80a2e'
    },
    textInputStyle: {
        fontSize: 16,
        fontFamily: 'Roboto',
        //backgroundColor: 'black',
        textAlignVertical: 'center',
        color: 'black',
        //backgroundColor: 'yellow',
        height: '100%',
        width: '80%'
    },
    containerStyle: {
        flex: 1,
        //backgroundColor: 'purple',
    },
    labelIconStyle: {
        //flex: 1,
        height: '100%',
        width: '10%',
        //backgroundColor: 'black'
    },
    labelContainerStyle: {
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignContent: 'center',
        alignItems: 'center',
    },
    labelIconTextStyle: {
        width: '80%',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Roboto',
        textAlignVertical: 'center',
        color: '#a80a2e',
        //backgroundColor: 'green'
    },
    textInputContainerStyle: {
        flex: 4,
        borderBottomWidth: 3,
        borderBottomColor: '#a80a2e',
        //backgroundColor: 'purple',
        flexDirection: 'row',
        alignItems: 'center'
    },
    textInputValidityImageStyle: {
        //backgroundColor: 'black',
        width: '20%',
        height: '60%'
    },
    errorMessageStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Roboto',
        textAlignVertical: 'center',
        color: '#a80a2e'
    }
});