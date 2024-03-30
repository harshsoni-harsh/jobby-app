import Cookies from 'js-cookie'
import {Component} from 'react'
import {FaStar, FaLocationDot} from 'react-icons/fa6'
import {BsBriefcaseFill, BsBoxArrowUpRight} from 'react-icons/bs'
import Loader from 'react-loader-spinner'

import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
  initial: 'INITIAL',
}

class JobDetails extends Component {
  state = {jobData: {}, jobFetchStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.fetchJob()
  }

  fetchJob = async () => {
    this.setState({jobFetchStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {id} = match.params
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(`https://apis.ccbp.in/jobs/${id}`, options)
    if (response.ok) {
      const data = await response.json()
      const modifiedData = {
        jobDetails: data.job_details,
        similarJobs: data.similar_jobs,
      }
      const {jobDetails, similarJobs} = modifiedData
      const finalData = {
        jobDetails: {
          companyLogoUrl: jobDetails.company_logo_url,
          companyWebsiteUrl: jobDetails.company_website_url,
          employmentType: jobDetails.employment_type,
          id: jobDetails.id,
          jobDescription: jobDetails.job_description,
          lifeAtCompany: {
            description: jobDetails.life_at_company.description,
            imageUrl: jobDetails.life_at_company.image_url,
          },
          location: jobDetails.location,
          packagePerAnnum: jobDetails.package_per_annum,
          rating: jobDetails.rating,
          skills: jobDetails.skills.map(skill => ({
            name: skill.name,
            imageUrl: skill.image_url,
          })),

          title: jobDetails.title,
        },
        similarJobs: similarJobs.map(job => ({
          companyLogoUrl: job.company_logo_url,
          employmentType: job.employment_type,
          id: job.id,
          jobDescription: job.job_description,
          location: job.location,
          rating: job.rating,
          title: job.title,
        })),
      }
      this.setState({
        jobData: finalData,
        jobFetchStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({jobFetchStatus: apiStatusConstants.failure})
    }
  }

  renderJobDetails = () => {
    const {jobData, jobFetchStatus} = this.state
    const {jobDetails, similarJobs} = jobData
    console.log(jobDetails)
    switch (jobFetchStatus) {
      case apiStatusConstants.success:
        return (
          <div className="job-content">
            <div className="job-details-card">
              <div className="flex align-center gap-2">
                <img
                  className="size-50"
                  src={jobDetails.companyLogoUrl}
                  alt="job details company logo"
                />
                <div>
                  <p className="text-bold m-0 mobile-title">
                    {jobDetails.title}
                  </p>
                  <p className="flex gap-0_5 align-center m-0 mt-10">
                    <FaStar className="star" />
                    {jobDetails.rating}
                  </p>
                </div>
              </div>
              <div className="flex align-center justify-between mt-20">
                <div className="flex gap-2 font-14">
                  <p className="flex align-center gap-0_5 m-0">
                    <FaLocationDot />
                    {jobDetails.location}
                  </p>
                  <p className="flex align-center gap-0_5 m-0">
                    <BsBriefcaseFill />
                    {jobDetails.employmentType}
                  </p>
                </div>
                <p className="m-0">{jobDetails.packagePerAnnum}</p>
              </div>
              <hr />
              <div className="mt-20 flex justify-between align-center">
                <h1 className="font-20 m-0 mobile-description">Description</h1>
                <a
                  href={jobDetails.companyWebsiteUrl}
                  className="visit text-bold font-124"
                >
                  Visit <BsBoxArrowUpRight />
                </a>
              </div>
              <p className="mt-20">{jobDetails.jobDescription}</p>
              <h1 className="font-18 mt-40">Skills</h1>
              <ul className="flex justify-center flex-wrap gap-2">
                {jobDetails.skills.map(skill => (
                  <li
                    className="flex gap-2 align-center text-bold font-14 size-150 mobile-size-skill"
                    key={skill.name}
                  >
                    <img
                      alt={skill.name}
                      src={skill.imageUrl}
                      className="size-40"
                    />
                    <p>{skill.name}</p>
                  </li>
                ))}
              </ul>
              <h1 className="font-18 mt-40">Life at Company</h1>
              <div className="flex gap-2 mobile-flex-col">
                <p>{jobDetails.lifeAtCompany.description}</p>
                <img
                  alt="life at company"
                  src={jobDetails.lifeAtCompany.imageUrl}
                  className="height-fit-content mobile-size-image"
                />
              </div>
            </div>
            <h1 className="font-24 mt-40">Similar Jobs</h1>
            <ul className="flex gap-2 flex-wrap">
              {similarJobs.map(job => (
                <a href={'/jobs/'.concat(job.id)}>
                  <li className="size-300 p-4 bg-gray rounded mobile-size-similar-jobs">
                    <div className="flex align-center gap-2">
                      <img
                        className="size-50"
                        src={job.companyLogoUrl}
                        alt="similar job company logo"
                      />
                      <div>
                        <p className="text-bold m-0">{job.title}</p>
                        <p className="flex gap-0_5 align-center m-0 mt-10">
                          <FaStar className="star" />
                          {job.rating}
                        </p>
                      </div>
                    </div>
                    <p className="font-18 text-bold">Description</p>
                    <p>{job.jobDescription}</p>
                    <div className="flex align-center mt-20">
                      <div className="flex gap-2 font-16">
                        <p className="flex align-center gap-0_5 m-0">
                          <FaLocationDot />
                          {job.location}
                        </p>
                        <p className="flex align-center gap-0_5 m-0">
                          <BsBriefcaseFill />
                          {job.employmentType}
                        </p>
                      </div>
                    </div>
                  </li>
                </a>
              ))}
            </ul>
          </div>
        )
      case apiStatusConstants.failure:
        return (
          <div className="job-failure screen-center">
            <img
              src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
              alt="failure view"
            />
            <h1>Oops! Something Went Wrong</h1>
            <p>We cannot seem to find the page you are looking for.</p>
            <button type="button" onClick={this.fetchJob}>
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
    return (
      <div className="job-container">
        <Header />
        {this.renderJobDetails()}
      </div>
    )
  }
}

export default JobDetails
