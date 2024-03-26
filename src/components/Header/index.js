import Cookies from 'js-cookie'
import {Link, withRouter} from 'react-router-dom'

import {AiFillHome} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'

import './index.css'

const Header = props => {
  const logout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <>
      <div className="header-div-mobile">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
        />
        <div>
          <Link to="/">
            <AiFillHome />
          </Link>
          <Link to="/jobs">
            <BsFillBriefcaseFill />
          </Link>
          <button type="button" onClick={logout}>
            {' '}
            <FiLogOut />{' '}
          </button>
        </div>
      </div>
      <div className="header-div-desktop">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
        />
        <div>
          <a href="/">Home</a>
          <a href="/jobs">Jobs</a>
        </div>
        <button type="button" onClick={logout}>
          Logout
        </button>
      </div>
    </>
  )
}

export default withRouter(Header)
