import React, { useState, useEffect, useRef } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { fetchWithAuth } from '../../../utils/apiUtils'
import ColorPicker from '../../Modal/Modals/ColorPicker'
import DateRangePicker from '../../Modal/Modals/DatePicker'
import { modalRef } from '../../../services/modalService' // The modalref needed to open and close modal
import PropTypes from 'prop-types'
import { TrackingTypes, ChartTypes } from '../../../constants'
import { FaPencilAlt } from 'react-icons/fa' // pencil icon
import { getSummaryHtml } from './utils'
import './style.scss'

export default function ChartContainer({
  dashboard,
  data,
  summaryContent,
  onDeleteComplete,
  children,
  chartType,
}) {
  const { getAccessTokenSilently } = useAuth0()
  const [menuOpen, setMenuOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [summary, setSummary] = useState(false)

  // TODO: defaults for this section come from DB
  const [graphColor, setGraphColor] = useState('#4f46e5')
  const [graphRange, setGraphRange] = useState({ startDate: '', endDate: '' })

  const id = dashboard._id
  const chart = dashboard.chart
  const trackType = chart.trackingType
  const title = dashboard.name

  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editableTitle, setEditableTitle] = useState(title)

  useEffect(() => {
    const summary = getSummaryHtml(summaryContent)
    setSummary(summary)
  }, [])

  const handleSaveTitle = async () => {
    setIsEditingTitle(false)
    try {
      //   await fetchWithAuth({
      //     path: '/api/dashboards/update-title',
      //     method: 'POST',
      //     body: JSON.stringify({ newTitle: editableTitle }),
      //     getToken: getAccessTokenSilently
      //   })
      // TODO: trigger a refresh
      setEditableTitle(editableTitle)
    } catch (err) {
      console.error('Error saving title:', err)
    }
  }

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
            // update latest color value
            latestColorRef.current = selectedColor
            // change the graph color as you pick new colors
            setGraphColor(selectedColor)
          }}
        />
      ),
      primaryButton: {
        enabled: true,
        text: 'OK',
        onClick: () => {
          // TODO: async call to save color
          setGraphColor(latestColorRef.current) // Trigger re-render with the new latest color
          modalRef.current.setText({ success: true, text: 'Changes Applied' })
        }
      }
    })
  }

//   const latestDateRangeRef = useRef(graphRange)
//   const handleDateRangeChange = () => {
//     modalRef.current.open({
//       header: 'Change Date Range',
//       body: (
//         <DateRangePicker
//           startDate={latestDateRangeRef.startDate}
//           endDate={latestDateRangeRef.endDate}
//           onDateChange={(selectedDateRange) => {
//             latestDateRangeRef.current = selectedDateRange
//           }}
//         />
//       ),
//       primaryButton: {
//         enabled: true,
//         text: 'OK',
//         onClick: () => {
//           // TODO: async call to save date range
//           setGraphRange(latestDateRangeRef.current) // Trigger re-render
//           modalRef.current.setText({ success: true, text: 'Changes Applied' })
//         }
//       }
//     })
//   }

  const isLineGraph = () => {
    return chart.chartType === ChartTypes.line
  }

  const isBarGraph = () => {
    return chart.chartType === ChartTypes.bar
  }

  const isEditing = () => {
    return isEditingTitle
  }

  console.log('pass this data to child: ', data)
  // The children graphs will recieve these props
  const childWithProps = React.cloneElement(children, {
    graphColor,
    dateRange: graphRange,
    data
  })

  return (
    <div className='chart-container'>
      <div className='chart-container__header'>
        <div className='chart-container__title-wrapper'>
          {isEditingTitle ? (
            <>
              <input
                className='chart-container__title-input'
                value={editableTitle}
                onChange={(e) => setEditableTitle(e.target.value)}
                autoFocus
              />
              <button
                className='chart-container__save-button'
                onClick={handleSaveTitle}
              >
                Save
              </button>
            </>
          ) : (
            <h3 className='chart-container__title'>
              <span>{editableTitle}</span>{' '}
              <FaPencilAlt
                className='chart-container__edit-icon'
                onClick={() => setIsEditingTitle(true)}
              />
              <div>{TrackingTypes[trackType].friendlyText}</div>
            </h3>
          )}
        </div>

        {!isEditing() && (
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
                  onClick={handleColorChange}
                  className='chart-container__dropdown-item'
                >
                  Change Color
                </li>
                {/* <li
                  onClick={handleDateRangeChange}
                  className='chart-container__dropdown-item'
                >
                  Date Range
                </li> */}
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
                <li className='chart-container__dropdown-item'>
                  Export Report
                </li>
                {/* This will allow additional exclusions to the currently enabled accounts */}
                <li className='chart-container__dropdown-item'>
                  Exclude Accounts
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
        )}
      </div>
      {!collapsed && (
        <div className='chart-container__content-wrapper'>
          <div className='chart-container__chart'>{childWithProps}</div>
          {summary && (
            <div className='chart-container__summary'>{summary}</div>
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
