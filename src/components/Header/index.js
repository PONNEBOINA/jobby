import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'

const Header = props => {
  const logoutbtn = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <div>
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
        />
      </Link>
      <div>
        <Link to="/">Home</Link>
      </div>
      <Link to="/Jobs">Jobs</Link>
      <button type="button" onClick={logoutbtn}>
        Logout
      </button>
    </div>
  )
}
export default withRouter(Header)
