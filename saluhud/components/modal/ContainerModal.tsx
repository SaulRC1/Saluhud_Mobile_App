import IconButton from "@components/buttons/IconButton";
import StandardButton from "@components/buttons/StandardButton";
import { Modal, StyleSheet, useWindowDimensions, View, Text, ScrollView, GestureResponderEvent, StyleProp, ViewStyle, NativeSyntheticEvent } from "react-native";

interface ContainerModalProps
{
    title: string;
    visible: boolean;
    style?: StyleProp<ViewStyle>
    renderContent: () => JSX.Element;
    renderFooter?: () => JSX.Element;
    onRequestClose: (event: NativeSyntheticEvent<any>) => void
}

export default function ContainerModal({title, visible, style, renderContent, renderFooter, onRequestClose} : Readonly<ContainerModalProps>)
{
    const {height, width} = useWindowDimensions();
    
    return (
        <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onRequestClose}>
            <View style={[containerModalStyles.centeredView]}>
                <View style={[containerModalStyles.containerDialog, {maxWidth: width * 0.9, maxHeight: height * 0.9}, style]}>
                    <View style={containerModalStyles.header}>
                        <Text style={containerModalStyles.headerTitle}>{title}</Text>
                    </View>
                    <ScrollView style={containerModalStyles.content}>
                        {renderContent()}
                    </ScrollView>
                    {renderFooter ? renderFooter() : null}
                </View>
            </View>
        </Modal>
    );
}

const containerModalStyles = StyleSheet.create({
    centeredView:
    {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
    },

    containerDialog:
    {
        backgroundColor: "white",
        borderRadius: 3,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderColor: "#a80a2e"
    },

    header: {
        backgroundColor: "#a80a2e", 
        height: 40, 
        justifyContent: "center", 
        alignItems: "center",
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3
    },

    headerTitle: {
        fontSize: 18,
        color: "white",
        fontWeight: "500"
    },

    content: {
        padding: 20,
        backgroundColor: "white"
    }
});