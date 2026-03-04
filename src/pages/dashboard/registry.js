/**
 * Dashboard Page Registry
 * Registers all dashboard pages with the router.
 * Used by both the main Dashboard and the Interactive Demo.
 */
import { registerPage } from '../../lib/router.js';

// Page imports
import { renderHomePage } from './HomePage.js';
import { renderBookingsPage } from './BookingsPage.js';
import { renderObjectsPage } from './ObjectsPage.js';
import { renderServicesPage } from './ServicesPage.js';
import { renderAddonsPage } from './AddonsPage.js';
import { renderStaffPage } from './StaffPage.js';
import { renderVouchersPage } from './VouchersPage.js';
import { renderCustomersPage } from './CustomersPage.js';
import { renderInsightsPage } from './InsightsPage.js';
import { renderVacationsPage } from './VacationsPage.js';
import { renderEmailTemplatesPage } from './EmailTemplatesPage.js';
import { renderSettingsPage } from './settings/SettingsPage.js';

// Detail Pages
import { renderBookingDetailPage } from './BookingDetailPage.js';
import { renderServiceDetailPage } from './ServiceDetailPage.js';
import { renderObjectDetailPage } from './ObjectDetailPage.js';
import { renderStaffDetailPage } from './StaffDetailPage.js';
import { renderAddonDetailPage } from './AddonDetailPage.js';
import { renderVoucherDetailPage } from './VoucherDetailPage.js';
import { renderCustomerDetailPage } from './CustomerDetailPage.js';

/**
 * Register all dashboard pages
 */
export const registerAllPages = () => {
    // Main Pages
    registerPage('home', renderHomePage);
    registerPage('bookings', renderBookingsPage);
    registerPage('objects', renderObjectsPage);
    registerPage('services', renderServicesPage);
    registerPage('addons', renderAddonsPage);
    registerPage('staff', renderStaffPage);
    registerPage('vouchers', renderVouchersPage);
    registerPage('customers', renderCustomersPage);
    registerPage('insights', renderInsightsPage);
    registerPage('vacations', renderVacationsPage);
    registerPage('email-templates', renderEmailTemplatesPage);
    registerPage('settings', renderSettingsPage);

    // Detail Pages
    registerPage('booking-detail', renderBookingDetailPage);
    registerPage('service-detail', renderServiceDetailPage);
    registerPage('object-detail', renderObjectDetailPage);
    registerPage('staff-detail', renderStaffDetailPage);
    registerPage('addon-detail', renderAddonDetailPage);
    registerPage('voucher-detail', renderVoucherDetailPage);
    registerPage('customer-detail', renderCustomerDetailPage);
};
