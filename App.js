import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, 
  DrawerItemList } from '@react-navigation/drawer';
import Player from './components/player'
import Login from './components/login'
import Signup from './components/signup'
import {Button} from 'react-native'
import { SimpleLineIcons } from '@expo/vector-icons'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Upload from './components/upload'
import { CommonActions } from '@react-navigation/native';
import {View} from 'react-native'
import Testing from './components/testing'
//import Testing2 from './components/testing2'
// I may have to detach expo from my app for showing notification controls
// https://github.com/tanguyantoine/react-native-music-control

const Logout = ({navigation}) => {
  const out = () => navigation.dispatch(
    CommonActions.reset({ index: 1,routes: [{name: 'Login'}],})
  )
  return (<View>{out()}</View>)
} 

const Stack = createStackNavigator()
const Drawer = createDrawerNavigator()

export default function App() {
  const defaultOption = {
    headerTintColor: '#00ff00',
    headerStyle: {
      backgroundColor: '#000000'
    },
  }

  let nav

  const savFun = navi => {
    if((typeof navi) === "object") nav = navi
    else if((typeof nav) === "object") nav.toggleDrawer()
  }

  const drawerNav = menu =>{
    return (
      <Drawer.Navigator drawerPosition="right" drawerStyle={{backgroundColor: '#000000'}}
        drawerContentOptions={{activeTintColor: '#00ff00', labelStyle: {color:'#00ff00'}, 
          style: { borderColor: '#008800', borderWidth: .5, borderRadius: 1}}} >

        <Drawer.Screen name="Player" component={Player} options={({navigation}) => {
          menu( navigation ); return ({}); }} />
        <Drawer.Screen name="Upload" component={Upload} />
        <Drawer.Screen name="Logout" component={Logout} />
        <Drawer.Screen name="Testing" component={Testing} />
      </Drawer.Navigator>
    )
  }
    
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={Login} options={ ({navigation}) => ({
           ...defaultOption,
           headerRight: () => (
              <Button onPress={() => navigation.navigate('Signup')} 
                color='#006600' title="Sign up"/>
            ),
          })} />
          <Stack.Screen name="Home" children={() => drawerNav(savFun)} options={({navigation}) => ({
            ...defaultOption,
            headerTitle: "Tuba Player",
            headerRight: () => (
              <SimpleLineIcons onPress={() => savFun()} size={32} color='lime' name="menu"/>
            ),
          })} />
          <Stack.Screen name="Signup" component={Signup} options={defaultOption} />
          <Stack.Screen name="Profile" component={Player} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>

  );
}
/* 
<Stack.Screen name="Signup" component={Signup} options={defaultOption} /> 
<Stack.Screen name="Test" children={signupStack} />
*/