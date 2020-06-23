import React from 'react'; // {useState, useEffect}
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
import Upload from './upload'
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import {AppState} from 'react-native';

const Stack = createStackNavigator();
//Audio.setAudioModeAsync({staysActiveInBackground: true})
Audio.setAudioModeAsync({
	staysActiveInBackground: true,
	shouldDuckAndroid: true,
	playThroughEarpieceAndroid: true,
	allowsRecordingIOS: true,
	playsInSilentModeIOS: true,
})

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

	useEffect(() => navigation.addListener('blur', async () =>{
		
	}), [])

	const [songs, setSongs] = useState(props.route.params.songs || []) 
	const [user, setUser] = useState(props.route.params.user || 'None')
	const [so, setSo] = useState(new Audio.Sound())
	const [trackPos, setTrackPos] = useState(0)
	const [sliding, setSliding] = useState(false)
	const [music, setMusic] = useState('')
	const [maxPos, setMaxPos] = useState(0) // mounted
	const [playing, setPlaying] = useState(false)
	const [error, setError] = useState(false)
	const [mounted, setMounted] = useState(false)

	const registerForPushNotificationsAsync = async () => {
	    if (Constants.isDevice) {
	      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);

	      let finalStatus = existingStatus;
	      if (existingStatus !== 'granted') {
	        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
	        finalStatus = status;
	      }
	      if (finalStatus !== 'granted') {
	        alert('Failed to get push token for push notification!');
	        return;
	      }
	    } else {
	      alert('Must use physical device for Push Notifications');
	    }

	    if (Platform.OS === 'android') {
	      Notifications.createChannelAndroidAsync('main', {
	        name: 'main',
	        priority: 'max',
	        sound: false,
	        vibrate: false,
	      });
	    }
	  }
	const _notificationSubscription = Notifications.addListener(not => {});
	
	const play =  async() => {so.playAsync(); setPlaying(true)}
	const stop = async () => {so.stopAsync(); setPlaying(false)}
	const pause = async () => {so.pauseAsync(); setPlaying(false)}

	//backward = async () => this.state.so.pauseAsync()
	const forward = async () => loadSong(getNewSong())
	const repeat = async () => so.pauseAsync()
	//random = async () => this.state.so.pauseAsync()
	const setTrack = v => {so.setPositionAsync(v); setSliding(false); setTrackPos(v)}
	// this[name]
	const icon = name => (<TouchableHighlight onPress={name} activeOpacity={0.4}>
		<FontAwesome style={styles.iconStyle} name={name.name} size={32} color="lime" />
	</TouchableHighlight>)

	const getNewSong = () => {
		let len = songs.length
		return songs[Math.floor(Math.random()*len)]
	}

	const loadSong = async song => {
		if(song){
			try {
				AppState.removeEventListener('change', _handleAppStateChange(music))
				AppState.addEventListener('change', _handleAppStateChange(song))
				const uri = `https://tuba.work/users/${user}/${song}`
				await so.unloadAsync()
				await so.setOnPlaybackStatusUpdate(updatePlayer)
				await so.loadAsync({uri: uri})
				await so.setStatusAsync({
					progressUpdateIntervalMillis: 1100, 
					shouldPlay: true,
				})
				setPlaying(true)
				
			} catch (error) { console.log(error) }
		}
	}

	const updatePlayer = async st => {
		if(st && st.isLoaded){
			const newMusic = st.uri.split('/')[st.uri.split('/').length-1]
			const newPos = st.positionMillis
			if(music!==newMusic) setMusic(newMusic)
			if(trackPos !== newPos) setTrackPos(newPos)
			if(maxPos!==st.durationMillis) setMaxPos(st.durationMillis)
			if(st.didJustFinish) setTrackPos(0)
			if(st.didJustFinish) loadSong(getNewSong())
		}
	}

	/*shouldComponentUpdate(np, nt){ // React.memo ??
		if(nt.sliding) return false
		else return true
	}*/

	const _handleAppStateChange = song => nextState => {
		if(nextState==='background'){
			Notifications.presentLocalNotificationAsync({
        		title: 'Now playing', body: song, 
        		android: { channelId: 'main', sticky: true, icon:'https://tuba.work/img/icon.ico', color:'#00ff00' },
            	ios: { _displayInForeground: true } })
		}else{
			Notifications.dismissAllNotificationsAsync()
		}
		console.log(nextState)
	}
	
	useEffect(() => {
		//AppState.addEventListener('change', _handleAppStateChange.bind({music: getSong}));
		setMounted(true)
		registerForPushNotificationsAsync()
		loadSong(getNewSong())
		return function cleanup(){ 
			setMounted(false)
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
