import React from 'react'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'

const Login = ({s, c, face, l, face_auth}) =>
	<div class="wrapper">
		<p>Welcome</p>
		<div class="container">
			<form onSubmit={s}>
				<input onChange={c} name="username" type="text" placeholder="Username..." required />
				<input onChange={c} name="pass" type="password" placeholder="Password..." />
				<button type="submit">Submit</button>
			</form>
			<FacebookLogin
			    appId="224877325522905"
			    fields="name,email,picture"
			    autoLoad={face_auth}
			    callback={face} 
			    render={renderProps => (
					<button onClick={() =>{renderProps.onClick(); l();}}>
						Login with Facebook
					</button>
				)} />
			<ul class="bubbles">
				<li></li> <li></li> <li></li> <li></li> <li></li>
				<li></li> <li></li> <li></li> <li></li> <li></li>
			</ul>
		</div>
	</div>

export default Login
