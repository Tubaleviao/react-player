import React from 'react';
import Login from './login'
import SongList from './songList'
import api from './api'
import { AsyncStorage, View, Text, Button, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


const Stack = createStackNavigator();

class Player extends React.Component {

	state = {
		user: false,
		loading: !(AsyncStorage.getItem('user')==null),
		error: false,
		songs: [],
		username: "",
		pass: "",				// get, set, remove
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
		const {loading, error, face_auth} = this.state
		const {navigation} = this.props
		const {songs,user} = this.props.route.params
		return (<View><Text> music, progress bar, play button, music title, etc...</Text></View>
			<View style={styles.item}>
					<SongList songList={songs} navigation={navigation}/>
					{error && <h3 className="error">{error}</h3>}
				</View>)
	}
}

export default Player

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  }
});
