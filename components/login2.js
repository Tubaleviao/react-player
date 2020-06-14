import React from 'react'
import { View, Text, TextInput, Button, AsyncStorage } from 'react-native'
import {StackActions, NavigationActions} from 'react-navigation'
import api from './api'

class Login extends React.Component {

	state = {
		user: false,
		loading: !(AsyncStorage.getItem('user')==null),
		error: false,
		username: "",
		pass: "",				// get, set, remove
	}

	change = event => {
		if(this.state.error) this.setState({error: false})
		const {name, value} = event
		this.setState({[name]: value})
	}

	submit = async event => {
		this.setState({loading: true})
		event.preventDefault()
		const {username, pass} = this.state
		const body = JSON.stringify({"username":username, "password": pass})
		const user = await api.getToken(body)
		if(!user.error){
			AsyncStorage.setItem('user', JSON.stringify(user.user))
			user.loading = false
			user.songs = await api.getSongs(user.user)
			this.setState(user)
			this.props.navigation.replace('Player', {songs: user.songs, user: username})
		}else{
			this.setState({error: user.error, loading: false})
		}
	}

	render(){ 
		const {error} = this.state
		return (<View>
			<Text>Welcome</Text>
			{error && <Text>{error}</Text>}
			<View>
			<Button onPress={() => navigation.navigate('Profile')} title="Profile" />
				<TextInput onChangeText={t => this.change({name: "username", value: t})} 
					autoCompleteType="username" 
					autoFocus={true} 
					placeholder="Username..." />
				<TextInput onChangeText={t => this.change({name: "pass", value: t})} 
					secureTextEntry={true} 
					autoCompleteType="password" 
					placeholder="Password..." />
				<Button onPress={this.submit} title="Submit" />
			</View>
		</View>) 
	} 
}

export default Login
