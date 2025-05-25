import React, { useState, useEffect, useRef } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { fetchWithAuth } from '../../../utils/apiUtils'
import './style.scss'

export default function ChartContainer({
  title,
  children,
  id,
  onDeleteComplete,
  onHide
}) {
  const { getAccessTokenSilently } = useAuth0()
  const [menuOpen, setMenuOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const menuRef = useRef(null)

  const handleCollapseToggle = () => {
    setCollapsed((prev) => !prev)
    setMenuOpen(false)
  }

  const handleDelete = async () => {
    setMenuOpen(false)
    try {
      const token = await getAccessTokenSilently()
      const res = await fetchWithAuth({
        path: `/api/dashboards/delete/${id}`,
        method: 'DELETE',
        getToken: getAccessTokenSilently
      })
      if (!res.ok) throw new Error('Failed to delete chart data')
      onDeleteComplete?.(id)
    } catch (err) {
      console.error(err)
      alert('An error occurred while deleting.')
    }
  }

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className='chart-container'>
      <div className='chart-container__header'>
        <h3 className='chart-container__title'>{title}</h3>
        <div className='chart-container__menu-wrapper' ref={menuRef}>
          <button
            aria-label='Toggle menu'
            className='chart-container__menu-button'
            onClick={() => setMenuOpen((open) => !open)}
          >
            &#9776;
          </button>
          {menuOpen && (
            <ul className='chart-container__dropdown'>
              <li
                onClick={handleCollapseToggle}
                className='chart-container__dropdown-item'
              >
                {collapsed ? 'Show' : 'Hide'}
              </li>
              <li
                onClick={handleDelete}
                className='chart-container__dropdown-item'
              >
                Delete
              </li>
            </ul>
          )}
        </div>
      </div>
      {!collapsed && <div>{children}</div>}
    </div>
  )
}
