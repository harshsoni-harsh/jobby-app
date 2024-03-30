import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import JobCard from '../JobCard'

import './index.css'

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

const apiStatusConstants = {
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
  initial: 'INITIAL',
}

class Jobs extends Component {
  state = {
    profileDetails: {},
    employmentType: [],
    minPackage: 0,
    search: '',
    jobs: [],
    profileFetchStatus: apiStatusConstants.initial,
    jobFetchStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.fetchProfile()
    this.fetchJobs()
  }

  fetchProfile = async () => {
    this.setState({profileFetchStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch('https://apis.ccbp.in/profile', options)
    if (response.ok) {
      let data = await response.json()
      data = data.profile_details
      const profileDetails = {
        profileImageUrl: data.profile_image_url,
        name: data.name,
        shortBio: data.short_bio,
      }
      this.setState({
        profileDetails,
        profileFetchStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({profileFetchStatus: apiStatusConstants.failure})
    }
  }

  fetchJobs = async () => {
    this.setState({jobFetchStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const {employmentType, minPackage, search} = this.state

    const response = await fetch(
      `https://apis.ccbp.in/jobs?employment_type=${employmentType.join(
        ',',
      )}&minimum_package=${minPackage}&search=${search}`,
      options,
    )
    if (response.ok) {
      let data = await response.json()
      data = data.jobs
      const modifiedData = data.map(job => ({
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        jobDescription: job.job_description,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
        title: job.title,
        id: job.id,
      }))
      this.setState({
        jobs: modifiedData,
        jobFetchStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({jobFetchStatus: apiStatusConstants.failure})
    }
  }

  changeSalary = e => {
    this.setState({minPackage: e.target.id}, this.fetchJobs)
  }

  addEmploymentType = e => {
    let {employmentType} = this.state
    if (e.target.checked) {
      employmentType.push(e.target.id)
    } else {
      employmentType = employmentType.filter(type => type !== e.target.id)
    }
    this.setState({employmentType}, this.fetchJobs)
  }

  changeSearchInput = e => {
    this.setState({search: e.target.value}, this.fetchJobs)
  }

  profileSection = () => {
    const {profileDetails, profileFetchStatus} = this.state
    const {profileImageUrl, name, shortBio} = profileDetails
    switch (profileFetchStatus) {
      case apiStatusConstants.success:
        return (
          <div className="profile">
            <img src={profileImageUrl} alt="profile" />
            <h1>{name}</h1>
            <p>{shortBio}</p>
          </div>
        )
      case apiStatusConstants.failure:
        return (
          <div>
            <button type="button" onClick={() => this.fetchProfile()}>
              Retry
            </button>
          </div>
        )
      case apiStatusConstants.inProgress:
        return (
          <div className="loader-container screen-center" data-testid="loader">
            <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
          </div>
        )
      default:
        return null
    }
  }

  jobSection = () => {
    const {jobs, jobFetchStatus} = this.state
    switch (jobFetchStatus) {
      case apiStatusConstants.success:
        return (
          <ul className="jobs">
            {jobs.length === 0 ? (
              <div className="noJobs">
                <img
                  src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
                  alt="no jobs"
                />
                <h1>No Jobs Found</h1>
                <p>We could not find any jobs. Try other filters.</p>
              </div>
            ) : (
              jobs.map(job => <JobCard jobDetails={job} />)
            )}
          </ul>
        )
      case apiStatusConstants.failure:
        return (
          <div className="noJobs">
            <img
              src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
              alt="failure view"
            />
            <h1>Oops! Something Went Wrong</h1>
            <p>We cannot seem to find the page you are looking for.</p>
            <button type="button" onClick={() => this.Jobs()}>
              Retry
            </button>
          </div>
        )
      case apiStatusConstants.inProgress:
        return (
          <div className="loader-container screen-center" data-testid="loader">
            <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
          </div>
        )
      default:
        return null
    }
  }

  render() {
    const {search} = this.state

    return (
      <div className="jobs-container">
        <Header />
        <div className="jobs-content">
          <div className="searchBox-mobile">
            <input
              value={search}
              onChange={this.changeSearchInput}
              type="search"
              placeholder="Search"
              id="search"
            />
            <label htmlFor="search">
              <button type="button" data-testid="searchButton">
                {' '}
                <BsSearch className="search-icon" />{' '}
              </button>
            </label>
          </div>
          <div className="sidepane">
            {this.profileSection()}
            <hr />
            <div>
              <h1 className="filter-heading">Type of Employment</h1>
              <ul>
                {employmentTypesList.map(type => (
                  <li className="filter" key={type.employmentTypeId}>
                    <input
                      type="checkbox"
                      onChange={this.addEmploymentType}
                      id={type.employmentTypeId}
                    />
                    <label htmlFor={type.employmentTypeId}>{type.label}</label>
                  </li>
                ))}
              </ul>
            </div>
            <hr />
            <div>
              <h1 className="filter-heading">Salary Range</h1>
              <ul>
                {salaryRangesList.map(type => (
                  <li className="filter" key={type.salaryRangeId}>
                    <input
                      type="radio"
                      onChange={this.changeSalary}
                      name="salary"
                      id={type.salaryRangeId}
                    />
                    <label htmlFor={type.salaryRangeId}>{type.label}</label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex-grow-1">
            <div className="searchBox">
              <input
                value={search}
                onChange={this.changeSearchInput}
                type="search"
                placeholder="Search"
                id="searchBtn"
              />
              <label htmlFor="searchBtn">
                <button type="button" data-testid="searchButton">
                  {' '}
                  <BsSearch className="search-icon" />{' '}
                </button>
              </label>
            </div>
            {this.jobSection()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
