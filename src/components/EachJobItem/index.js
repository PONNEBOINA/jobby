import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {Link} from 'react-router-dom'
import './index.css'

const EachJobItem = props => {
  const {eachitem} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = eachitem
  return (
    <div className="each-job-background">
      <Link to={`/jobs/${id}`} className="job-link">
        <div className="job-background">
          <div className="company-img-rating">
            <img src={companyLogoUrl} alt="company logo" />
            <div>
              <h1>{title}</h1>
              <div className="rating-star">
                <AiFillStar />
                <p>{rating}</p>
              </div>
            </div>
          </div>
          <div className="location-icon">
            <MdLocationOn />
            <p>{location}</p>

            <p>{employmentType}</p>
          </div>
          <p>{packagePerAnnum}</p>
          <hr />
          <h1>Description</h1>
          <p>{jobDescription}</p>
          <hr />
        </div>
      </Link>
    </div>
  )
}
export default EachJobItem
