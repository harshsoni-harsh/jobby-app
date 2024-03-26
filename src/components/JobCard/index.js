import {FaStar, FaLocationDot} from 'react-icons/fa6'
import {BsBriefcaseFill} from 'react-icons/bs'

import './index.css'
import {Link} from 'react-router-dom'

const JobCard = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
    id,
  } = jobDetails
  return (
    <Link to={'/jobs/'.concat(id)}>
      <li className="job-card p-4">
        <div className="flex align-center gap-2">
          <img className="size-70" src={companyLogoUrl} alt="company logo" />
          <div>
            <h1 className="font-24 m-0">{title}</h1>
            <p className="font-20 flex gap-0_5 align-center m-0 mt-10">
              <FaStar className="star" />
              {rating}
            </p>
          </div>
        </div>
        <div className="flex align-center justify-between mt-20">
          <div className="flex gap-2">
            <p className="flex align-center gap-0_5 m-0">
              <FaLocationDot />
              {location}
            </p>
            <p className="flex align-center gap-0_5 m-0">
              <BsBriefcaseFill />
              {employmentType}
            </p>
          </div>
          <p className="m-0">{packagePerAnnum}</p>
        </div>
        <hr />
        <p className="text-bold">Description</p>
        <p>{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobCard
