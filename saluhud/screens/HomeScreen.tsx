import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { RootTabParamList } from "@root/App";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

type HomeScreenNavigationProp = BottomTabNavigationProp<RootTabParamList, 'Home_Screen'>;

export default function HomeScreen() {

    const navigation = useNavigation<HomeScreenNavigationProp>();

    return(
        <SafeAreaView>

        </SafeAreaView>
    );
}