import React from 'react'
//import Song from './song'
import {StyleSheet, FlatList, SafeAreaView, Text, Button} from 'react-native'
import Constants from 'expo-constants';

const SongList = ({navigation, songList=[]}) => {
	let counter=0
	return (
		<SafeAreaView>
			<FlatList data={songList}
				renderItem={({item}) => (<Text style={styles.title} >{item}</Text>)}
				keyExtractor={item => ++counter}
			/>
		</SafeAreaView>
	)
}

export default SongList

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  title: {
    fontSize: 32,
  },
});