import {Component} from 'react'
import Cookies from 'js-cookie'

import './index.css'

class LoginForm extends Component {
  state = {username: '', password: '', errorMsg: ''}

  submitForm = async event => {
    event.preventDefault()
    const {history} = this.props
    const {username, password} = this.state
    const userDetails = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch('https://apis.ccbp.in/login', options)
    const data = await response.json()
    console.log(data, data.status_code)
    if (response.ok) {
      Cookies.set('jwt_token', data.jwt_token, {expires: 30})
      this.setState({errorMsg: ''})
      history.replace('/')
    } else {
      this.setState({errorMsg: `*${data.error_msg}`})
    }
  }

  onChangeUsername = e => {
    this.setState({username: e.target.value})
  }

  onChangePassword = e => {
    this.setState({password: e.target.value})
  }

  render() {
    const {username, password, errorMsg} = this.state
    return (
      <div className="login-page">
        <form className="login-container" onSubmit={this.submitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
          <label htmlFor="username">USERNAME</label>
          <input
            value={username}
            onChange={this.onChangeUsername}
            id="username"
            placeholder="E.g. rahul"
          />
          <label htmlFor="password">PASSWORD</label>
          <input
            value={password}
            onChange={this.onChangePassword}
            id="password"
            placeholder="E.g. rahul@2021"
            type="password"
          />
          <button type="submit">Login</button>
          <p className="error">{errorMsg}</p>
        </form>
      </div>
    )
  }
}
export default LoginForm
