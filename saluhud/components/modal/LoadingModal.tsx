import { Image, Modal, StyleSheet, Text, TextInput, useWindowDimensions, View } from "react-native";

interface LoadingModalProps
{
    message?: string;
    visible: boolean;
}

function messagePresent(message?: string) : boolean
{
    if(message === undefined || message.trim().length <= 0)
    {
        return false;
    }

    return true;
}

function renderLoadingDialogContent(message?: string)
{
    const {height, width} = useWindowDimensions();

    if(messagePresent(message))
    {
        return (
            <View style={[loadingModalStyles.loadingDialog, {maxWidth: width * 0.9, maxHeight: height * 0.9}]}>
                <Text style={loadingModalStyles.loadingDialogMessage}>{message}</Text>
                <Image style={loadingModalStyles.loadingDialogAnimation} source={require("@resources/images/general/loading.gif")}></Image>
            </View>
        );
    }
    
    return (
        <View style={[loadingModalStyles.loadingDialog, {maxWidth: width * 0.9, maxHeight: height * 0.9}]}>
            <Image style={loadingModalStyles.loadingDialogAnimation} source={require("@resources/images/general/loading.gif")}></Image>
        </View>
    );
}

export default function LoadingModal({message, visible} : Readonly<LoadingModalProps>)
{
    return (
        <Modal animationType="fade" transparent={true} visible={visible}>
            <View style={[loadingModalStyles.centeredView]}>
                {renderLoadingDialogContent(message)}
            </View>
        </Modal>
    );
}

const loadingModalStyles = StyleSheet.create({
    centeredView:
    {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
    },

    loadingDialog:
    {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },

    loadingDialogMessage:
    {
        color: "black",
        fontSize: 16,
        marginBottom: 20
    },

    loadingDialogAnimation:
    {
        minWidth: 50,
        minHeight: 50,
        width: 100,
        height: 100
    }
});