import React from 'react'
//import Song from './song'
import {StyleSheet, FlatList, SafeAreaView, Text, Button} from 'react-native'
import Constants from 'expo-constants';

const SongList = ({navigation, songList=[], play}) => {
	let counter=0
	return (
		<SafeAreaView>
			<FlatList data={songList}
				renderItem={({item}) => (<Text style={styles.item} onPress={() => play(item)} >{item}</Text>)}
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