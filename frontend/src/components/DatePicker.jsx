import React, { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import "../styles/DatePicker.css";

const DatePicker = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date(2024, 4, 12));
  const [endDate, setEndDate] = useState(new Date(2024, 4, 18));
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 4, 1));
  const [hoverDate, setHoverDate] = useState(null);
  
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Array(new Date(year, month, 1).getDay()).fill(null);
    const numDays = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= numDays; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const isSelected = (date) => {
    if (!date) return false;
    return date.getTime() === startDate.getTime() || date.getTime() === endDate.getTime();
  };

  const isInRange = (date) => {
    if (!date) return false;
    return date > startDate && date < endDate;
  };

  const isHoverRange = (date) => {
    if (!date || !hoverDate || endDate > startDate) return false;
    return (date > startDate && date < hoverDate) || (date < startDate && date > hoverDate);
  };

  const handleDateClick = (date) => {
    if (!date) return;
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else if (date < startDate) {
      setEndDate(startDate);
      setStartDate(date);
    } else {
      setEndDate(date);
    }
  };

  const changeMonth = (offset) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));
  };

  return (
    <div className="date-picker-container" ref={containerRef}>
      <button className="date-picker-trigger" onClick={() => setIsOpen(!isOpen)}>
        <Calendar size={16} />
        <span>{formatDate(startDate)} - {endDate ? formatDate(endDate) : 'Select end date'}</span>
      </button>

      {isOpen && (
        <div className="date-picker-dropdown">
          <div className="calendar-header">
            <button onClick={() => changeMonth(-1)}><ChevronLeft size={18} /></button>
            <span className="current-month">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button onClick={() => changeMonth(1)}><ChevronRight size={18} /></button>
          </div>

          <div className="calendar-grid">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="weekday-label">{day}</div>
            ))}
            {getDaysInMonth(currentMonth).map((date, i) => (
              <div
                key={i}
                className={`calendar-day ${date ? '' : 'empty'} ${isSelected(date) ? 'selected' : ''} ${isInRange(date) ? 'in-range' : ''} ${isHoverRange(date) ? 'hover-range' : ''}`}
                onClick={() => handleDateClick(date)}
                onMouseEnter={() => !endDate && setHoverDate(date)}
              >
                {date ? date.getDate() : ''}
              </div>
            ))}
          </div>

          <div className="date-picker-footer">
            <div className="quick-ranges">
                <button onClick={() => { setStartDate(new Date(Date.now() - 7 * 86400000)); setEndDate(new Date()); }}>Last 7 Days</button>
                <button onClick={() => { setStartDate(new Date(Date.now() - 30 * 86400000)); setEndDate(new Date()); }}>Last 30 Days</button>
            </div>
            <button className="apply-btn" onClick={() => setIsOpen(false)}>Apply</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
