import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Player from './components/player2'
import Login from './components/login2'
import Signup from './components/signup'

const Stack = createStackNavigator();

export default function App() {
  const defaultOption = {
            headerTintColor: '#00ff00',
            headerStyle: {
              backgroundColor: '#000000'
            },
          }
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={defaultOption} />
        <Stack.Screen name="Player" component={Player} options={defaultOption} />
        <Stack.Screen name="Signup" component={Signup} options={defaultOption} />
        <Stack.Screen name="Profile" component={Player} />
      </Stack.Navigator>
    </NavigationContainer>

  );
}
