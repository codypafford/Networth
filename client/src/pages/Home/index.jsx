import { useAuth0 } from '@auth0/auth0-react'
import { Navigate } from 'react-router-dom'
import './style.scss'

export default function Home() {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0()

  if (isLoading) return <p>Loading...</p>
  if (isAuthenticated) return <Navigate to='/dashboard' />

  return (
    <main className='home'>
      <section className='home__hero'>
        <div className='home__hero-content'>
          <h1 className='home__title'>NetWorth Tracker</h1>
          <p className='home__subtitle'>
            Take control of your financial future.
          </p>
          <a
            onClick={(e) => {
              e.preventDefault()
              loginWithRedirect()
            }}
            className='home__cta-button'
          >
            Get Started
          </a>
        </div>
        <div className='home__hero-image'>
          <img src='/images/dashboard.PNG' alt='Dashboard Preview' />
        </div>
      </section>

      <section className='home__features'>
        <h2 className='home__features-title'>Why NetWorth Tracker?</h2>
        <div className='home__feature-list'>
          <div className='home__feature'>
            <h3>User Friendly</h3>
            <p>
              Track all your finances in one place with an intuitive interface.
              Create custom dashboards to monitor specific goals or effortlessly
              view your net worth by aggregating all accounts and visualizing
              your balance trends over time.
            </p>
          </div>
        </div>
      </section>

      <section className='home__gallery'>
        <h2 className='home__gallery-title'>See It In Action</h2>
        <div className='home__gallery-grid'>
          <img src='/images/createDashboard.PNG' alt='Screenshot 1' />
          <img src='/images/createDashboard2.PNG' alt='Screenshot 2' />
          <img src='/images/createDashboard3.PNG' alt='Screenshot 3' />
        </div>
      </section>

      <footer className='home__footer'>
        <p>
          © {new Date().getFullYear()} NetWorth Tracker. All rights reserved.
        </p>
        <a
          href='https://www.flaticon.com/free-icons/locker'
          title='locker icons'
        >
          Locker icons created by Uut Eva Ariani - Flaticon
        </a>
      </footer>
    </main>
  )
}
