import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
//import Login from './components/login'
import { View, Text } from 'react-native';

const Stack = createStackNavigator()

export default function App() {

    const aaa = () => <View><Text>Ha!</Text></View>
    
  return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={aaa} />
        </Stack.Navigator>
      </NavigationContainer>

  );
}