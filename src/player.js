import React from 'react';
import Login from './login'
import SongList from './songList'
import api from './api'
import loading_svg from './loading.svg'

import './player.scss'

class Player extends React.Component {

	state = {
		user: false,
		loading: !(localStorage.getItem('user')==null),
		error: false,
		songs: [],
		username: "",
		pass: "",				// get, set, remove
		face_auth: !(localStorage.getItem('user')==null) 
	}

	handleChange = event => {
		const {name, value} = event.target
		this.setState({[name]: value})
	}

	handleSubmit = async event => {
		this.setState({loading: true})
		event.preventDefault()
		const {username, pass} = this.state
		const body = JSON.stringify({"username":username, "password": pass})
		const user = await api.getToken(body)
		if(!user.error){
			localStorage.setItem('user', JSON.stringify(user.user))
		}
		user.loading = false
		user.songs = await api.getSongs(user.user)
		this.setState(user)
	}

	face = async face_user => {
		let st = {loading: false}
		const response = await api.isValid(face_user)
		if(response.isValid || response.ok){
			// user will have username and token for now
			const {user:username, token} = response
			st.songs = await api.getSongs({username, token})
			localStorage.setItem('user', JSON.stringify({username, token}))
			st.user = face_user.email
			st.error = false
		}else st.error = "Please login again"
		this.setState(st)
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
		const {songs} = this.props
		const {loading, error, face_auth} = this.state
		return (<div>
			{this.state.user ? 
				<SongList songList={songs} /> : 
				<Login s={this.handleSubmit} 
					c={this.handleChange} 
					face={this.face} 
					l={this.load}
					face_auth={face_auth}/>
			}
			{error && <h3 className="error">{error}</h3>}
			{loading && <img src={loading_svg} alt="loading" />}
		</div>)
	}
}

export default Player
