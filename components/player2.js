import React from 'react';
import Login from './login'
import SongList from './songList'
import api from './api'
import { AsyncStorage, View, Text, Button, StyleSheet, Slider } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Constants from 'expo-constants'
import { Audio } from 'expo-av';
import { AntDesign, FontAwesome } from '@expo/vector-icons'; 
import { Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

const Stack = createStackNavigator();
//Audio.setAudioModeAsync({staysActiveInBackground: true})

class Player extends React.Component {

	state = {
		songs: this.props.route.params.songs,
		user: this.props.route.params.user,
		so: new Audio.Sound(),
		subject: new Subject(),
	}

	load = async () => this.setState({loading: true})
	play =  async() => this.state.so.playAsync()
	stop = async () => this.state.so.stopAsync()
	pause = async () => this.state.so.pauseAsync()

	//backward = async () => this.state.so.pauseAsync()
	forward = async () => this.state.so.setVolumeAsync(0.42)
	repeat = async () => this.state.so.pauseAsync()
	//random = async () => this.state.so.pauseAsync()
	volume = v => {
		this.state.so.setVolumeAsync(v); 
		this.updatePlayer()
	}

	icon = name => (<FontAwesome name={name} onPress={this[name]} size={32} color="lime" />)

	updatePlayer = async () => {
		const status = await this.state.so.getStatusAsync()
		if(status.isLoaded){
			let partedUri = status.uri.split('/')
			this.setState({
				playing: status.isPlaying ? partedUri[partedUri.length-1] : false,
				volume: (status.volume*100).toFixed()+'%'
			})
		}
	}

	loadSong = async song => {
		try {
			const {so, subject, user} = this.state
			const status = await so.getStatusAsync()
			const uri = `https://tuba.work/users/${user}/${song}`
			await so.unloadAsync()
			await so.loadAsync({uri: uri}, { shouldPlay: true })
			await so.playAsync()
			subject.pipe(debounceTime(300)).subscribe(this.volume)
			this.updatePlayer()
		} catch (error) { console.log(error) }
	}

	componentDidMount() {
		const {songs} = this.state
		let len = songs.length
		let song = songs[Math.floor(Math.random()*len)]
		this.loadSong(song)
	}

	render(){
		const {loading, error, songs, playing, so, volume, subject} = this.state
		const {navigation} = this.props
		return (
			<View style={styles.app}>
				{error && <Text>{error}</Text>}
				<Text style={styles.container}>{playing}</Text>
				<Slider value={1} onValueChange={v => subject.next(v) } />
				<Text style={styles.container}>{volume}</Text>
				<Text style={styles.container}>
					{this.icon('backward')}, 
					{playing ? this.icon('pause') : this.icon('play')}, 
					{this.icon('forward')}, 
					{this.icon('stop')}, 
					{this.icon('repeat')}, 
					{this.icon('volume-up')}, 
					{this.icon('volume-down')}, 
					{this.icon('volume-off')}, 
					{this.icon('random')}
				</Text>
				<SongList songList={songs} navigation={navigation} play={this.play}/>
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




playSong = async (song='') => {
		if(this.state.playing){
			this.state.so.stopAsync()
			this.setState({playing: false})
		}else{
			try {
				const status = await this.state.so.getStatusAsync()
				const uri = `/users/${this.state.username}/${song}`
				console.log(song) 
				if(!status.isLoaded || status.uri){ 
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

			*/