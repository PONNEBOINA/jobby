import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import './index.css'

const SimilarJobs = props => {
  const {similarJobsdetails} = props
  const {
    title,
    companyLogoUrl,
    location,
    employmentType,
    jobDescription,
    rating,
  } = similarJobsdetails
  return (
    <div className="similar">
      <div className="similar-list">
        <div className="company-img-rating">
          <img src={companyLogoUrl} alt="job details company logo" />
          <div>
            <h1>{title}</h1>
            <div className="rating-star">
              <AiFillStar />
              <p>{rating}</p>
            </div>
          </div>
        </div>
        <p>Description</p>
        <p>{jobDescription}</p>
        <div className="location-icon">
          <MdLocationOn />
          <p>{location}</p>
          <p>{employmentType}</p>
        </div>
      </div>
    </div>
  )
}
export default SimilarJobs
