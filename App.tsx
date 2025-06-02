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
import GeneralSettingsScreen from '@screens/userprofile/GeneralSettingsScreen';
import RecipeDetailScreen from '@screens/RecipeDetailScreen';
import MenusScreen from '@screens/menu/MenusScreen';
import MenuDetailScreen from '@screens/menu/MenuDetailScreen';
import MenuDayDetailScreen from '@screens/menu/MenuDayDetailScreen';

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
      <UserProfileScreenStack.Screen name={"General_Settings_Screen"} component={GeneralSettingsScreen} 
        options={{title: t("GENERAL_SETTINGS_TITLE", { ns: "user_profile_screen_translations" })}}/>
    </UserProfileScreenStack.Navigator>
  );
}

export type RecipesScreenStackParamList = {
  Recipes_Screen: undefined;
  Recipes_Main_Screen: undefined;
  Recipe_Detail_Screen: { recipeID: bigint };
}

const RecipesScreenStack = createStackNavigator();

const RecipesScreenStackNavigator = () => {
  const { t } = useTranslation();

  return(
    <RecipesScreenStack.Navigator>
      <RecipesScreenStack.Screen name={"Recipes_Main_Screen"} component={RecipesScreen} 
        options={{title: t("RECIPES_SCREEN_TITLE")}}/>
      <RecipesScreenStack.Screen name={"Recipe_Detail_Screen"} component={RecipeDetailScreen} 
        options={{title: t("RECIPE_DETAIL_SCREEN_TITLE")}}/>
    </RecipesScreenStack.Navigator>
  );
}

export type MenusScreenStackParamList = {
  Menus_Screen: undefined;
  Menus_Main_Screen: undefined;
  Menu_Detail_Screen: { menuID: bigint };
  Menu_Day_Detail_Screen: { menuDayID: bigint };
  Menu_Day_Recipe_Detail_Screen: { recipeID: bigint }
}

const MenusScreenStack = createStackNavigator();

const MenusScreenStackNavigator = () => {
  const { t } = useTranslation();

  return(
    <MenusScreenStack.Navigator>
      <MenusScreenStack.Screen name={"Menus_Main_Screen"} component={MenusScreen} 
        options={{title: t("MENUS_SCREEN_TITLE")}}/>
      <MenusScreenStack.Screen name={"Menu_Detail_Screen"} component={MenuDetailScreen} 
        options={{title: t("MENU_DETAIL_SCREEN_TITLE")}}/>
      <MenusScreenStack.Screen name={"Menu_Day_Detail_Screen"} component={MenuDayDetailScreen} 
        options={{title: t("MENU_DAY_DETAIL_SCREEN_TITLE")}}/>
      <MenusScreenStack.Screen name={"Menu_Day_Recipe_Detail_Screen"} component={RecipeDetailScreen} 
        options={{title: t("RECIPE_DETAIL_SCREEN_TITLE")}}/>
    </MenusScreenStack.Navigator>
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

        <Tab.Screen name="Recipes_Screen" component={RecipesScreenStackNavigator} options={{
            headerShown: false, tabBarShowLabel: false, tabBarIcon: ({focused}) => {return recipeScreenTabBarIcon(focused);},
            title: t("RECIPES_SCREEN_TITLE"), unmountOnBlur: true
          }}/>

        <Tab.Screen name="Menus_Screen" component={MenusScreenStackNavigator} 
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
