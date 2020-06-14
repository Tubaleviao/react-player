import React from 'react'
//import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import { View, Text, TextInput, Button } from 'react-native';

const Login = ({s, c, face, l, face_auth}) =>

	<View>
		<Text>Welcome</Text>
		<View>
		<Button onPress={() => navigation.navigate('Profile')} title="Profile" />
			<TextInput onChangeText={t => c({name: "username", value: t})} 
				autoCompleteType="username" 
				autoFocus={true} 
				placeholder="Username..." />
			<TextInput onChangeText={t => c({name: "pass", value: t})} 
				secureTextEntry={true} 
				autoCompleteType="password" 
				placeholder="Password..."/>
			<Button onPress={s} title="Submit" />
		</View>
	</View>

export default Login
