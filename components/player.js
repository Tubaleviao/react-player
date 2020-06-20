import React from 'react';
import Login from './login'
import SongList from './songList'
import api from './api'
import { AsyncStorage, Linking, View, Text, Button, StyleSheet, Slider, TouchableHighlight, StatusBar } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Constants from 'expo-constants'
import { Audio } from 'expo-av';
import { SimpleLineIcons, FontAwesome } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';

const Stack = createStackNavigator();
//Audio.setAudioModeAsync({staysActiveInBackground: true})

class Player extends React.Component {

	constructor(props){
		super(props)
		const {navigation} = props
		this.mounted = false
		// the method bellow only works with function
		// so now I'm changing this class to funciton, let's do it!
		// React.useEffect(() => navigation.addListener('focus', () => console.log('hehe')), []);
	}

	state = {
		songs: this.props.route.params.songs || [],
		user: this.props.route.params.user || 'None',
		so: new Audio.Sound(),
		trackPos: 0,
	}

	load = async () => this.setState({loading: true})
	play =  async() => this.state.so.playAsync()
	stop = async () => this.state.so.stopAsync()
	pause = async () => this.state.so.pauseAsync()

	//backward = async () => this.state.so.pauseAsync()
	forward = async () => this.loadSong(this.getNewSong())
	repeat = async () => this.state.so.pauseAsync()
	sliding = async () => {if(!this.state.sliding) this.setState({sliding: true})}
	//random = async () => this.state.so.pauseAsync()
	setTrack = v => {this.state.so.setPositionAsync(v); this.setState({sliding: false, trackPos: v})}

	icon = name => (
				<TouchableHighlight onPress={this[name]} activeOpacity={0.4}>
					<FontAwesome 
						style={styles.iconStyle}
						name={name} 
						size={32} 
						color="lime" />
				</TouchableHighlight>
	)

	addSong = async song => {

	}

	getNewSong = () => {
		const {songs} = this.state
		let len = songs.length
		return songs[Math.floor(Math.random()*len)]
	}

	loadSong = async song => {
		if(song){
			try {
				const {so, user} = this.state
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
			if(maxPos!==st.durationMillis) toUpdate.maxPos = st.durationMillis
			if(st.didJustFinish) toUpdate.trackPos = 0
			this.mounted && Object.keys(toUpdate).length && this.setState(toUpdate)
			if(st.didJustFinish) this.loadSong(this.getNewSong())
		}
	}

	shouldComponentUpdate(np, nt){
		if(nt.sliding) return false
		else return true
	}

	componentDidMount() {
		this.mounted = true
		this.loadSong(this.getNewSong())
	}

	render(){
		const {error, songs, playing, music, obs, trackPos, maxPos} = this.state
		const {navigation} = this.props

		

		
		return (
			<SafeAreaView style={styles.app}>
				<StatusBar barStyle="light-content" backgroundColor="#000000" />
				{error && <Text style={styles.error}>{error}</Text>}
				{!songs.length ? (
					<View>
						<Text style={styles.container}> Try adding new songs!{"\n"} 
							To select multiple files, try the webpage {"\n"}
							<Text style={{color:'lime', textDecorationLine: 'underline',}} 
								onPress={() => Linking.openURL('https://tuba.work/player')}>
								tuba.work/player
								</Text></Text>
						<Button title="Upload" onPress={this.pickFile} />
					</View>
				) : (
					<View style={styles.container}>
						<Text style={styles.container}>{music}</Text>
						<Slider style={styles.container} 
							onValueChange={this.sliding}
							onSlidingComplete={v => this.setTrack(v)} 
							value={trackPos}
							maximumValue={maxPos} />
						<View style={styles.icons}>
							<View style={styles.iconContainer}>
								 {playing ? this.icon('pause') : this.icon('play')} 
								 {this.icon('forward')} 
								 {this.icon('stop')}
							 </View>
						</View>
					</View>
				)}
				<SongList songList={songs} navigation={navigation} play={this.loadSong}/>
			</SafeAreaView>)
	}

	componentWillUnmount() {
	   this.mounted = false
	}
}

export default Player

const styles = StyleSheet.create({
	iconStyle: {
	    paddingRight: 30,
	    paddingLeft: 30,
	  },
	iconContainer:{
		flexDirection: 'row',
		flexWrap: 'wrap', // removing this makes button stop working
	},
	icons: {
		flex:1,
		marginBottom: 50,
		alignItems: 'center',
	},
	app: {
		flex: 1,
		backgroundColor: '#000000'
	},
	container: {
		textAlign: 'center',
    	backgroundColor: '#000000',
	    color: '#00ff00',
	    margin: 10,
	},
});
