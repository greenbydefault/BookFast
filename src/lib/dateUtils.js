/**
 * Date formatting utilities for BookFast
 */

/**
 * Format a date string to German locale (DD.MM.YYYY)
 * @param {string|Date} dateStr - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

/**
 * Format a date range (start - end) in German locale
 * For same-day bookings (hourly), shows time as well
 * @param {string|Date} start - Start date
 * @param {string|Date} end - End date
 * @returns {string} Formatted date range
 */
export const formatDateRange = (start, end) => {
    if (!start) return '-';
    
    const startD = new Date(start);
    const endD = end ? new Date(end) : null;
    
    const startDate = formatDate(start);
    const endDate = end ? formatDate(end) : null;
    
    // Same day = hourly booking → show times
    if (startDate === endDate) {
        const startTime = formatTime(start);
        const endTime = end ? formatTime(end) : null;
        
        if (endTime && startTime !== endTime) {
            return `${startDate}, ${startTime} – ${endTime}`;
        }
        return `${startDate}, ${startTime}`;
    }
    
    // Multi-day = daily/overnight → only dates
    if (!endDate) return startDate;
    return `${startDate} – ${endDate}`;
};

/**
 * Format time to HH:MM
 * @param {string|Date} dateStr - Date/time to format
 * @returns {string} Formatted time string
 */
export const formatTime = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Format datetime to German locale
 * @param {string|Date} dateStr - Date/time to format
 * @returns {string} Formatted datetime string
 */
export const formatDateTime = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};
