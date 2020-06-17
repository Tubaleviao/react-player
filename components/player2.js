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

	constructor(props){
		super(props)
		this.mounted = false
	}

	state = {
		songs: this.props.route.params.songs,
		user: this.props.route.params.user,
		so: new Audio.Sound(),
		obs: new Subject(),
		trackPos: 0,
	}

	load = async () => this.setState({loading: true})
	play =  async() => this.state.so.playAsync()
	stop = async () => this.state.so.stopAsync()
	pause = async () => this.state.so.pauseAsync()

	//backward = async () => this.state.so.pauseAsync()
	forward = async () => this.state.so.setVolumeAsync(0.42)
	repeat = async () => this.state.so.pauseAsync()
	sliding = async () => {if(!this.state.sliding) this.setState({sliding: true})}
	//random = async () => this.state.so.pauseAsync()
	//volume = v => { this.state.so.setVolumeAsync(v); this.updatePlayer() }
	setTrack = v => {this.state.so.setPositionAsync(v); this.setState({sliding: false})}

	icon = name => (<FontAwesome name={name} onPress={this[name]} size={32} color="lime" />)

	getNewSong = () => {
		const {songs} = this.state
		let len = songs.length
		return songs[Math.floor(Math.random()*len)]
	}

	loadSong = async song => {
		try {
			const {so, obs, user} = this.state
			const uri = `https://tuba.work/users/${user}/${song}`
			await so.unloadAsync()
			await so.setOnPlaybackStatusUpdate(this.updatePlayer)
			await so.loadAsync({uri: uri})
			await so.setStatusAsync({
				progressUpdateIntervalMillis: 1100, 
				shouldPlay: true,
			})
		} catch (error) { console.log(error) }
	}

	updatePlayer = async st => {
		if(st && st.isLoaded){
			const newMusic = st.uri.split('/')[st.uri.split('/').length-1]
			const newPos = st.positionMillis
			const {playing, music, trackPos, maxPos} = this.state
			const toUpdate = {}
			if(playing!==st.isPlaying) toUpdate.playing = st.isPlaying
			if(music!==newMusic) toUpdate.music = newMusic
			if(newPos-trackPos >= 999) toUpdate.trackPos = newPos
			if(maxPos!==st.durationMillis){
				toUpdate.maxPos = st.durationMillis
				toUpdate.trackPos = 0
			}
			this.mounted && Object.keys(toUpdate).length && this.setState(toUpdate)
			//this.mounted && Object.keys(toUpdate).length && console.log(st.uri)
			if(st.didJustFinish) this.loadSong(this.getNewSong())
		}
	}

	shouldComponentUpdate(np, nt){
		if(nt.sliding) return false
		else return true
	}

	componentDidMount() {
		this.mounted = true
		this.state.obs.pipe(debounceTime(800)).subscribe(this.setTrack)
		this.loadSong(this.getNewSong())
	}

	render(){
		const {error, songs, playing, music, obs, trackPos, maxPos} = this.state
		const {navigation} = this.props
		return (
			<View style={styles.app}>
				{error && <Text>{error}</Text>}

				<Text style={styles.container}>{music}</Text>
				<Slider style={styles.container} 
					onValueChange={this.sliding}
					onSlidingComplete={v => this.setTrack(v)} 
					value={trackPos}
					maximumValue={maxPos} />
				
				<Text style={styles.container}>
					{playing ? this.icon('pause') : this.icon('play')}, 
					{this.icon('forward')}, 
					{this.icon('stop')}, 
					{this.icon('repeat')}, 
					, 
					{this.icon('volume-down')}, 
					{this.icon('volume-off')}
				</Text>
				<SongList songList={songs} navigation={navigation} play={this.play}/>
			</View>)
	}

	componentWillUnmount() {
	   this.mounted = false
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
