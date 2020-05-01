import React from 'react';
import Song from './song'

const SongList = ({songList=[]}) => 
	songList.map((song, i) => <Song key={i} title={song.title} />)

export default SongList