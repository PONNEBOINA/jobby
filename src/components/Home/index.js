import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = props => {
  const findjobbtn = () => {
    const {history} = props
    history.replace('/Jobs')
  }
  return (
    <div className="home-page">
      <Header />
      <div className="home-text">
        <h1 className="heading">Find The Job That Fits Your Life! </h1>
        <p className="para">
          Millions of people are searching for jobs, salary, information and
          company reviews. Find The Job That Fits Your ability and potential.
        </p>
      </div>
      <Link to="/Jobs">
        <button type="button" className="btn" onClick={findjobbtn}>
          Find Jobs
        </button>
      </Link>
    </div>
  )
}
export default Home
