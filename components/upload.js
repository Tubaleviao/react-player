import React from 'react'
import { Button, StyleSheet, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { sendAudio } from './api'
import * as DocumentPicker from 'expo-document-picker';

class Upload extends React.Component{

	constructor(props){
		super(props)
	}

	pickSong = async () => {
		const file = await DocumentPicker.getDocumentAsync({type: 'audio/mpeg'})
		if(file.type === 'success'){
			file.type = 'audio/mpeg'
			//const worked = await sendAudio(file)
			const worked = false
			if(worked){
				if(this.state.songs.length === 0) this.loadSong(worked)
				this.setState({songs: [...this.state.songs, worked]})
			}
			console.log('uo')
			this.setState({music: "testing"})
			this.props.navigation.goBack()
		}
	}

	render() {
		return (
			<SafeAreaView style={styles.app}>
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
})