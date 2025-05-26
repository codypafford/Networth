import React, { useState, useEffect, useRef } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { fetchWithAuth } from '../../../utils/apiUtils'
import ColorPicker from '../../Modal/Modals/ColorPicker'
import { modalRef } from '../../../services/modalService' // The modalref needed to open and close modal
import './style.scss'

export default function ChartContainer({
  title,
  children,
  id,
  onDeleteComplete
}) {
  const { getAccessTokenSilently } = useAuth0()
  const [menuOpen, setMenuOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [strokeColor, setStrokeColor] = useState(false)
  const [colorWheelColor, setColorWheelColor] = useState('#4f46e5')
  const menuRef = useRef(null)

  const handleCollapseToggle = () => {
    setCollapsed((prev) => !prev)
    setMenuOpen(false)
  }

  const handleDelete = async () => {
    setMenuOpen(false)
    try {
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
  // TODO: start doimg proptypes
  const latestColorRef = useRef(colorWheelColor)
  const handleColorChange = () => {
    modalRef.current.open({
      header: 'Change Chart Color',
      subtitle: 'This will apply a new color to your chart.',
      body: (
        <ColorPicker
          initialColor={colorWheelColor}
          onColorChange={(selectedColor) => {
            latestColorRef.current = selectedColor
          }}
        />
      ),
      primaryButton: {
        enabled: true,
        text: 'Yes, Change It',
        onClick: () => {
          setColorWheelColor(latestColorRef.current) // Save for next modal open
          setStrokeColor(latestColorRef.current) // Trigger re-render
          modalRef.current.close()
        }
      }
    })
  }

  const childWithProps = React.cloneElement(children, { strokeColor })

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
              <li
                onClick={handleColorChange}
                className='chart-container__dropdown-item'
              >
                Change Color
              </li>
              <li
                // onClick={handleDateRangeChange}
                className='chart-container__dropdown-item'
              >
                Date Range
              </li>
              {/* TODO: these options will open modals to then fine tune the graph
              The modal will be a single component where all we do is pass in props to show what we need */}
              <li
                // onClick={handleAggregateBy}
                className='chart-container__dropdown-item'
              >
                Aggregate By (Month, year...for bar charts only)
              </li>
            </ul>
          )}
        </div>
      </div>
      {!collapsed && <div>{childWithProps}</div>}
    </div>
  )
}
