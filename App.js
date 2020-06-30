//import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { View, Text } from 'react-native';

const App = () => {
  return (
    <View >
        <Text onPress={() => alert("Hey")}>Ho! abbbaaallllllll</Text>
        <Text>Hi! sdfksofsakdfpaoksdfpsokdfps aloha</Text>
    </View>
  );
};

export default App;
