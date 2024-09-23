import * as React from 'react';
import SignUpScreen from './saluhud/screens/SignUpScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Sign Up Screen" component={SignUpScreen} options={{headerShown: false, tabBarStyle: { display: "none" }}}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
