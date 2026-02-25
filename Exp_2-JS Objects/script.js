// Sample patient data
let patients = [
    {
        id: 1,
        name: "Dianne Russell",
        room: "BC5001",
        concern: "Upper Abdomen General",
        inCharge: "Kristin",
        status: "Report Pending",
        admitted: "2024-12-27"
    },
    {
        id: 2,
        name: "Bessie Cooper",
        room: "DMK502",
        concern: "Gynecologic Disorders",
        inCharge: "Kristin",
        status: "Life Support",
        admitted: "2023-02-03"
    },
    {
        id: 3,
        name: "Marvin McKinney",
        room: "DMK502",
        concern: "Brain, Spinal Cord, and Nerve Disorders",
        inCharge: "Colleen",
        status: "ICU",
        admitted: "2023-03-02"
    },
    {
        id: 4,
        name: "Esther Howard",
        room: "DMK502",
        concern: "Digestive Disorders",
        inCharge: "Colleen",
        status: "Discharged",
        admitted: "2023-03-02"
    },
    {
        id: 5,
        name: "Marvin McKinney",
        room: "BC1022",
        concern: "Upper Abdomen General",
        inCharge: "Kristin",
        status: "Report Pending",
        admitted: "2023-03-02"
    },
    {
        id: 6,
        name: "Annette Black",
        room: "BC1022",
        concern: "Digestive Disorders",
        inCharge: "Colleen",
        status: "Report Pending",
        admitted: "2023-03-02"
    },
    {
        id: 7,
        name: "Cameron Williamson",
        room: "BC1022",
        concern: "Liver and Gallbladder Disorders",
        inCharge: "Kristin",
        status: "Report Pending",
        admitted: "2023-03-02"
    },
    {
        id: 8,
        name: "Guy Hawkins",
        room: "BC1022",
        concern: "Medical Care During Pregnancy",
        inCharge: "Alex",
        status: "Life Support",
        admitted: "2023-03-02"
    }
];

// Appointments data
let appointments = [
    {
        id: 1,
        patientName: "John Smith",
        date: "2026-02-05",
        time: "09:00 AM",
        type: "Consultation",
        status: "Scheduled"
    },
    {
        id: 2,
        patientName: "Sarah Johnson",
        date: "2026-02-05",
        time: "11:30 AM",
        type: "Follow-up",
        status: "Scheduled"
    },
    {
        id: 3,
        patientName: "Michael Brown",
        date: "2026-02-05",
        time: "02:00 PM",
        type: "Emergency",
        status: "Urgent"
    }
];

// Current page state
let currentPage = 'patients';
let currentTab = 'hospitalized';
let currentPatientPage = 1;
let patientsPerPage = 10;
let editingPatientId = null;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupNavigationListeners();
    setupSearchListener();
    renderPage(currentPage);
}

// Navigation
function setupNavigationListeners() {
    const navItems = document.querySelectorAll('.nav-item[data-page]');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            navigateToPage(page);
        });
    });
}

