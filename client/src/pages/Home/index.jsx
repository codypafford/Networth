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

      <section className='home__security'>
        <h2 className='home__security-title'>Bank Security and Your Privacy</h2>
        <p>
          At <strong>NetWorth Tracker</strong>, your security and privacy are
          our top priorities. We use <strong>Plaid</strong>, a trusted industry
          leader in financial data connections, to securely link your bank
          accounts and financial information.
        </p>
        <h3>How Plaid protects you:</h3>
        <ul className='home__security-list'>
          <li>
            <strong>Bank-Grade Security:</strong> Plaid uses advanced encryption
            and security protocols, the same standards used by major banks, to
            keep your data safe in transit and at rest.
          </li>
          <li>
            <strong>Read-Only Access:</strong> Plaid only accesses your data to
            provide the information you authorize. It never initiates
            transactions or changes your account.
          </li>
          <li>
            <strong>No Password Storage:</strong> You never share your bank
            login details with us directly — Plaid handles that securely.
          </li>
          <li>
            <strong>Continuous Monitoring:</strong> Plaid monitors its systems
            24/7 for suspicious activity and employs strict security controls.
          </li>
          <li>
            <strong>Privacy Compliance:</strong> Plaid complies with all
            relevant data privacy regulations to ensure your data is handled
            responsibly.
          </li>
        </ul>
        <p>
          We do not store your bank credentials or share your financial data
          with any third parties other than Plaid’s secure services.
        </p>
        <p>
          By partnering with Plaid, we deliver a seamless, secure, and private
          experience, so you can track your net worth with confidence.
        </p>
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
