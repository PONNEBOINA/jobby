import {useState, useEffect} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import EachJobItem from '../EachJobItem'

import './index.css'

const employmentTypesList = [
  {label: 'Full Time', employmentTypeId: 'FULLTIME'},
  {label: 'Part Time', employmentTypeId: 'PARTTIME'},
  {label: 'Freelance', employmentTypeId: 'FREELANCE'},
  {label: 'Internship', employmentTypeId: 'INTERNSHIP'},
]

const apiProfileContext = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const apiJobsContext = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const AllJobs = () => {
  const [profileData, setProfileData] = useState({})
  const [apiProfile, setApiProfile] = useState(apiProfileContext.initial)
  const [apiJob, setApiJob] = useState(apiJobsContext.initial)
  const [jobsData, setJobsData] = useState([])
  const [checkBoxList, setCheckBoxList] = useState([])
  const [activeRadioinput, setActiveRadioinput] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    getProfileData()
    getJobData()
  }, [])

  const getProfileData = async () => {
    setApiProfile(apiProfileContext.inProgress)
    const jwt = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const option = {
      headers: {Authorization: `Bearer ${jwt}`},
      method: 'GET',
    }

    const response = await fetch(url, option)
    const data = await response.json()

    if (response.ok) {
      const profile = data.profile_details
      const updateData = {
        name: profile.name,
        image: profile.profile_image_url,
        shortBio: profile.short_bio,
      }
      setProfileData(updateData)
      setApiProfile(apiProfileContext.success)
    } else {
      setApiProfile(apiProfileContext.failure)
    }
  }

  const getJobData = async () => {
    setApiJob(apiJobsContext.inProgress)
    const jwt = Cookies.get('jwt_token')
    const employmentTypes = checkBoxList.join(',')
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentTypes}&minimum_package=${activeRadioinput}&search=${searchInput}`

    const option = {
      headers: {Authorization: `Bearer ${jwt}`},
      method: 'GET',
    }

    const response = await fetch(url, option)
    const data = await response.json()

    if (response.ok) {
      const fetchedData = data.jobs.map(job => ({
        id: job.id,
        title: job.title,
        rating: job.rating,
        companyLogoUrl: job.company_logo_url,
        location: job.location,
        jobDescription: job.job_description,
        employmentType: job.employment_type,
        packagePerAnnum: job.package_per_annum,
      }))
      setJobsData(fetchedData)
      setApiJob(apiJobsContext.success)
    } else {
      setApiJob(apiJobsContext.failure)
    }
  }

  const renderProfileSuccess = () => {
    const {name, image, shortBio} = profileData
    return (
      <div className="profileView">
        <img src={image} alt="profile" />
        <h1>{name}</h1>
        <p>{shortBio}</p>
      </div>
    )
  }

  const renderProfileFailure = () => (
    <div>
      <button type="button" onClick={getProfileData}>
        Retry
      </button>
    </div>
  )

  const renderLoadingView = () => (
    <div data-testid="Loader">
      <Loader type="ThreeDots" height="50" width="50" />
    </div>
  )

  const renderProfileData = () => {
    switch (apiProfile) {
      case apiProfileContext.success:
        return renderProfileSuccess()
      case apiProfileContext.failure:
        return renderProfileFailure()
      case apiProfileContext.inProgress:
        return renderLoadingView()
      default:
        return null
    }
  }

  const renderJobsSuccess = () => {
    const noJobs = jobsData.length === 0
    const visibleJobs = showAll ? jobsData : jobsData.slice(0, 3)

    return noJobs ? (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1>No jobs found</h1>
        <p>We could not find any jobs. Try other filters</p>
      </div>
    ) : (
      <>
        <ul className="list">
          {visibleJobs.map(each => (
            <EachJobItem key={each.id} eachitem={each} />
          ))}
        </ul>
        {jobsData.length > 3 && (
          <div style={{textAlign: 'center', marginTop: '20px'}}>
            <button
              type="button"
              onClick={() => setShowAll(prev => !prev)}
              className="load-more-btn"
            >
              {showAll ? 'Show Less' : 'Load More'}
            </button>
          </div>
        )}
      </>
    )
  }

  const renderJobsFailure = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failue view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" onClick={getJobData}>
        Retry
      </button>
    </div>
  )

  const renderJobsData = () => {
    switch (apiJob) {
      case apiJobsContext.success:
        return renderJobsSuccess()
      case apiJobsContext.failure:
        return renderJobsFailure()
      case apiJobsContext.inProgress:
        return renderLoadingView()
      default:
        return null
    }
  }

  const onChangeCheckBox = event => {
    const id = event.target.id
    const isChecked = checkBoxList.includes(id)
    const updatedList = isChecked
      ? checkBoxList.filter(item => item !== id)
      : [...checkBoxList, id]

    setCheckBoxList(updatedList)
  }

  useEffect(() => {
    getJobData()
  }, [checkBoxList, activeRadioinput, searchInput])

  const renderCheckBoxView = () => (
    <ul>
      {employmentTypesList.map(each => (
        <li key={each.employmentTypeId}>
          <input
            type="checkbox"
            id={each.employmentTypeId}
            checked={checkBoxList.includes(each.employmentTypeId)}
            onChange={onChangeCheckBox}
          />
          <label htmlFor={each.employmentTypeId}>{each.label}</label>
        </li>
      ))}
    </ul>
  )

  const onChangeRadioBtn = event => {
    setActiveRadioinput(event.target.id)
  }

  const onSearchChange = e => {
    setSearchInput(e.target.value)
  }

  const onEnterKey = e => {
    if (e.key === 'Enter') {
      getJobData()
    }
  }

  return (
    <div className="detial-job-view">
      <Header />
      <div className="jobs-data">
        <div className="sidebar">
          {renderProfileData()}
          <h1>Type of Employment</h1>
          {renderCheckBoxView()}
          {/* Add Salary Range filters here if needed */}
        </div>
        <div className="job-list">
          <div className="search-bar">
            <input
              type="search"
              value={searchInput}
              onChange={onSearchChange}
              onKeyDown={onEnterKey}
              placeholder="Search jobs"
            />
            <button onClick={getJobData}>Search</button>
          </div>
          {renderJobsData()}
        </div>
      </div>
    </div>
  )
}

export default AllJobs
