import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import PrivateRoute from './components/PrivateRoute'
import CreateDashboard from './pages/CreateNewDashboard'
import Modal from './components/Modal'
import { modalRef } from './services/modalService'

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
      </Routes>
    </>
  )
}