function navigateToPage(page) {
    // Update active state
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-page="${page}"]`).classList.add('active');
    
    currentPage = page;
    renderPage(page);
}

// Render different pages
function renderPage(page) {
    const pageContent = document.getElementById('pageContent');
    
    switch(page) {
        case 'overview':
            renderOverviewPage(pageContent);
            break;
        case 'appointments':
            renderAppointmentsPage(pageContent);
            break;
        case 'patients':
            renderPatientsPage(pageContent);
            break;
        case 'schedule':
            renderSchedulePage(pageContent);
            break;
        case 'reports':
            renderReportsPage(pageContent);
            break;
        case 'messages':
            renderMessagesPage(pageContent);
            break;
        case 'medications':
            renderMedicationsPage(pageContent);
            break;
        default:
            renderPatientsPage(pageContent);
    }
}

// Overview Page
function renderOverviewPage(container) {
    const totalPatients = patients.length;
    const icu = patients.filter(p => p.status === 'ICU').length;
    const discharged = patients.filter(p => p.status === 'Discharged').length;
    const pending = patients.filter(p => p.status === 'Report Pending').length;

    container.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <h3>Total Patients</h3>
                <div class="value">${totalPatients}</div>
                <div class="trend">↑ 12% from last month</div>
            </div>
            <div class="stat-card">
                <h3>ICU Patients</h3>
                <div class="value">${icu}</div>
                <div class="trend">↓ 5% from last week</div>
            </div>
            <div class="stat-card">
                <h3>Discharged Today</h3>
                <div class="value">${discharged}</div>
                <div class="trend">↑ 8% from yesterday</div>
            </div>
            <div class="stat-card">
                <h3>Reports Pending</h3>
                <div class="value">${pending}</div>
                <div class="trend down">↑ 15% from last week</div>
            </div>
        </div>

        <div class="patients-table-container">
            <div class="table-header">
                <h2 class="table-title">Recent Admissions</h2>
            </div>
            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Patient</th>
                            <th>Room</th>
                            <th>Area of Concern</th>
                            <th>Status</th>
                            <th>Admitted</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${patients.slice(0, 5).map(patient => `
                            <tr>
                                <td>${patient.name}</td>
                                <td>${patient.room}</td>
                                <td>${patient.concern}</td>
                                <td>${renderStatusBadge(patient.status)}</td>
                                <td>${formatDate(patient.admitted)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// Appointments Page
function renderAppointmentsPage(container) {
    container.innerHTML = `
        <div class="patients-header">
            <h2 class="table-title">Today's Appointments</h2>
            <button class="btn-primary" onclick="alert('Add Appointment functionality')">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 4v12M4 10h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                Add Appointment
            </button>
        </div>

        <div class="appointments-grid">
            ${appointments.length > 0 ? appointments.map(apt => `
                <div class="appointment-card">
                    <div class="appointment-info">
                        <h3>${apt.patientName}</h3>
                        <p>${apt.type}</p>
                        <p>Status: ${apt.status}</p>
                    </div>
                    <div class="appointment-time">
                        ${apt.time}
                    </div>
                </div>
            `).join('') : `
                <div class="empty-state">
                    <svg viewBox="0 0 100 100" fill="currentColor">
                        <rect x="20" y="30" width="60" height="50" rx="5" stroke="currentColor" fill="none" stroke-width="2"/>
                        <path d="M35 25v10M65 25v10" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    <h3>No appointments today</h3>
                    <p>Your schedule is clear</p>
                </div>
            `}
        </div>
    `;
}

// Patients Page
function renderPatientsPage(container) {
    container.innerHTML = `
        <div class="patients-header">
            <div class="tabs">
                <button class="tab ${currentTab === 'overview' ? 'active' : ''}" onclick="changeTab('overview')">Overview</button>
                <button class="tab ${currentTab === 'hospitalized' ? 'active' : ''}" onclick="changeTab('hospitalized')">Hospitalized</button>
                <button class="tab ${currentTab === 'outpatients' ? 'active' : ''}" onclick="changeTab('outpatients')">Outpatients</button>
            </div>
            <div class="header-actions">
                <button class="btn-primary" onclick="openAddPatientModal()">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 4v12M4 10h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    Add Patient
                </button>
                <button class="filter-btn">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M3 4h14M6 8h8M8 12h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    Filter
                </button>
            </div>
        </div>

        <div class="patients-table-container">
            <div class="table-header">
                <h2 class="table-title">
                    Patients List
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M4 10l2 2 4-6" stroke="currentColor" fill="none" stroke-width="2"/>
                    </svg>
                </h2>
                <div class="status-legend">
                    <div class="legend-item">
                        <span class="legend-dot discharged"></span>
                        Discharged
                    </div>
                    <div class="legend-item">
                        <span class="legend-dot report-pending"></span>
                        Report Pending
                    </div>
                    <div class="legend-item">
                        <span class="legend-dot icu"></span>
                        ICU
                    </div>
                    <div class="legend-item">
                        <span class="legend-dot in-recovery"></span>
                        In Recovery
                    </div>
                    <div class="legend-item">
                        <span class="legend-dot life-support"></span>
                        Life Support
                    </div>
                </div>
            </div>
            <div class="table-wrapper">
                ${renderPatientsTable()}
            </div>
            ${renderPagination()}
        </div>
    `;
}

// Schedule Page
function renderSchedulePage(container) {
    const today = new Date();
    const month = today.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    container.innerHTML = `
        <div class="calendar-wrapper">
            <div class="calendar-header">
                <h2 class="calendar-title">${month}</h2>
                <div class="header-actions">
                    <button class="btn-secondary" onclick="alert('Previous month')">←</button>
                    <button class="btn-secondary" onclick="alert('Next month')">→</button>
                </div>
            </div>
            <div class="empty-state">
                <svg viewBox="0 0 100 100" fill="currentColor">
                    <rect x="20" y="30" width="60" height="50" rx="5" stroke="currentColor" fill="none" stroke-width="2"/>
                    <path d="M35 25v10M65 25v10M20 40h60" stroke="currentColor" stroke-width="2"/>
                </svg>
                <h3>Calendar View</h3>
                <p>Schedule management coming soon</p>
            </div>
        </div>
    `;
}

// Reports Page
function renderReportsPage(container) {
    container.innerHTML = `
        <div class="empty-state">
            <svg viewBox="0 0 100 100" fill="currentColor">
                <rect x="30" y="20" width="40" height="60" rx="3" stroke="currentColor" fill="none" stroke-width="2"/>
                <path d="M40 30h20M40 40h20M40 50h15" stroke="currentColor" stroke-width="2"/>
            </svg>
            <h3>Reports Section</h3>
            <p>Generate and view patient reports</p>
        </div>
    `;
}

// Messages Page
function renderMessagesPage(container) {
    container.innerHTML = `
        <div class="patients-header">
            <h2 class="table-title">Messages</h2>
            <span class="badge" style="position: static;">3 New</span>
        </div>
        <div class="empty-state">
            <svg viewBox="0 0 100 100" fill="currentColor">
                <path d="M20 30a5 5 0 0 1 5-5h50a5 5 0 0 1 5 5v35a5 5 0 0 1-5 5H35l-15 10V30z" stroke="currentColor" fill="none" stroke-width="2"/>
            </svg>
            <h3>Message Center</h3>
            <p>No new messages</p>
        </div>
    `;
}

// Medications Page
function renderMedicationsPage(container) {
    container.innerHTML = `
        <div class="patients-header">
            <h2 class="table-title">Medications Inventory</h2>
            <button class="btn-primary" onclick="alert('Add Medication functionality')">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 4v12M4 10h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                Add Medication
            </button>
        </div>
        <div class="empty-state">
            <svg viewBox="0 0 100 100" fill="currentColor">
                <rect x="35" y="40" width="30" height="30" rx="3" stroke="currentColor" fill="none" stroke-width="2"/>
                <path d="M45 30v-5a5 5 0 0 1 10 0v5" stroke="currentColor" stroke-width="2"/>
            </svg>
            <h3>Medications Management</h3>
            <p>Track and manage medication inventory</p>
        </div>
    `;
}

// Render patients table
function renderPatientsTable() {
    const startIndex = (currentPatientPage - 1) * patientsPerPage;
    const endIndex = startIndex + patientsPerPage;
    const paginatedPatients = patients.slice(startIndex, endIndex);

    if (paginatedPatients.length === 0) {
        return `
            <div class="empty-state">
                <h3>No patients found</h3>
                <p>Add a new patient to get started</p>
            </div>
        `;
    }

    return `
        <table>
            <thead>
                <tr>
                    <th>ADMITTED</th>
                    <th>PATIENT</th>
                    <th>ROOM</th>
                    <th>AREA OF CONCERN</th>
                    <th>IN CHARGE</th>
                    <th>STATUS</th>
                    <th>CONTACT</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                ${paginatedPatients.map((patient, index) => `
                    <tr ${index === 2 ? 'class="highlighted"' : ''}>
                        <td>${formatDate(patient.admitted)}</td>
                        <td>${patient.name}</td>
                        <td>${patient.room}</td>
                        <td>${patient.concern}</td>
                        <td>${patient.inCharge}</td>
                        <td>${renderStatusBadge(patient.status)}</td>
                        <td>
                            <div class="action-btns">
                                <button class="icon-btn" onclick="alert('Email ${patient.name}')">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M3 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z" stroke="currentColor" fill="none" stroke-width="1.5"/>
                                        <path d="M3 5l7 5 7-5" stroke="currentColor" fill="none" stroke-width="1.5"/>
                                    </svg>
                                </button>
                                <button class="icon-btn" onclick="alert('Call ${patient.name}')">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M3 5a2 2 0 0 1 2-2h2l2 5-2.5 1.5a11 11 0 0 0 5 5L13 12l5 2v2a2 2 0 0 1-2 2A14 14 0 0 1 2 4a2 2 0 0 1 2-2z" stroke="currentColor" fill="none" stroke-width="1.5"/>
                                    </svg>
                                </button>
                            </div>
                        </td>
                        <td>
                            <button class="menu-btn" onclick="showPatientMenu(event, ${patient.id})">⋮</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Render pagination
function renderPagination() {
    const totalPages = Math.ceil(patients.length / patientsPerPage);
    const pages = [];
    
    for (let i = 1; i <= Math.min(5, totalPages); i++) {
        pages.push(i);
    }

    return `
        <div class="pagination">
            <div class="pagination-btns">
                <button class="pagination-btn" onclick="changePage(${currentPatientPage - 1})" ${currentPatientPage === 1 ? 'disabled' : ''}>
                    ← Previous
                </button>
                ${pages.map(page => `
                    <button class="pagination-btn ${page === currentPatientPage ? 'active' : ''}" onclick="changePage(${page})">
                        ${page}
                    </button>
                `).join('')}
                ${totalPages > 5 ? `
                    <button class="pagination-btn" disabled>...</button>
                    <button class="pagination-btn" onclick="changePage(10)">10</button>
                ` : ''}
                <button class="pagination-btn" onclick="changePage(${currentPatientPage + 1})" ${currentPatientPage >= totalPages ? 'disabled' : ''}>
                    Next →
                </button>
            </div>
            <div class="pagination-info">
                Page 
                <select onchange="changePage(parseInt(this.value))">
                    ${Array.from({length: totalPages}, (_, i) => `
                        <option value="${i + 1}" ${i + 1 === currentPatientPage ? 'selected' : ''}>
                            ${i + 1}
                        </option>
                    `).join('')}
                </select>
                of ${totalPages}
            </div>
        </div>
    `;
}

// Helper functions
function renderStatusBadge(status) {
    const statusClass = status.toLowerCase().replace(/\s+/g, '-');
    const dot = `<span class="legend-dot ${statusClass}"></span>`;
    return `<span class="status-badge ${statusClass}">${dot}${status}</span>`;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
}

// Tab switching
function changeTab(tab) {
    currentTab = tab;
    renderPage('patients');
}

// Pagination
function changePage(page) {
    const totalPages = Math.ceil(patients.length / patientsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPatientPage = page;
        renderPage('patients');
    }
}

// Search functionality
function setupSearchListener() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        
        if (searchTerm === '') {
            renderPage(currentPage);
            return;
        }

        // Filter patients based on search
        const filteredPatients = patients.filter(patient => 
            patient.name.toLowerCase().includes(searchTerm) ||
            patient.room.toLowerCase().includes(searchTerm) ||
            patient.concern.toLowerCase().includes(searchTerm)
        );

        // Show filtered results if on patients page
        if (currentPage === 'patients') {
            const tempPatients = patients;
            patients = filteredPatients;
            renderPage('patients');
            patients = tempPatients;
        }
    });
}

