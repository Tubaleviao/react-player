let host = 'localhost' //'tuba.work'
let port = 4000

class Api {

	async getToken(body){
		let result
		try{
			const response = await fetch(`http://${host}:${port}/jwt`, {
				method: 'POST',
				headers: {'Accept': 'application/json',
							'Content-Type': 'application/json'},
				body: body
			})
			const user = await response.json()
			const {token, data: {username}} = user
			result = {user: 
				{username, token},
				error: false
			}
		}catch(e){
			console.error(`Error hi: ${e}`)
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
			const web = `http://${host}:${port}/isValid`
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
		const web = `http://${host}:${port}/songs`
		const options = {headers: {"token": user.token}}
		const response = await fetch(web, options)
		console.log(await response.text())
		return response
	}
}

export default new Api() // Singleton