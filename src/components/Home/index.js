import {Link} from 'react-router-dom'
import Header from '../Header'

const Home = props => {
  const findjobbtn = () => {
    const {history} = props
    history.replace('/Jobs')
  }
  return (
    <div>
      <Header />
      <h1>Find The Job That Fits Your Life </h1>
      <p>
        Millions of people are searching for jobs. Find The Job That Fits Your
        Life Find The Job That Fits Your Life Find The Job That Fits Your Life
      </p>
      <Link to="/Jobs">
        <button type="button" onClick={findjobbtn}>
          Find Jobs
        </button>
      </Link>
    </div>
  )
}
export default Home