// Patient Management Functions
function openAddPatientModal() {
    editingPatientId = null;
    document.getElementById('modalTitle').textContent = 'Add Patient';
    document.getElementById('patientForm').reset();
    document.getElementById('patientId').value = '';
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('patientAdmitted').value = today;
    
    document.getElementById('patientModal').classList.add('active');
}

function openEditPatientModal(patientId) {
    editingPatientId = patientId;
    const patient = patients.find(p => p.id === patientId);
    
    if (patient) {
        document.getElementById('modalTitle').textContent = 'Edit Patient';
        document.getElementById('patientId').value = patient.id;
        document.getElementById('patientName').value = patient.name;
        document.getElementById('patientRoom').value = patient.room;
        document.getElementById('patientConcern').value = patient.concern;
        document.getElementById('patientInCharge').value = patient.inCharge;
        document.getElementById('patientStatus').value = patient.status;
        document.getElementById('patientAdmitted').value = patient.admitted;
        
        document.getElementById('patientModal').classList.add('active');
    }
}

function closeModal() {
    document.getElementById('patientModal').classList.remove('active');
    editingPatientId = null;
}

function deletePatient(patientId) {
    if (confirm('Are you sure you want to delete this patient?')) {
        patients = patients.filter(p => p.id !== patientId);
        renderPage('patients');
    }
}

