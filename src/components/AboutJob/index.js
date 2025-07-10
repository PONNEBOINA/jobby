import {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import Loader from 'react-loader-spinner'

import SimilarJobs from '../SimilarJobs'
import Header from '../Header'
import './index.css'

const apiJobsStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const AboutJob = () => {
  const [jobData, setJobData] = useState(null)
  const [similarJobs, setSimilarJobs] = useState([])
  const [apiJob, setApiJob] = useState(apiJobsStatus.initial)

  const {id} = useParams()

  const getJobData = async () => {
    setApiJob(apiJobsStatus.inProgress)
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok) {
      const fetchedData = {
        id: data.job_details.id,
        title: data.job_details.title,
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        rating: data.job_details.rating,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        jobDescription: data.job_details.job_description,
        lifeAtCompany: {
          description: data.job_details.life_at_company.description,
          imageUrl: data.job_details.life_at_company.image_url,
        },
        employmentType: data.job_details.employment_type,
        skills: data.job_details.skills.map(skill => ({
          imageUrl: skill.image_url,
          name: skill.name,
        })),
      }

      const similarJobsData = data.similar_jobs.map(job => ({
        id: job.id,
        title: job.title,
        companyLogoUrl: job.company_logo_url,
        location: job.location,
        employmentType: job.employment_type,
        jobDescription: job.job_description,
        rating: job.rating,
      }))

      setJobData(fetchedData)
      setSimilarJobs(similarJobsData)
      setApiJob(apiJobsStatus.success)
    } else {
      setApiJob(apiJobsStatus.failure)
    }
  }

  useEffect(() => {
    getJobData()
  }, [id])

  const onRetry = () => getJobData()

  const renderLoadingView = () => (
    <div data-testid="Loader">
      <Loader type="ThreeDots" height="50" width="50" />
    </div>
  )

  const renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" onClick={onRetry}>Retry</button>
    </div>
  )

  const renderSuccessView = () => {
    if (!jobData) return null

    const {
      title,
      companyLogoUrl,
      companyWebsiteUrl,
      rating,
      employmentType,
      location,
      packagePerAnnum,
      jobDescription,
      lifeAtCompany,
      skills,
    } = jobData

    return (
      <div className="detail-job">
        <div className="about-job-background">
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

          <div className="location-icon">
            <MdLocationOn />
            <p>{location}</p>
            <p>{employmentType}</p>
          </div>
          <p>{packagePerAnnum}</p>
          <hr />
          <div className="visit-link">
            <h1>Description</h1>
            <div className="vistlink">
              <a href={companyWebsiteUrl} target="_blank" rel="noreferrer">Visit</a>
            </div>
          </div>
          <p>{jobDescription}</p>
          <hr />

          <h1>Skills</h1>
          <ul className="skills">
            {skills.map(skill => (
              <li key={skill.name}>
                <img src={skill.imageUrl} alt={skill.name} />
                <p>{skill.name}</p>
              </li>
            ))}
          </ul>

          <h1>Life at Company</h1>
          <div className="life-at-company">
            <div>
              <p>{lifeAtCompany.description}</p>
            </div>
            <img
              src={lifeAtCompany.imageUrl}
              alt="life at company"
              className="img"
            />
          </div>
        </div>

        <h1>Similar Jobs</h1>
        <ul>
          {similarJobs.map(each => (
            <SimilarJobs key={each.id} similarJobsdetails={each} />
          ))}
        </ul>
      </div>
    )
  }

  const renderJobDetails = () => {
    switch (apiJob) {
      case apiJobsStatus.success:
        return renderSuccessView()
      case apiJobsStatus.failure:
        return renderFailureView()
      case apiJobsStatus.inProgress:
        return renderLoadingView()
      default:
        return null
    }
  }

  return (
    <div>
      <Header />
      {renderJobDetails()}
    </div>
  )
}

export default AboutJob
