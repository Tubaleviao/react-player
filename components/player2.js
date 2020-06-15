import React from 'react';
import Login from './login'
import SongList from './songList'
import api from './api'
import { AsyncStorage, View, Text, Button, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Constants from 'expo-constants'
import { Audio } from 'expo-av';
import { AntDesign, FontAwesome } from '@expo/vector-icons'; 

const Stack = createStackNavigator();

//Audio.setAudioModeAsync({staysActiveInBackground: true})

class Player extends React.Component {

	state = {
		user: false,
		loading: !(AsyncStorage.getItem('user')==null),
		error: false,
		songs: [],
		username: this.props.route.params.user,
		pass: "",				// get, set, remove
		playing: false,
		so: new Audio.Sound(),
	}

	load = async () => this.setState({loading: true});

	playSong = async (song='') => {
		if(this.state.playing){
			this.state.so.stopAsync()
			this.setState({playing: false})
		}else{
			try {
				const status = await this.state.so.getStatusAsync()
				const uri = `/users/${this.state.username}/${song}`
				console.log(song) 
				if(!status.isLoaded || status.uri){ // || status.uri !== uri
					await this.state.so.unloadAsync()
					await this.state.so.loadAsync({uri: `https://tuba.work${uri}`},
				    { shouldPlay: true })
				  await this.state.so.playAsync()
				  this.setState({playing: song})
				}
			} catch (error) {
			  console.log(error)
			}
		}
	}

	render(){
		const {loading, error, playing} = this.state
		const {navigation} = this.props
		const {songs,user} = this.props.route.params
		return (
			<View style={styles.app}>
				{error && <Text>{error}</Text>}
				<Text style={styles.container}>{playing}</Text>
				<Text style={styles.container}>
					{playing ? <FontAwesome name="pause" size={32} color="lime" /> : 
						<FontAwesome name="play" size={32} color="lime" />},
					<FontAwesome name="backward" size={32} color="lime" />,
					<FontAwesome name="forward" size={32} color="lime" />, 
					<FontAwesome name="stop" size={32} color="lime" />, 
					<FontAwesome name="repeat" size={32} color="lime" />, 
					<FontAwesome name="volume-up" size={32} color="lime" />, 
					<FontAwesome name="volume-down" size={32} color="lime" />, 
					<FontAwesome name="volume-off" size={32} color="lime" />, 
					<FontAwesome name="random" size={32} color="lime" />, 
					play button, 
					music title, etc...
				</Text>
				<SongList songList={songs} navigation={navigation} play={this.playSong}/>
			</View>)
	}
}

export default Player

const styles = StyleSheet.create({
	app: {backgroundColor: '#000000'},
	container: {
		textAlign: 'center',
    	backgroundColor: '#000000',
	    color: '#00ff00',
	    margin: Constants.statusBarHeight,
	},
});





/*



	componentDidMount() {
		console.log("componentDidMount")
	}

	componentDidUpdate() {
		console.log("componentDidUpdate")
	}

	componentWillUnmount(){
		console.log("componentWillUnmount")
	}
	

	try{
				const {sound: so, status} = await Audio.sound.createAsync(
				    {uri: 'https://tuba.work/users/tuba/death%20bed.mp3'},
				    { shouldPlay: true }
				  )
				this.setState({playing: true, so: so})
			}catch(err){
				console.log(err)
			}

console.log(await this.state.so.getStatusAsync())
Object {
  "androidImplementation": "SimpleExoPlayer",
  "didJustFinish": false,
  "durationMillis": 206915,
  "isBuffering": true,
  "isLoaded": true,
  "isLooping": false,
  "isMuted": false,
  "isPlaying": true,
  "playableDurationMillis": 42919,
  "positionMillis": 0,
  "progressUpdateIntervalMillis": 500,
  "rate": 1,
  "shouldCorrectPitch": false,
  "shouldPlay": true,
  "uri": "/users/tuba/After Midnight.mp3",
  "volume": 1,
}

			*/