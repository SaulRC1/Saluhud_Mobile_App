import StandardButton from "@components/buttons/StandardButton";
import { GestureResponderEvent, Image, Modal, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import InfoIcon from "@resources/icons/info-icon.svg";
import WarningIcon from "@resources/icons/warning-icon.svg";
import ErrorIcon from "@resources/icons/error-icon.svg";
import SuccessIcon from "@resources/icons/success-icon.svg";

export const enum InformationModalVariant 
{
    INFORMATION,
    ERROR,
    WARNING,
    SUCCESS
}

interface InformationModalProps
{
    message?: string;
    visible: boolean;
    variant: InformationModalVariant,
    acceptButtonText: string;
    acceptButtonOnPress: ((event: GestureResponderEvent) => void) | null | undefined;
}

function getVariantIcon(variant: InformationModalVariant)
{
    switch (variant) 
    {
        case InformationModalVariant.INFORMATION:
          return (<InfoIcon height={50} width={50} fill="#17A2B8"/>);
        case InformationModalVariant.ERROR:
          return (<ErrorIcon height={50} width={50} fill="#a80a2e"/>);
        case InformationModalVariant.WARNING:
          return (<WarningIcon height={50} width={50} fill="#FFCC00"/>);
        case InformationModalVariant.SUCCESS:
          return (<SuccessIcon height={50} width={50} fill="#22C55E"/>);
        default:
          return (<InfoIcon height={50} width={50} fill="#17A2B8"/>);
    }
}

export default function InformationModal({message, visible, variant, acceptButtonText, acceptButtonOnPress} : Readonly<InformationModalProps>)
{
    const {height, width} = useWindowDimensions();
    
    return (
        <Modal animationType="fade" transparent={true} visible={visible}>
            <View style={[informationModalStyles.centeredView]}>
                <View style={[informationModalStyles.informationDialog, {maxWidth: width * 0.9, maxHeight: height * 0.9}]}>
                    {getVariantIcon(variant)}
                    <Text style={informationModalStyles.informationDialogMessage}>{message}</Text>
                    <StandardButton title={acceptButtonText} onPress={acceptButtonOnPress}></StandardButton>
                </View>
            </View>
        </Modal>
    );
}

const informationModalStyles = StyleSheet.create({
    centeredView:
    {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
    },

    informationDialog:
    {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },

    informationDialogIcon:
    {
        
    },

    informationDialogMessage:
    {
        color: "black",
        fontSize: 16,
        marginTop: 20,
        marginBottom: 20
    }
});