import './gesture-handler';
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
import { createStackNavigator } from '@react-navigation/stack';
import UserProfileScreen from '@screens/userprofile/UserProfileScreen';
import FitnessDataProfileScreen from '@screens/userprofile/FitnessDataProfileScreen';
import UserProfileDetailsScreen from '@screens/userprofile/UserProfileDetailsScreen';

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

export type UserProfileScreenStackParamList = {
  User_Profile_Screen: undefined;
  User_Profile_Main_Screen: undefined;
  User_Profile_Details_Screen: undefined;
  Fitness_Data_Profile_Screen: undefined;
  General_Settings_Screen: undefined;
}

const UserProfileScreenStack = createStackNavigator();

const UserProfileScreenStackNavigator = () => {
  const { t } = useTranslation();

  return(
    <UserProfileScreenStack.Navigator>
      <UserProfileScreenStack.Screen name={"User_Profile_Main_Screen"} component={UserProfileScreen} 
        options={{title: t("USER_PROFILE_SCREEN_TITLE", { ns: "user_profile_screen_translations" })}}/>
      <UserProfileScreenStack.Screen name={"Fitness_Data_Profile_Screen"} component={FitnessDataProfileScreen} 
        options={{title: t("FITNESS_DATA_PROFILE_TITLE", { ns: "user_profile_screen_translations" })}}/>
      <UserProfileScreenStack.Screen name={"User_Profile_Details_Screen"} component={UserProfileDetailsScreen} 
        options={{title: t("USER_PROFILE_TITLE", { ns: "user_profile_screen_translations" })}}/>
    </UserProfileScreenStack.Navigator>
  );
}

function App() {

  const { t } = useTranslation();
  
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Log_In_Screen" component={LogInScreen} 
          options={{headerShown: false, tabBarButton: () => {return null;}, tabBarStyle: { display: "none" }, unmountOnBlur: true}}/>
        <Tab.Screen name="Home_Screen" component={HomeScreen} 
          options={{headerShown: false, tabBarShowLabel: false, 
          tabBarIcon: ({focused}) => {return homeScreenTabBarIcon(focused);}, unmountOnBlur: true}}/>
        <Tab.Screen name="Recipes_Screen" component={RecipesScreen} options={{
            headerShown: true, tabBarShowLabel: false, tabBarIcon: ({focused}) => {return recipeScreenTabBarIcon(focused);},
            title: t("RECIPES_SCREEN_TITLE"), unmountOnBlur: true
          }}/>
        <Tab.Screen name="Menus_Screen" component={HomeScreen} 
          options={{headerShown: false, tabBarShowLabel: false, 
          tabBarIcon: ({focused}) => {return menusScreenTabBarIcon(focused);}, unmountOnBlur: true}}/>
        <Tab.Screen name="User_Profile_Screen" component={UserProfileScreenStackNavigator} 
          options={{headerShown: false, tabBarShowLabel: false, 
          tabBarIcon: ({focused}) => {return userProfileScreenTabBarIcon(focused);}, unmountOnBlur: true}}/>
        <Tab.Screen name="Sign_Up_Screen" component={SignUpScreen} 
          options={{headerShown: false, tabBarButton: () => {return null;}, tabBarStyle: { display: "none" }, unmountOnBlur: true}}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
