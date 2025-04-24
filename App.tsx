import * as React from 'react';
import { BottomTabNavigationProp, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import LogInScreen from '@screens/LogInScreen';
import SignUpScreen from '@screens/SignUpScreen';
import HomeScreen from '@screens/HomeScreen';
import HomeIcon from "@resources/icons/home-icon.svg";
import RecipeBookIcon from "@resources/icons/recipe-book-icon.svg";
import RecipeMenuIcon from "@resources/icons/recipe-menu-icon.svg";
import UserProfileIcon from "@resources/icons/user-profile-icon.svg";
import RecipesScreen from '@screens/RecipesScreen';
import { useTranslation } from 'react-i18next';

export type RootTabParamList = {
  Log_In_Screen: undefined;
  Sign_Up_Screen: undefined;
  Home_Screen: undefined;
  Recipes_Screen: undefined;
  Menus_Screen: undefined;
  User_Profile_Screen: undefined;
};

const Tab = createBottomTabNavigator();

function homeScreenTabBarIcon(focused: boolean) {
  return (
    <HomeIcon width={24} height={24} fill={focused ? '#a80a2e' : 'gray'}/>
  );
}

function recipeScreenTabBarIcon(focused: boolean) {
  return (
    <RecipeBookIcon width={24} height={24} fill={focused ? '#a80a2e' : 'gray'}/>
  );
}

function menusScreenTabBarIcon(focused: boolean) {
  return (
    <RecipeMenuIcon width={24} height={24} fill={focused ? '#a80a2e' : 'gray'}/>
  );
}

function userProfileScreenTabBarIcon(focused: boolean) {
  return (
    <UserProfileIcon width={24} height={24} fill={focused ? '#a80a2e' : 'gray'}/>
  );
}

function App() {

  const { t } = useTranslation();
  
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Log_In_Screen" component={LogInScreen} options={{headerShown: false, tabBarButton: () => {return null;}, tabBarStyle: { display: "none" }}}/>
        <Tab.Screen name="Home_Screen" component={HomeScreen} options={{headerShown: false, tabBarShowLabel: false, tabBarIcon: ({focused}) => {return homeScreenTabBarIcon(focused);}}}/>
        <Tab.Screen name="Recipes_Screen" component={RecipesScreen} options={{
            headerShown: true, tabBarShowLabel: false, tabBarIcon: ({focused}) => {return recipeScreenTabBarIcon(focused);},
            title: t("RECIPES_SCREEN_TITLE")
          }}/>
        <Tab.Screen name="Menus_Screen" component={HomeScreen} options={{headerShown: false, tabBarShowLabel: false, tabBarIcon: ({focused}) => {return menusScreenTabBarIcon(focused);}}}/>
        <Tab.Screen name="User_Profile_Screen" component={HomeScreen} options={{headerShown: false, tabBarShowLabel: false, tabBarIcon: ({focused}) => {return userProfileScreenTabBarIcon(focused);}}}/>
        <Tab.Screen name="Sign_Up_Screen" component={SignUpScreen} options={{headerShown: false, tabBarButton: () => {return null;}, tabBarStyle: { display: "none" }}}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
