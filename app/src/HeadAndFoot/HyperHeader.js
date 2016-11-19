import React					from 'react'
import { connect }				from 'react-redux'
import { browserHistory }		from 'react-router'
import axios					from 'axios'

import IconMenu					from 'material-ui/IconMenu'
import IconButton				from 'material-ui/IconButton'
import SearchForm				from '../components/SearchForm'
import LangPicker				from '../components/LangPicker'
import ColorPicker				from '../components/ColorPicker'
import ProfileIcon				from '../components/ProfileIcon'

import './sass/header.sass'

class HyperHeader extends React.Component {
	_mounted = false

	state = {
		userData: null,
	}

	componentDidMount() {
		this._mounted = true
		// axios({
		// 	url: 'http://e3r2p7.42.fr:8080/test',
		// 	method: 'post',
		// }).then((response) => {
		// 	console.log(response.data)
		// })
	}

	componentWillMount() {
		axios.get('http://localhost:8081/api/user/profile')
			.then(({ data }) => {
				if (!this._mounted) return false
				if (data.status === 'success') {
					this.setState({ userData: data.result })
				}
			}
		)
	}

	componentWillUnmount() {
		this._mounted = false
	}

	goHome = () => browserHistory.push('/ht')

	render() {
		const { mainColor, location } = this.props
		const { userData } = this.state
		return (
			<div style={{ backgroundColor: mainColor }} className="headerContainer">
				<span className="hyperTitle" onClick={this.goHome}>HYPERTUBE</span>
				<SearchForm location={location}/>
				<div className="profSet">
					<ProfileIcon image={userData ? userData.image : null} />
					<IconMenu
						style={{ marginRight: '10px' }}
						anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
						targetOrigin={{ horizontal: 'right', vertical: 'top' }}
						iconButtonElement={
							<IconButton iconStyle={{ color: 'white' }}>
								<i className="material-icons">more_vert</i>
							</IconButton>
						}
					>
						<ColorPicker />
						<LangPicker />
					</IconMenu>
				</div>
			</div>
		)
	}
}

const mapStateToProps = ({ lang, theme }) => ({
	l: lang.l,
	mainColor: theme.mainColor,
})

export default connect(mapStateToProps)(HyperHeader)