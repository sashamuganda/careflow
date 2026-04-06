// Hospital Dashboard JavaScript for CareFlow Prototype

const patientQueueBody = document.getElementById('patient-queue-body');
const bottleneckAlert = document.getElementById('bottleneck-alert');
const bottleneckDeptSpan = document.getElementById('bottleneck-dept');
const countEmergency = document.getElementById('count-emergency');
const countGeneral = document.getElementById('count-general');
const countUrgent = document.getElementById('count-urgent');
const countPediatrics = document.getElementById('count-pediatrics');
const refreshDashboardBtn = document.getElementById('refresh-dashboard');

function updateDashboard() {
    const patients = getPatients();

    // Track department counts
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

    // Sort by timestamp (oldest first)
    waitingPatients.sort((a, b) => a.timestamp - b.timestamp);

    waitingPatients.forEach(patient => {
        // Update counts
        const dept = patient.department;
        if (counts.hasOwnProperty(dept)) {
            counts[dept]++;
        } else if (dept.includes('Urgent')) {
            counts['Urgent Care / Internal Medicine']++;
        }

        // Add row to table
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <strong>${patient.name}</strong><br>
                <small>${patient.history || 'No history'}</small>
            </td>
            <td>${patient.symptoms}</td>
            <td><span class="badge ${getBadgeClass(patient.urgency)}">${patient.urgency}</span></td>
            <td>${patient.waitTime}</td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="processPatient('${patient.id}')">Treat</button>
            </td>
        `;
        patientQueueBody.appendChild(row);
    });

    // Update counters
    countEmergency.innerText = counts['Emergency Care'];
    countGeneral.innerText = counts['General Practice'];
    countUrgent.innerText = counts['Urgent Care / Internal Medicine'];
    countPediatrics.innerText = counts['Pediatrics'];

    // Check for bottlenecks (>= 5 patients)
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
    if (urgency === 'critical') return 'badge-red';
    if (urgency === 'urgent') return 'badge-orange';
    return 'badge-green';
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

// Global scope for onclick handlers
window.processPatient = processPatient;

// Refresh dashboard every 10 seconds
setInterval(updateDashboard, 10000);

// Force refresh button
refreshDashboardBtn.addEventListener('click', updateDashboard);

// Initial call
updateDashboard();
