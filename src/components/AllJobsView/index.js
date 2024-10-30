import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiOutlineSearch} from 'react-icons/ai'
import Header from '../Header'
import EachJobItem from '../EachJobItem'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
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

class AllJobs extends Component {
  state = {
    profileData: {},
    apiProfile: apiProfileContext.initial,
    apiJob: apiJobsContext.initial,
    jobsData: [],
    checkBoxList: [],
    activeRadioinput: '',
    searchInput: '',
  }

  componentDidMount() {
    this.getProfileData()
    this.getJobData()
  }

  getProfileData = async () => {
    this.setState({apiProfile: apiProfileContext.inProgress})
    const jwt = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const option = {
      headers: {Authorization: `Bearer ${jwt}`},
      method: 'GET',
    }
    const response = await fetch(url, option)
    const data = await response.json()
    if (response.ok === true) {
      const profile = data.profile_details
      const updateData = {
        name: profile.name,
        image: profile.profile_image_url,
        shortBio: profile.short_bio,
      }
      this.setState({
        profileData: updateData,
        apiProfile: apiProfileContext.success,
      })
    } else {
      this.setState({apiProfile: apiProfileContext.failure})
    }
  }

  getJobData = async () => {
    this.setState({apiJob: apiJobsContext.inProgress})
    const {activeRadioinput, checkBoxList, searchInput} = this.state
    const jwt = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${checkBoxList}&minimum_package=${activeRadioinput}&search=${searchInput}`
    const option = {
      headers: {Authorization: `Bearer ${jwt}`},
      method: 'GET',
    }
    const response = await fetch(url, option)
    const data = await response.json()
    if (response.ok === true) {
      const fetchedData = await data.jobs.map(eachjobdetails => ({
        id: eachjobdetails.id,
        title: eachjobdetails.title,
        rating: eachjobdetails.rating,
        companyLogoUrl: eachjobdetails.company_logo_url,
        location: eachjobdetails.location,
        jobDescription: eachjobdetails.job_description,
        employmentType: eachjobdetails.employment_type,
        packagePerAnnum: eachjobdetails.package_per_annum,
      }))
      this.setState({apiJob: apiJobsContext.success, jobsData: fetchedData})
    } else {
      this.setState({apiJob: apiJobsContext.failure})
    }
  }

  renderProfileSuccess = () => {
    const {profileData} = this.state
    const {name, shortBio, image} = profileData
    console.log(image)
    return (
      <div>
        <img src={image} alt="profile" />
        <h1>{name}</h1>
        <p>{shortBio}</p>
      </div>
    )
  }

  Retrybtn = () => {
    this.getProfileData()
  }

  renderProfileFailure = () => (
    <div>
      <button type="button" onClick={this.Retrybtn}>
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div data-testid="Loader">
      <Loader type="ThreeDots" height="50" width="50" />
    </div>
  )

  renderProfileData = () => {
    const {apiProfile} = this.state
    switch (apiProfile) {
      case apiProfileContext.success:
        return this.renderProfileSuccess()
      case apiProfileContext.failure:
        return this.renderProfileFailure()
      case apiProfileContext.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderJobsSuccess = () => {
    const {jobsData} = this.state
    const noOfJobs = jobsData.length === 0
    return noOfJobs ? (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1>No jobs found</h1>
        <p>We could not find any jobs. Try other filters</p>
      </div>
    ) : (
      <ul>
        {jobsData.map(each => (
          <EachJobItem key={each.id} eachitem={each} />
        ))}
      </ul>
    )
  }

  retrybtn = () => {
    this.getJobData()
  }

  renderJobsFailure = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failue view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>we cannot seem to find the page you are looking for.</p>
      <div>
        <button type="button" aria-label="button" onClick={this.retrybtn}>
          Retry
        </button>
      </div>
    </div>
  )

  renderJobsData = () => {
    const {apiJob} = this.state
    switch (apiJob) {
      case apiProfileContext.success:
        return this.renderJobsSuccess()
      case apiProfileContext.failure:
        return this.renderJobsFailure()
      case apiProfileContext.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  onChangeCheckBox = event => {
    const {checkBoxList} = this.state
    const inputNoINlist = checkBoxList.filter(each => each === event.target.id)
    if (inputNoINlist.length === 0) {
      this.setState(
        prevState => ({
          checkBoxList: [...prevState.checkBoxList, event.target.id],
        }),
        this.getJobData,
      )
    } else {
      const filterList = checkBoxList.filter(each => each !== event.target.id)
      this.setState({checkBoxList: filterList}, this.getJobData)
    }
  }

  renderCheckBoxView = () => (
    <ul>
      {employmentTypesList.map(each => (
        <li key={each.employmentTypeId}>
          <input
            type="checkbox"
            id={each.employmentTypeId}
            onChange={this.onChangeCheckBox}
          />
          <label htmlFor={each.employmentTypeId}>{each.label}</label>
        </li>
      ))}
    </ul>
  )

  onChangeRadioBtn = event => {
    this.setState({activeRadioinput: event.target.id}, this.getJobData)
  }

  renderRadioInput = () => (
    <ul>
      {salaryRangesList.map(each => (
        <li key={each.salaryRangeId}>
          <input
            type="radio"
            name="option"
            id={each.salaryRangeId}
            onChange={this.onChangeRadioBtn}
          />
          <label htmlFor={each.salaryRangeId}>{each.label}</label>
        </li>
      ))}
    </ul>
  )

  searchbtn = () => {
    this.getJobData()
  }

  onchagnesearch = e => {
    this.setState({searchInput: e.target.value})
  }

  enterkey = e => {
    if (e.key === 'Enter') {
      this.getJobData()
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <div>
        <Header />
        <div>{this.renderProfileData()}</div>
        <h1>Type of Employment</h1>
        {this.renderCheckBoxView()}
        {this.renderJobsData()}
        <h1>Salary Range</h1>
        {this.renderRadioInput()}
        <div>
          <input
            value={searchInput}
            type="search"
            placeholder="Search"
            onChange={this.onchagnesearch}
            onKeyDown={this.enterkey}
          />
          <button
            data-testid="searchButton"
            type="button"
            onClick={this.searchbtn}
            aria-label="btn"
          >
            <AiOutlineSearch />
          </button>
        </div>
      </div>
    )
  }
}
export default AllJobs
