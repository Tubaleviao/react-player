import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Player from './components/player2'
import Login from './components/login2'
import {Button} from 'react-native'

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Player" component={Player} 
          options={{headerRight: () => (<Button onPress={()=>alert("yo")} title="Profile" />)}} />
        <Stack.Screen name="Profile" component={Player} />
      </Stack.Navigator>
    </NavigationContainer>

  );
}
