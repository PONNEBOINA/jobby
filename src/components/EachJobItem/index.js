import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {Link} from 'react-router-dom'

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
    <>
      <Link to={`/jobs/${id}`}>
        <li>
          <div>
            <img src={companyLogoUrl} alt="company logo" />
            <div>
              <h1>{title}</h1>
              <AiFillStar />
              <p>{rating}</p>
            </div>
          </div>
          <MdLocationOn />
          <p>{location}</p>
          <p>{employmentType}</p>
          <p>{packagePerAnnum}</p>
          <hr />
          <h1>Description</h1>
          <p>{jobDescription}</p>
        </li>
      </Link>
    </>
  )
}
export default EachJobItem
