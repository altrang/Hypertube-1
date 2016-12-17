import React											from 'react'
import Router											from 'react-router/lib/Router'
import Route											from 'react-router/lib/Route'
import IndexRoute										from 'react-router/lib/IndexRoute'
import browserHistory									from 'react-router/lib/browserHistory'
import MuiThemeProvider									from 'material-ui/styles/MuiThemeProvider'

import Auth										from './containers/auth'
import LoginForm								from './containers/auth/Login/LoginForm'
import RegisterForm								from './containers/auth/Register/RegisterForm'
import ForgotPassForm							from './containers/auth/Forgot/ForgotPassForm'
import ResetPassForm							from './containers/auth/ResetPass/ResetPassForm'
import HeadAndFoot								from './containers/HeadAndFoot'
import Search									from './containers/Search'
import HomePage									from './containers/HomePage'
import Movie									from './containers/Movie'
import Profile									from './containers/Profile'

export default () => {
	return (
		<MuiThemeProvider>
			<Router history={browserHistory}>
				<Route path="/" component={Auth}>
					<IndexRoute component={LoginForm} />
					<Route path="register" component={RegisterForm} />
					<Route path="forgot" component={ForgotPassForm} />
					<Route path="reset_password" component={ResetPassForm} />
				</Route>
				<Route path="/ht" component={HeadAndFoot}>
					<IndexRoute component={HomePage} />
					<Route path="search" component={Search} />
					<Route path="movie/:id" component={Movie} />
					<Route path="profile" component={Profile} />
				</Route>
			</Router>
		</MuiThemeProvider>
	)
}
