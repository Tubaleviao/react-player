import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Player from './components/player2'
import Login from './components/login2'
import {Button} from 'react-native'
import { SimpleLineIcons } from '@expo/vector-icons'

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} 
          options={{
            headerRight: () => (
              <SimpleLineIcons 
                onPress={()=>alert("yo")} 
                size={32}
                color='lime'
                name="menu" />
            ),
            headerTintColor: '#00ff00',
            headerStyle: {
              backgroundColor: '#000000'
            },
          }} />
        <Stack.Screen name="Player" component={Player} 
          options={{
            headerRight: () => (
              <SimpleLineIcons 
                onPress={()=>alert("yo")} 
                size={32}
                color='lime'
                name="menu" />
            ),
            headerTintColor: '#00ff00',
            headerStyle: {
              backgroundColor: '#000000'
            },
          }} />
        <Stack.Screen name="Profile" component={Player} />
      </Stack.Navigator>
    </NavigationContainer>

  );
}
