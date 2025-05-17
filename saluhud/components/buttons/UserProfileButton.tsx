import { useState } from "react";
import { GestureResponderEvent, LayoutChangeEvent, Pressable, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import NoProfilePictureIcon from "@resources/icons/user-profile-icon.svg";

interface UserProfileButtonProps
{
  onPress: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  title: string;
  username: string;
  name: string;
  surname: string;
}

const DEFAULT_ICON_COLOR = "#a80a2e"

const UserProfileButton = ({onPress, style, titleStyle, title, username, name, surname} : Readonly<UserProfileButtonProps>) => {

    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const onLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setDimensions({ width: height - 20, height: height - 20 });
    };
      
    return (
        <Pressable style={[userProfileButtonStyles.pressable, style]} onLayout={onLayout} onPress={onPress}>
            <NoProfilePictureIcon width={dimensions.width} height={dimensions.height} fill={DEFAULT_ICON_COLOR} />
            <View>
                <Text style={[userProfileButtonStyles.titleStyle, titleStyle]}>{title}</Text>

                <View style={{flexDirection: "row", gap: 5}}>
                    <Text style={[userProfileButtonStyles.textStyle]}>{name}</Text>
                    <Text style={[userProfileButtonStyles.textStyle]}>{surname}</Text>
                </View>
                
                <Text style={[userProfileButtonStyles.textStyle]}>{username}</Text>
            </View>
            
        </Pressable>
    );
}

const userProfileButtonStyles = StyleSheet.create({
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

    titleStyle: {
        fontSize: 16,
        fontWeight: 500,
        color: "#a80a2e"
    },

    textStyle: {
        fontSize: 16,
        color: "black"
    }
});

export default UserProfileButton;