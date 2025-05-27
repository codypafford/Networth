import React, { useState, useEffect } from 'react';
import './style.scss';

export default function DateRangePicker({ startDate: initialStartDate, endDate: initialEndDate, onDateChange }) {
  const [startDate, setStartDate] = useState(initialStartDate || '');
  const [endDate, setEndDate] = useState(initialEndDate || '');

  // TODO: going to need some validation here to choose correct date ranges
  useEffect(() => {
    setStartDate(initialStartDate || '');
  }, [initialStartDate]);

  useEffect(() => {
    setEndDate(initialEndDate || '');
  }, [initialEndDate]);

  const handleStartDateChange = (value) => {
    setStartDate(value);
    if (onDateChange) onDateChange({ startDate: value, endDate });
  };

  const handleEndDateChange = (value) => {
    setEndDate(value);
    if (onDateChange) onDateChange({ startDate, endDate: value });
  };

  return (
    <div className="date-range-picker">
      <label className="date-range-picker__label">Date Range</label>
      <div className="date-range-picker__inputs">
        <input
          type="date"
          className="date-range-picker__input"
          value={startDate}
          onChange={(e) => handleStartDateChange(e.target.value)}
          aria-label="Start Date"
        />
        <span className="date-range-picker__separator">to</span>
        <input
          type="date"
          className="date-range-picker__input"
          value={endDate}
          onChange={(e) => handleEndDateChange(e.target.value)}
          aria-label="End Date"
        />
      </div>
    </div>
  );
}
