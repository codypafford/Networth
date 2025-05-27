import React, { useState, useEffect, useRef } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { fetchWithAuth } from '../../../utils/apiUtils'
import ColorPicker from '../../Modal/Modals/ColorPicker'
import DateRangePicker from '../../Modal/Modals/DatePicker'
import { modalRef } from '../../../services/modalService' // The modalref needed to open and close modal
import PropTypes from 'prop-types'
import { TrackingTypes, ChartTypes } from '../../../constants'
import './style.scss'

export default function ChartContainer({
  dashboard,
  onDeleteComplete,
  summaryContent,
  children
}) {
  const { getAccessTokenSilently } = useAuth0()
  const [menuOpen, setMenuOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [graphColor, setGraphColor] = useState('#4f46e5')
  // Manage the graph date range bc they have different states
  const [graphRange, setGraphRange] = useState({ startDate: '', endDate: '' })
  // Manage the modal date range
  const [datePickerDateRange, setDatePickerDateRange] = useState({
    startDate: '',
    endDate: ''
  })

  const id = dashboard._id;
  const chart = dashboard.chart;
  const trackType = chart.trackingType;
  const title = dashboard.name;

  const menuRef = useRef(null)

  const handleCollapseToggle = () => {
    setCollapsed((prev) => !prev)
    setMenuOpen(false)
  }

  const handleDelete = async () => {
    modalRef.current.open({
      header: 'Are you sure you want to delete this dashboard?',
      subtitle: 'This action cannot be undone',
      primaryButton: {
        enabled: true,
        text: 'OK',
        onClick: async () => {
          try {
            const res = await fetchWithAuth({
              path: `/api/dashboards/delete/${id}`,
              method: 'DELETE',
              getToken: getAccessTokenSilently
            })
            if (!res.ok) throw new Error('Failed to delete chart data')
            onDeleteComplete?.(id)
            modalRef.current.close()
          } catch (err) {
            console.error(err)
            modalRef.current.setText({
              error: true,
              text: 'An error occurred while deleting.'
            })
          }
        }
      }
    })
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

  const latestColorRef = useRef(graphColor)
  const handleColorChange = () => {
    modalRef.current.open({
      header: 'Change Chart Color',
      subtitle: 'This will apply a new color to your chart.',
      body: (
        <ColorPicker
          initialColor={latestColorRef.current}
          onColorChange={(selectedColor) => {
            latestColorRef.current = selectedColor
          }}
        />
      ),
      primaryButton: {
        enabled: true,
        text: 'OK',
        onClick: () => {
          setGraphColor(latestColorRef.current) // Trigger re-render
          // TODO: async call to save color
          modalRef.current.setText({ success: true, text: 'Changes Applied' })
        }
      }
    })
  }

  const latestDateRangeRef = useRef(datePickerDateRange)
  const handleDateRangeChange = () => {
    modalRef.current.open({
      header: 'Change Date Range',
      body: (
        <DateRangePicker
          startDate={datePickerDateRange.startDate}
          endDate={datePickerDateRange.endDate}
          onDateChange={(selectedDateRange) => {
            latestDateRangeRef.current = selectedDateRange
          }}
        />
      ),
      primaryButton: {
        enabled: true,
        text: 'OK',
        onClick: () => {
          setDatePickerDateRange(latestDateRangeRef.current) // Save for next modal open
          setGraphRange(latestDateRangeRef.current) // Trigger re-render
          modalRef.current.setText({ success: true, text: 'Changes Applied' })
        }
      }
    })
  }

  const isLineGraph = () => {
    return chart.chartType === ChartTypes.line
  }

  const isBarGraph = () => {
    return chart.chartType === ChartTypes.bar
  }

  // The children graphs will recieve these props
  const childWithProps = React.cloneElement(children, {
    graphColor,
    dateRange: graphRange
  })

  return (
    <div className='chart-container'>
      <div className='chart-container__header'>
        <h3 className='chart-container__title'>
          {title} - {TrackingTypes[trackType].friendlyText}
        </h3>
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
                onClick={handleDateRangeChange}
                className='chart-container__dropdown-item'
              >
                Date Range
              </li>
              {/* TODO: these options will open modals to then fine tune the graph
              The modal will be a single component where all we do is pass in props to show what we need */}
              {!isLineGraph() && (
                <li
                  // onClick={handleAggregateBy}
                  className='chart-container__dropdown-item'
                >
                  {/* (Month, year...for bar charts only) */}
                  Group By
                </li>
              )}
              {/* This will allow additional exclusions to the currently enabled accounts */}
              <li className='chart-container__dropdown-item'>
                Exclude Accounts
              </li>
            </ul>
          )}
        </div>
      </div>
      {!collapsed && (
        <div className='chart-container__content-wrapper'>
          <div className='chart-container__chart'>{childWithProps}</div>
          {summaryContent && (
            <div className='chart-container__summary'>{summaryContent}</div>
          )}
        </div>
      )}
    </div>
  )
}

ChartContainer.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  id: PropTypes.string.isRequired,
  onDeleteComplete: PropTypes.func.isRequired
}
