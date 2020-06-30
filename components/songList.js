import React from 'react'
//import Song from './song'
import {StyleSheet, FlatList, SafeAreaView, Text, TouchableHighlight} from 'react-native'

const SongList = ({navigation, songList=[], play}) => {
	let counter=0
	return (
		<SafeAreaView>
			<FlatList data={songList}
				renderItem={({item}) => (
					<TouchableHighlight 
						onPress={() => play(item.substr(item.lastIndexOf('/')+1))} >
						<Text style={styles.item}>{item}</Text>
					</TouchableHighlight>)}
				keyExtractor={item => String(++counter)}
			/>
		</SafeAreaView>
	)
}

export default SongList

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
  },
  item: {
  	color: '#00ff00',
    backgroundColor: '#002200',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  }
});