import React from 'react';
import Login from './login'
import SongList from './songList'
import api from './api'
import { AsyncStorage, View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
//import Svg, {Rect} from 'react-native-svg'
//import loading_svg from '../assets/loading.svg'

const Stack = createStackNavigator();

class Player extends React.Component {

	state = {
		user: false,
		loading: !(AsyncStorage.getItem('user')==null),
		error: false,
		songs: [],
		username: "",
		pass: "",				// get, set, remove
		face_auth: !(AsyncStorage.getItem('user')==null) 
	}

	handleChange = event => {
		if(this.state.error) this.setState({error: false})
		const {name, value} = event
		this.setState({[name]: value})
	}

	handleSubmit = async event => {
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
		}else{
			this.setState({error: user.error, loading: false})
		}
		
	}

	face = async face_user => {
		let st = {loading: false}
		const response = await api.isValid(face_user)
		if(response.isValid || response.ok){
			// user will have username and token for now
			const {user:username, token} = response
			st.songs = await api.getSongs({username, token})
			AsyncStorage.setItem('user', JSON.stringify({username, token}))
			st.user = face_user.email
			st.error = false
		}else st.error = "Please login again"
		this.setState(st)
	}

	load = async () => this.setState({loading: true});

	componentDidMount() {
		console.log("componentDidMount")
	}

	componentDidUpdate() {
		console.log("componentDidUpdate")
	}

	componentWillUnmount(){
		console.log("componentWillUnmount")
	}

	render(){
		const {loading, error, face_auth, songs} = this.state
		const {navigation} = this.props
		return (<View>
					{this.state.user ? 
						<SongList songList={songs} navigation={navigation}/> : 
						<Login s={this.handleSubmit} 
							c={this.handleChange} 
							face={this.face} 
							l={this.load}
							face_auth={face_auth}/>
					}
					{error && <h3 className="error">{error}</h3>}
				</View>)
	}
}

export default Player

/* {loading && <img src={loading_svg} alt="loading" />} */