function changePatientStatus(patientId, newStatus) {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
        patient.status = newStatus;
        renderPage('patients');
    }
}

// Show patient menu
function showPatientMenu(event, patientId) {
    event.stopPropagation();
    
    const menu = document.createElement('div');
    menu.style.cssText = `
        position: fixed;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        padding: 8px 0;
        z-index: 1000;
        min-width: 180px;
    `;
    
    const buttonRect = event.target.getBoundingClientRect();
    menu.style.top = buttonRect.bottom + 5 + 'px';
    menu.style.left = (buttonRect.left - 150) + 'px';
    
    menu.innerHTML = `
        <button onclick="openEditPatientModal(${patientId}); closeContextMenu()" style="width: 100%; text-align: left; padding: 10px 16px; border: none; background: none; cursor: pointer; font-size: 14px; color: #374151;">
            Edit Patient
        </button>
        <button onclick="changePatientStatus(${patientId}, 'Discharged'); closeContextMenu()" style="width: 100%; text-align: left; padding: 10px 16px; border: none; background: none; cursor: pointer; font-size: 14px; color: #374151;">
            Mark as Discharged
        </button>
        <button onclick="changePatientStatus(${patientId}, 'ICU'); closeContextMenu()" style="width: 100%; text-align: left; padding: 10px 16px; border: none; background: none; cursor: pointer; font-size: 14px; color: #374151;">
            Move to ICU
        </button>
        <hr style="margin: 8px 0; border: none; border-top: 1px solid #e5e7eb;">
        <button onclick="deletePatient(${patientId}); closeContextMenu()" style="width: 100%; text-align: left; padding: 10px 16px; border: none; background: none; cursor: pointer; font-size: 14px; color: #dc2626;">
            Delete Patient
        </button>
    `;
    
    document.body.appendChild(menu);
    
    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 0);
}

function closeContextMenu() {
    const menus = document.querySelectorAll('div[style*="position: fixed"]');
    menus.forEach(menu => {
        if (menu.innerHTML.includes('Edit Patient')) {
            menu.remove();
        }
    });
}

// Form submission
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('patientForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const patientData = {
                name: document.getElementById('patientName').value,
                room: document.getElementById('patientRoom').value,
                concern: document.getElementById('patientConcern').value,
                inCharge: document.getElementById('patientInCharge').value,
                status: document.getElementById('patientStatus').value,
                admitted: document.getElementById('patientAdmitted').value
            };
            
            if (editingPatientId) {
                // Update existing patient
                const patient = patients.find(p => p.id === editingPatientId);
                if (patient) {
                    Object.assign(patient, patientData);
                }
            } else {
                // Add new patient
                const newPatient = {
                    id: patients.length > 0 ? Math.max(...patients.map(p => p.id)) + 1 : 1,
                    ...patientData
                };
                patients.push(newPatient);
            }
            
            closeModal();
            renderPage('patients');
        });
    }
});

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('patientModal');
    if (e.target === modal) {
        closeModal();
    }
});