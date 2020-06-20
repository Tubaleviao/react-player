import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Player from './components/player'
import Login from './components/login'
import Signup from './components/signup'
import {Button} from 'react-native'

const Stack = createStackNavigator()
const Drawer = createDrawerNavigator()

export default function App() {
  const defaultOption = {
    headerTintColor: '#00ff00',
    headerStyle: {
      backgroundColor: '#000000'
    },
  }

  const drawerNav = () =>
    <Drawer.Navigator drawerPosition="right">
      <Drawer.Screen name="Profile" component={Player} />
      <Drawer.Screen name="Logout" component={Player} />
      <Drawer.Screen name="Upload" component={Player} />
    </Drawer.Navigator>

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={ ({navigation}) => ({
         ...defaultOption,
         headerRight: () => (
            <Button onPress={() => navigation.navigate('Signup')} 
                  color='#006600'
                  title="Sign up"/>
          ),
        })} />
        <Stack.Screen name="Player" children={drawerNav} />
        <Stack.Screen name="Signup" component={Signup} options={defaultOption} />
        <Stack.Screen name="Profile" component={Player} />
      </Stack.Navigator>
    </NavigationContainer>

  );
}
/* 
<Stack.Screen name="Signup" component={Signup} options={defaultOption} /> 
<Stack.Screen name="Test" children={signupStack} />
*/