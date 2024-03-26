import './index.css'
import Header from '../Header'

const Home = props => {
  const {history} = props
  const findJobs = () => {
    history.push('/jobs')
  }
  return (
    <div className="home-container">
      <Header />
      <div className="home-content">
        <h1 className="heading">Find The Job That Fits Your Life</h1>
        <p>
          Millions of people are searching for jobs, salary information, company
          reviews, Find the job that fits your abilities and potential.
        </p>
        <button type="button" onClick={findJobs}>
          Find Jobs
        </button>
      </div>
    </div>
  )
}

export default Home
