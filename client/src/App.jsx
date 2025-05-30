import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import AboutUs from './pages/AboutUS'
import ViewTransactions from './pages/ViewTransactions'
import ViewBalances from './pages/ViewBalances'
import PrivateRoute from './components/PrivateRoute'
import CreateDashboard from './pages/CreateNewDashboard'
import Modal from './components/Modal'
import { modalRef } from './services/modalService'

// TODO: I need a login route and this is where the user logs in AND must redirect here after x amount time stating that user has been logged out due to inactivity
export default function App() {
  return (
    <>
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
      </Routes>
      <Footer />
      {/* TODO: what kind of footer can I add when the screen is tiny/mobile?
      Most likely will get rid of menu in header and make it a  footer when on mobile
      Home,  Previous Exports, Profile, etc. this will come last when most of the app is polished so I know all available fucntionality*/}
    </>
  )
}
