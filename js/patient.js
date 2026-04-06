// Patient Portal JavaScript for CareFlow Prototype

const triageForm = document.getElementById('triage-form');
const mockProfileSelect = document.getElementById('mock-profile');
const patientNameInput = document.getElementById('patient-name');
const patientFormContainer = document.getElementById('patient-form-container');
const triageResultDiv = document.getElementById('triage-result');
const confirmQueueBtn = document.getElementById('confirm-queue-btn');
const queueStatusDiv = document.getElementById('queue-status');
const smsFallbackDiv = document.getElementById('sms-fallback');

// Triage Logic Constants
const KEYWORDS = {
    CRITICAL: ['chest pain', 'breathing difficulty', 'severe bleeding', 'unconscious', 'stroke', 'seizure', 'heart attack'],
    URGENT: ['fever', 'high temperature', 'vomiting', 'deep cut', 'broken bone', 'intense pain', 'persistent headache'],
    NON_URGENT: ['cough', 'sore throat', 'mild pain', 'runny nose', 'rash', 'dizziness', 'fatigue']
};

let currentTriageData = null;

// Handle mock profile selection
mockProfileSelect.addEventListener('change', (e) => {
    const profileId = e.target.value;
    const profile = MOCK_HISTORIES[profileId];
    if (profile) {
        patientNameInput.value = profile.name;
    } else {
        patientNameInput.value = '';
    }
});

// AI Triage Logic (Simulation)
function simulateTriage(symptoms, profileId) {
    const symptomsLower = symptoms.toLowerCase();
    const history = MOCK_HISTORIES[profileId] ? MOCK_HISTORIES[profileId].history : 'None';

    let score = 0;

    // Check keywords
    KEYWORDS.CRITICAL.forEach(kw => { if (symptomsLower.includes(kw)) score += 10; });
    KEYWORDS.URGENT.forEach(kw => { if (symptomsLower.includes(kw)) score += 5; });
    KEYWORDS.NON_URGENT.forEach(kw => { if (symptomsLower.includes(kw)) score += 1; });

    // Simple rule-based logic
    let urgency = 'stable';
    let department = 'General Practice';
    let waitTime = '60 mins';
    let badgeClass = 'badge-stable';
    let insightText = "Symptoms appear consistent with minor ailment. Monitoring recommended.";

    if (score >= 10 || symptomsLower.includes('chest') || symptomsLower.includes('breath')) {
        urgency = 'critical';
        department = 'Emergency Care';
        waitTime = 'Immediate';
        badgeClass = 'badge-critical';
        insightText = "High Risk: Evidence of acute respiratory or cardiac distress detected. Pulmonary/Cardiac emergency suspected. Immediate intervention required.";
    } else if (score >= 5) {
        urgency = 'urgent';
        department = 'Urgent Care / Internal Medicine';
        waitTime = '20 mins';
        badgeClass = 'badge-urgent';
        insightText = "Moderate Risk: Symptoms suggest acute progression. Further clinical assessment in Urgent Care required within 20 mins.";
    }

    return {
        id: 'PX-' + Math.floor(Math.random() * 9000 + 1000),
        caseId: 'ER-' + Math.floor(Math.random() * 900 + 100) + '-A',
        name: patientNameInput.value || 'Anonymous',
        symptoms: symptoms,
        history: history,
        urgency: urgency,
        department: department,
        waitTime: waitTime,
        badgeClass: badgeClass,
        insight: insightText,
        status: 'waiting',
        timestamp: Date.now()
    };
}

// Handle form submission
triageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const symptoms = document.getElementById('symptoms-text').value;
    const profileId = mockProfileSelect.value;

    currentTriageData = simulateTriage(symptoms, profileId);

    // Display results
    patientFormContainer.style.display = 'none';
    triageResultDiv.style.display = 'block';

    // Update UI elements
    document.getElementById('display-name').innerText = currentTriageData.name;
    document.getElementById('result-badge').innerText = currentTriageData.urgency.toUpperCase();
    document.getElementById('result-badge').className = `badge ${currentTriageData.badgeClass}`;
    document.getElementById('result-urgency').innerText = currentTriageData.urgency.toUpperCase() + ' Risk Level';
    document.getElementById('result-dept').innerText = currentTriageData.insight;
});

// Handle queue confirmation
confirmQueueBtn.onclick = () => {
    // Save to LocalStorage
    const patients = getPatients();

    // Add position based on current queue length
    const deptPatients = patients.filter(p => p.department === currentTriageData.department && p.status === 'waiting');
    currentTriageData.position = deptPatients.length + 1;

    patients.push(currentTriageData);
    savePatients(patients);

    // Show queue status
    queueStatusDiv.style.display = 'block';
    document.getElementById('queue-dept-name').innerText = currentTriageData.department;
    document.getElementById('queue-position').innerText = currentTriageData.position;
    document.getElementById('queue-time').innerText = currentTriageData.waitTime;

    // Change button text to indicate success
    confirmQueueBtn.innerText = "Check-in Confirmed";
    confirmQueueBtn.disabled = true;

    // Simulate SMS fallback logic (clinical alert from image)
    setTimeout(() => {
        smsFallbackDiv.style.display = 'block';
    }, 5000);
};
