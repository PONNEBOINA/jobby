import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'

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
    <li>
      <img src={companyLogoUrl} alt="job details company logo" />
      <h1>{title}</h1>
      <AiFillStar />
      <p>{rating}</p>
      <p>Description</p>
      <p>{jobDescription}</p>
      <MdLocationOn />
      <p>{location}</p>
      <p>{employmentType}</p>
    </li>
  )
}
export default SimilarJobs
