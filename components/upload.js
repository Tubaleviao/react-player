import React from 'react'
import { Button, StyleSheet, Text, AsyncStorage } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Api from './api'
import * as DocumentPicker from 'expo-document-picker';

class Upload extends React.Component{

	constructor(props){
		super(props)
	}

	state = { error: false }

	pickSong = async () => {
		const file = await DocumentPicker.getDocumentAsync({type: 'audio/mpeg'})
		if(file.type === 'success'){
			file.type = 'audio/mpeg'
			const worked = await Api.sendAudio(file)
			if(worked.ok){
				await AsyncStorage.setItem('newSong', worked.song)
				this.props.navigation.goBack()
			}else{this.setState({error: worked.msg})}
		}
	}

	render() {
		const {error} = this.state
		return (
			<SafeAreaView style={styles.app}>
				{error && <Text style={styles.error}>{error}</Text>}
				<Text style={styles.container}> Try adding new songs!{"\n"} 
					To select multiple files, try the webpage {"\n"}
					<Text style={{color:'lime', textDecorationLine: 'underline',}} 
						onPress={() => Linking.openURL('https://tuba.work/player')}>
						tuba.work/player
					</Text>
				</Text>
				<Button title="Upload" onPress={this.pickSong} />
			</SafeAreaView>
		)
	}
	
}

export default Upload

const styles = StyleSheet.create({
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
})