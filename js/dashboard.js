// Hospital Dashboard JavaScript for CareFlow Prototype

const patientQueueBody = document.getElementById('patient-queue-body');
const bottleneckAlert = document.getElementById('bottleneck-alert');
const bottleneckDeptSpan = document.getElementById('bottleneck-dept');
const countTotal = document.getElementById('count-total');

function updateDashboard() {
    const patients = getPatients();

    // Track department counts for bottleneck
    const counts = {
        'Emergency Care': 0,
        'General Practice': 0,
        'Urgent Care / Internal Medicine': 0,
        'Pediatrics': 0
    };

    // Clear current queue table
    patientQueueBody.innerHTML = '';

    // Filter only those in waiting status
    const waitingPatients = patients.filter(p => p.status === 'waiting');
    
    // Update total KPI
    if (countTotal) countTotal.innerText = waitingPatients.length;

    // Sort by timestamp (newest first for "Recent Admissions")
    waitingPatients.sort((a, b) => b.timestamp - a.timestamp);

    waitingPatients.forEach(patient => {
        // Update counts for bottleneck logic
        const dept = patient.department;
        if (counts.hasOwnProperty(dept)) {
            counts[dept]++;
        }

        // Add premium row to table
        const row = document.createElement('tr');
        const initials = patient.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        
        row.innerHTML = `
            <td>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--bg-input); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; color: var(--text-secondary);">${initials}</div>
                    <span style="font-weight: 500;">${patient.name}</span>
                </div>
            </td>
            <td style="font-family: monospace; color: var(--text-secondary);">${patient.caseId || '#ER-' + Math.floor(Math.random()*900+100) + '-A'}</td>
            <td><span class="badge ${getBadgeClass(patient.urgency)}">${patient.urgency}</span></td>
            <td style="color: var(--text-secondary);">Dr. ${getAssignedPhysician(patient.department)}</td>
            <td style="color: var(--text-secondary);">${formatTime(patient.timestamp)}</td>
            <td style="text-align: right;">
                <button class="icon-btn" onclick="processPatient('${patient.id}')" title="Treat Patient"><i class="fas fa-check-circle"></i></button>
            </td>
        `;
        patientQueueBody.appendChild(row);
    });

    // Check for bottlenecks
    let bottleneckFound = false;
    Object.keys(counts).forEach(dept => {
        if (counts[dept] >= 5) {
            bottleneckAlert.style.display = 'block';
            bottleneckDeptSpan.innerText = dept;
            bottleneckFound = true;
        }
    });
    if (!bottleneckFound) {
        bottleneckAlert.style.display = 'none';
    }
}

function getBadgeClass(urgency) {
    if (urgency === 'critical') return 'badge-critical';
    if (urgency === 'urgent') return 'badge-urgent';
    return 'badge-stable';
}

function getAssignedPhysician(dept) {
    const doctors = ['Marcus Vance', 'Elena Rodriguez', 'Sarah Jenkins', 'Julian Vance'];
    if (dept === 'Emergency Care') return doctors[0];
    if (dept.includes('Urgent')) return doctors[1];
    return doctors[2];
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function processPatient(id) {
    let patients = getPatients();
    patients = patients.map(p => {
        if (p.id === id) {
            p.status = 'treated';
        }
        return p;
    });
    savePatients(patients);
    updateDashboard();
}

window.processPatient = processPatient;

// Refresh dashboard every 5 seconds
setInterval(updateDashboard, 5000);

// Initial call
updateDashboard();
