import React					from 'react'
import { connect }				from 'react-redux'
import api						from '../../../apiCall'
import { selectAuth }			from '../../../action/auth'
import lang						from '../../../lang'
import colors					from '../../../colors/colors'

import TextField				from 'material-ui/TextField'
import FlatButton				from 'material-ui/FlatButton'

const styles = {
	textFieldSet: {
		className: 'textInp',
		autoComplete: 'off',
		floatingLabelFocusStyle: { color: colors.lightBlue },
		underlineFocusStyle: { borderColor: colors.lightBlue }
	},
	imageInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
  },
}

class registerForm extends React.Component {
	_mounted = false

	state = {
		username: '',
		password: '',
		passwordConfirm: '',
		mail: '',
		firstname: '',
		lastname: '',
		image: '',
		usernameR: null,
		passwordR: null,
		passwordConfirmR: null,
		mailR: null,
		firstnameR: null,
		lastnameR: null,
		imageR: null,
		imageInput: lang.chooseAnImage[this.props.l || 0]
	}

	componentDidMount() {
		this._mounted = true
	}

	componentWillUnmount() {
		this._mounted = false
	}

	componentWillReceiveProps = (newProps) => {
		this.setState({ imageInput: lang.chooseAnImage[newProps.l] })
	}

	handleChange = (e) => {
		const up = {}
		if (e.target.name.includes('image')) {
			const file = e.target.files[0]
			if (!file) return false
			const img = new Image()
			img.onload = () => this.setState({ image: file, imageR: null, imageInput: file.name })
			img.onerror = () => this.setState({
				imageInput: lang.invalidImage[this.props.l],
				image: null,
			})
			const _URL = window.URL || window.webkitURL
			img.src = _URL.createObjectURL(e.target.files[0])
		} else {
			up[e.target.name] = e.target.value
			this.setState({ ...up })
		}
	}

	uploadImage = async () => {
		const image = new FormData()
		image.append('image', this.state.image)
		await api.upPhoto(image)
		this.props.dispatch(selectAuth(100))
	}

	handleError = (data) => {
		const { l } = this.props
		// ERROR : USER ENTRY
		if (data.details.includes('invalid request')) {
			const error = {}
			data.error.forEach((el) => {
				if (!error[`${el.path}R`]) {
					error[`${el.path}R`] = lang.errorP[el.type][l]
				}
			})
			this.setState({ ...error })

		// ERROR : ALREADY USED | USERNAME
		} else if (data.details.includes('username already used')) {
			this.setState({ usernameR: lang.alreadyUsed[l] })

		// ERROR : ALREADY USED | MAIL
		} else if (data.details.includes('mail already used')) {
			this.setState({ mailR: lang.alreadyUsed[l] })

		// ERROR : OTHER
		} else {
			this.setState({ serverResponse: lang.error[l] })
		}
	}

	signUp = async () => {
		const {
			username,
			password,
			passwordConfirm,
			mail,
			firstname,
			lastname,
			image,
		} = this.state

		this.setState({
			usernameR: null,
			passwordR: null,
			firstnameR: null,
			lastnameR: null,
			passwordConfirmR: null,
			mailR: null,
			serverResponse: null,
		})

		const { l } = this.props
		const cred = {
			username,
			password,
			mail,
			lastname,
			firstname,
		}

		if (password !== passwordConfirm) {
			this.setState({
				passwordConfirmR: lang.passwordAreDifferent[l]
			})
		}

		if (!image || image === '') {
			this.setState({
				imageInput: `${lang.errorP['any.empty'][l]}: ${lang.chooseAnImage[l]}`
			})
			return false
		}

		const { data, headers } = await api.register(cred)

		// ERROR
		if ((data.status && data.status.includes('error')) || !data.status) {
			this.handleError(data)
		}

		// SUCCESS
		else if (data.status.includes('success')) {
			const token = headers['x-access-token']
			if (!token) return this.setState({ serverResponse: lang.error[l] })
			localStorage.setItem('logToken', token)
			this.uploadImage()
		}
	}

	checkSub = (e) => {
		if (e.keyCode === 13) this.signUp()
	}

	updateTextField = (e) => {
		if (e.target.value.length > 200) {
			e.target.value = '';
		}
	}

	render() {
		const { l } = this.props
		const {
			usernameR,
			passwordR,
			mailR,
			passwordConfirmR,
			firstnameR,
			lastnameR,
			imageInput,
		} = this.state
		return (
			<form className="authForm" onChange={this.handleChange} onKeyDown={this.checkSub}>
				<TextField
			    	floatingLabelText={lang.username[l]}
						name="username"
						type="text"
						onChange={this.updateTextField}
						errorText={usernameR}
						autoFocus={true}
						{ ...styles.textFieldSet }
    			/>
				<TextField
					floatingLabelText={lang.lastname[l]}
					name="lastname"
					type="text"
					onChange={this.updateTextField}
					errorText={lastnameR}
					{ ...styles.textFieldSet }
				/>
				<TextField
			    	floatingLabelText={lang.firstname[l]}
					name="firstname"
					type="text"
					onChange={this.updateTextField}
					errorText={firstnameR}
					{ ...styles.textFieldSet }
    			/>
				<TextField
			    	floatingLabelText={lang.mail[l]}
					name="mail"
					type="mail"
					onChange={this.updateTextField}
					errorText={mailR}
					{ ...styles.textFieldSet }
    			/>
				<TextField
			    	floatingLabelText={lang.password[l]}
					name="password"
					type="password"
					onChange={this.updateTextField}
					errorText={passwordR}
					{ ...styles.textFieldSet }
    			/>
				<TextField
			    	floatingLabelText={lang.passwordConfirm[l]}
					name="passwordConfirm"
					type="password"
					onChange={this.updateTextField}
					errorText={passwordConfirmR}
					{ ...styles.textFieldSet }
    			/>
				<FlatButton
					label={imageInput}
					labelPosition="before"
					style={{ width: '80%', margin: '10px 0' }}
				>
			      <input type="file" name="image" style={styles.imageInput} />
			    </FlatButton>
				<FlatButton
					label={lang.SIGNUP[l]}
					style={{ width: '80%', margin: '20px 0' }}
					onClick={this.signUp}
				/>
			</form>
		)
	}
}

const mapStateToProps = ({ lang }) => ({ l: lang.l })

export default connect(mapStateToProps)(registerForm)
