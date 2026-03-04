export const STEPS = {
    SEARCH_CUSTOMER: 1,
    SELECT_OBJECT: 2,
    SELECT_SERVICE: 3,
    SELECT_DATE: 4,
    SELECT_ADDONS: 5,
    SUMMARY: 6,
};

export const initialModalState = () => ({
    step: STEPS.SEARCH_CUSTOMER,
    customer: null,
    object: null,
    service: null,
    staff: null,
    startDate: null,
    endDate: null,
    time: null,
    slots: [],
    addons: [],
    guestCount: 1,
    availabilityStatus: null,
    calendarMonth: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    calendarData: { blocked_dates: [], bookings: [] },
    calendarLoading: false,
    selectingEndDate: false,
    data: { objects: [], services: [], addons: [], staff: [], customers: [] },
    loading: false,
    _searchDropdown: null,
});

export const getStepTitle = (step) => {
    switch (step) {
        case STEPS.SEARCH_CUSTOMER: return 'Kunde auswaehlen';
        case STEPS.SELECT_OBJECT: return 'Objekt waehlen';
        case STEPS.SELECT_SERVICE: return 'Service waehlen';
        case STEPS.SELECT_DATE: return 'Termin waehlen';
        case STEPS.SELECT_ADDONS: return 'Extras und Optionen';
        case STEPS.SUMMARY: return 'Zusammenfassung und Bestaetigung';
        default: return 'Neue Buchung';
    }
};
