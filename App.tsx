import * as React from 'react';
import { BottomTabNavigationProp, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import LogInScreen from '@screens/LogInScreen';
import SignUpScreen from '@screens/SignUpScreen';

export type RootTabParamList = {
  Log_In_Screen: undefined;
  Sign_Up_Screen: undefined;
};

const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Log_In_Screen" component={LogInScreen} options={{headerShown: false, tabBarStyle: { display: "none" }}}/>
        <Tab.Screen name="Sign_Up_Screen" component={SignUpScreen} options={{headerShown: false, tabBarStyle: { display: "none" }}}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
