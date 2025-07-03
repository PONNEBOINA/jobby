import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const logoutbtn = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <div className="headerstyle">
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
        />
      </Link>
      <div className="links">
        <Link className="homelink" to="/">
          Home
        </Link>
        <Link className="jobslink" to="/Jobs">
          Jobs
        </Link>
      </div>
      <button className="button" type="button" onClick={logoutbtn}>
        Logout
      </button>
    </div>
  )
}
export default withRouter(Header)
