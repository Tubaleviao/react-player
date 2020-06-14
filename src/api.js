class Api {

	async getToken(body){
		let result
		try{
			const response = await fetch(`/jwt`, {
				method: 'POST',
				headers: {'Accept': 'application/json',
							'Content-Type': 'application/json'},
				body: body
			})
			const user = await response.json()
			if(user.ok){
				const {token, data: {username}} = user
				result = {user: 
					{username, token},
					error: false
				}
			}else{
				result = {error: user.msg}
				console.error(`Error ho: ${user.msg}`)
			}
		}catch(e){
			console.error(`Error he: ${e}`)
			result = {error: "Authentication failed"}
		}
		return result
	}

	async isValid(face_user){
		let result
		const url = `https://graph.facebook.com/debug_token?`+
						`input_token=${face_user.accessToken}`+
						`&access_token=${face_user.accessToken}`
		try{
			const web = `/isValid`
			const response = await fetch(web, {
				method: 'POST',
				headers: {'Accept': 'application/json',
							'Content-Type': 'application/json'},
				body: JSON.stringify({url, face_user})
			})
			const res = await response.json()
			result = res
		}catch(e){
			console.error(`Error hi: ${e}`)
			result = {error: "Facebook token invalid"}
		}
		return result
	}

	async getSongs(user){
		const options = {headers: {"token": user.token}}
		let response = await fetch(`/songs`, options)
		if(response.ok) response = await response.json()
		 //await response.text()
		return response
	}
}

export default new Api() // Singleton