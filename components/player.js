import React from 'react'
import SongList from './songList'
import { SafeAreaView, AppState, AsyncStorage, View, Text, StyleSheet, Slider, TouchableHighlight, StatusBar } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import Icon from 'react-native-vector-icons/FontAwesome';
import Upload from './upload'
// https://github.com/tanguyantoine/react-native-music-control
import mc from 'react-native-music-control';
// https://react-native-track-player.js.org/getting-started/
import tp from 'react-native-track-player';

const Stack = createStackNavigator();

function Player(props){

	const {useState, useEffect} = React
	const {navigation} = props

	useEffect(() => navigation.addListener('focus', async () =>{
		const song = await AsyncStorage.getItem('newSong')
		if(song){
			if(songs.length === 0) loadSong(song)
			setSongs([song, ...songs ])
			await AsyncStorage.removeItem('newSong')
		}
	}), [])

	useEffect(() => navigation.addListener('blur', async () =>{}), [])

	const [songs, setSongs] = useState(props.route.params.songs || []) 
	const [user, setUser] = useState(props.route.params.user || 'None')
	const [trackPos, setTrackPos] = useState(0)
	const [sliding, setSliding] = useState(false)
	const [music, setMusic] = useState('')
	const [maxPos, setMaxPos] = useState(0) // mounted
	const [playing, setPlaying] = useState(false)
	const [error, setError] = useState(false)
	const [mounted, setMounted] = useState(true)
	const t = {title: '', artist: '', album: '', genre: '', 
				date: '2020-06-29T07:00:00+00:00', artwork:'https://tuba.work/img/icon.ico'}
	
	const play =  async() => { tp.play(); setPlaying(true)} // so.playAsync();
	const stop = async () => { tp.stop(); setPlaying(false)} // so.stopAsync();
	const pause = async () => {tp.pause(); setPlaying(false)} // so.pauseAsync(); 

	//backward = async () => this.state.so.pauseAsync()
	const forward = async () => loadSong(getNewSong())
	const repeat = async () => {tp.pause()} // so.pauseAsync()
	//random = async () => this.state.so.pauseAsync()
	const setTrack = v => { tp.seekTo(v/1000); setSliding(false); setTrackPos(v)} // so.setPositionAsync(v);
	// this[name]
	const icon = name => (<TouchableHighlight onPress={name} activeOpacity={0.4}>
		<Icon style={styles.iconStyle} name={name.name} size={32} color="lime" />
	</TouchableHighlight>)

	const getNewSong = () => {
		let len = songs.length
		return songs[Math.floor(Math.random()*len)]
	}

	let toRemove

	const loadSong = async song => {
		await tp.setupPlayer()
		if(song){
			try {
				setMusic(song)
				const uri = `https://tuba.work/users/${user}/${song}`
				let track = {id: song, url: uri, title: song, ...t}
				await tp.add([track])
				tp.play()
				setPlaying(true)
			} catch (error) { console.log(error) }
		}
	}

	const updatePlayer = async st => {
		if(st && mounted && st.isLoaded){
			const newPos = st.positionMillis
			if(trackPos !== newPos) setTrackPos(newPos)
			if(maxPos!==st.durationMillis) setMaxPos(st.durationMillis)
			if(st.didJustFinish) setTrackPos(0)
			if(st.didJustFinish) loadSong(getNewSong())
		}
	}
	
	useEffect(() => {
		setMounted(true)
		loadSong(getNewSong())
		
		return function cleanup(){ 
			setMounted(false)
			//so.unloadAsync()
		}
	}, [])

	return (
		<SafeAreaView style={styles.app}>
			<StatusBar barStyle="light-content" backgroundColor="#000000" />
			{error && <Text style={styles.error}>{error}</Text>}
			{!songs.length ? ( <Upload /> ) : (
				<View style={styles.container}>
					<Text style={styles.container}>{music}</Text>
					<Slider style={styles.container} 
						onValueChange={() => !sliding ? setSliding(true) : true}
						onSlidingComplete={v => setTrack(v)} 
						value={trackPos}
						maximumValue={maxPos} />
					<View style={styles.icons}>
						<View style={styles.iconContainer}>
							{playing ? icon(pause) : icon(play)} 
							{icon(forward)} 
							{icon(stop)}
						 </View>
					</View>
				</View>
			)}
			<SongList songList={songs} navigation={navigation} play={loadSong}/>
		</SafeAreaView>)
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
	error: {
		textAlign: 'center',
    	backgroundColor: '#000000',
	    color: '#ff0000',
	    margin: 10,
	},
});
