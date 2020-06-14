import React from 'react'
import Song from './song'
import {StyleSheet} from 'react-native'

const SongList = ({songList=[]}) => {
	return (<div>
		{songList.length > 0 ? <ul>{songList.map((song, i) => <Song key={i} title={song} />)}</ul>
			: <div><p>You have no songs! Try to upload some</p></div>}
		<button>Upload</button>
		</div>
	)
}

export default SongList