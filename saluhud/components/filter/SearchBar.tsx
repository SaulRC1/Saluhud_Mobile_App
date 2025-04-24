import { GestureResponderEvent, StyleSheet, TextInput, View, ViewStyle } from "react-native";
import SearchIcon from "@resources/icons/search-icon.svg";
import FilterSliderIcon from "@resources/icons/filter-slider-icon.svg";
import IconButton from "@components/buttons/IconButton";

interface SearchBarProps
{
  placeholder: string;
  onPress?: any;
  style?: ViewStyle;
  width: number,
  height: number,
  onPressFiltersButton: (event: GestureResponderEvent) => void,
  onChangeSearchText: (text: string) => void
}

export default function SearchBar({placeholder, onPress, style, width, height, 
  onPressFiltersButton, onChangeSearchText} : Readonly<SearchBarProps>) {
  return (
    <View style={[{width: width, height: height}, searchBarStyles.searchBarContainer, style]}>
        <SearchIcon height={height - 20} width={height - 20}/>
        <TextInput placeholder={placeholder} style={[searchBarStyles.searchBar]} onChangeText={onChangeSearchText}></TextInput>
        <IconButton icon={FilterSliderIcon} onPress={onPressFiltersButton} style={{height: height - 20, width: height - 20}}/>
    </View>
  );
}

const searchBarStyles = StyleSheet.create({
    searchBarContainer: {
        backgroundColor: "white",
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 30,
        elevation: 5,
        shadowColor: "black",
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 5,
        paddingBottom: 5,
        gap: 10
    },

    searchBar: {
      backgroundColor: "white",
      flex: 1,
      padding: 0
    }
});