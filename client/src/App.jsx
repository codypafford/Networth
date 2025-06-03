import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import AboutUs from './pages/AboutUS'
import ViewTransactions from './pages/ViewTransactions'
import ViewDashboard from './pages/ViewDashboard'
import ViewBalances from './pages/ViewBalances'
import EditProjections from './pages/EditProjections'
import PrivateRoute from './components/PrivateRoute'
import CreateDashboard from './pages/CreateNewDashboard'
import Modal from './components/Modal'
import { modalRef } from './services/modalService'
import PasswordGate from './components/SimplePasswordGate'

// TODO: I need a login route and this is where the user logs in AND must redirect here after x amount time stating that user has been logged out due to inactivity
export default function App() {
  return (
    <>
      <PasswordGate>
        <Header />
        <Modal ref={modalRef} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route
            path='/dashboard'
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path='/create-dashboard'
            element={
              <PrivateRoute>
                <CreateDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path='/about-us'
            element={
              <PrivateRoute>
                <AboutUs />
              </PrivateRoute>
            }
          />
          <Route
            path='/view-transactions'
            element={
              <PrivateRoute>
                <ViewTransactions />
              </PrivateRoute>
            }
          />
          <Route
            path='/view-balances'
            element={
              <PrivateRoute>
                <ViewBalances />
              </PrivateRoute>
            }
          />
          <Route
            path='/dashboard/view-dashboard/:id'
            element={
              <PrivateRoute>
                <ViewDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path='/dashboard/edit-projections/:id'
            element={
              <PrivateRoute>
                <EditProjections />
              </PrivateRoute>
            }
          />
        </Routes>
        <Footer />
      </PasswordGate>
      {/* TODO: what kind of footer can I add when the screen is tiny/mobile?
      Most likely will get rid of menu in header and make it a  footer when on mobile
      Home,  Previous Exports, Profile, etc. this will come last when most of the app is polished so I know all available fucntionality*/}
    </>
  )
}
