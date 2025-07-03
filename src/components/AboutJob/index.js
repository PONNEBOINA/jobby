import {Component} from 'react'
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
  inprogress: 'IN_PROGRESS',
}

class AboutJob extends Component {
  state = {
    jobData: [],
    apiJob: apiJobsStatus.initial,
    similarJobs: [],
  }

  componentDidMount() {
    this.getJobData()
  }

  getJobData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    this.setState({apiJob: apiJobsStatus.inprogress})
    const url = `https://apis.ccbp.in/jobs/${id}`
    const option = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, option)
    const data = await response.json()
    if (response.ok === true) {
      const fetchedData = [data.job_details].map(each => ({
        id: each.id,
        title: each.title,
        companyLogoUrl: each.company_logo_url,
        companyWebsiteUrl: each.company_website_url,
        rating: each.rating,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        jobDescription: each.job_description,
        lifeAtCompany: {
          description: each.life_at_company.description,
          imageUrl: each.life_at_company.image_url,
        },
        employmentType: each.employment_type,

        skills: each.skills.map(eachskill => ({
          imageUrl: eachskill.image_url,
          name: eachskill.name,
        })),
      }))

      const similarJobsData = data.similar_jobs.map(eachsimilar => ({
        id: eachsimilar.id,
        title: eachsimilar.title,
        companyLogoUrl: eachsimilar.company_logo_url,
        location: eachsimilar.location,
        employmentType: eachsimilar.employment_type,
        jobDescription: eachsimilar.job_description,
        rating: eachsimilar.rating,
      }))
      this.setState({
        jobData: fetchedData,
        similarJobs: similarJobsData,
        apiJob: apiJobsStatus.success,
      })
    } else {
      this.setState({apiJob: apiJobsStatus.failure})
    }
  }

  renderJobSuccess = () => {
    const {jobData, similarJobs} = this.state
    if (jobData.length >= 1) {
      const {
        title,
        employmentType,
        companyLogoUrl,
        companyWebsiteUrl,
        rating,
        packagePerAnnum,
        location,
        lifeAtCompany,
        jobDescription,
        skills,
      } = jobData[0]
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
                <a href={companyWebsiteUrl}>Visit</a>
              </div>
            </div>
            <p>{jobDescription}</p>
            <hr />

            <h1>Skills</h1>
            <ul className="skills">
              {skills.map(each => (
                <li key={each.name}>
                  <img src={each.imageUrl} alt={each.name} />
                  <p>{each.name}</p>
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
    return null
  }

  renderLoadingView = () => (
    <div data-testid="Loader">
      <Loader type="ThreeDots" height="50" width="50" />
    </div>
  )

  renderJobFailure = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" onClick={this.onretryjobs}>
        Retry
      </button>
    </div>
  )

  renderJobDetails = () => {
    const {apiJob} = this.state
    switch (apiJob) {
      case apiJobsStatus.success:
        return this.renderJobSuccess()
      case apiJobsStatus.failure:
        return this.renderJobFailure()
      case apiJobsStatus.loading:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        <div>{this.renderJobDetails()}</div>
      </div>
    )
  }
}
export default AboutJob
