// Patient Portal JavaScript for CareFlow Prototype

const triageForm = document.getElementById('triage-form');
const mockProfileSelect = document.getElementById('mock-profile');
const patientNameInput = document.getElementById('patient-name');
const triageResultDiv = document.getElementById('triage-result');
const patientFormContainer = document.getElementById('patient-form-container');
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
    let urgency = 'non-urgent';
    let department = 'General Practice';
    let waitTime = '60 mins';
    let badgeClass = 'badge-green';

    if (score >= 10 || symptomsLower.includes('chest') || symptomsLower.includes('breath')) {
        urgency = 'critical';
        department = 'Emergency Care';
        waitTime = 'Immediate';
        badgeClass = 'badge-red';
    } else if (score >= 5) {
        urgency = 'urgent';
        department = 'Urgent Care / Internal Medicine';
        waitTime = '20 mins';
        badgeClass = 'badge-orange';
    }

    return {
        id: 'p-' + Date.now(),
        name: patientNameInput.value,
        symptoms: symptoms,
        history: history,
        urgency: urgency,
        department: department,
        waitTime: waitTime,
        badgeClass: badgeClass,
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
    triageResultDiv.classList.add(`triage-${currentTriageData.urgency}`);

    document.getElementById('result-badge-container').innerHTML = `<span class="badge ${currentTriageData.badgeClass}">${currentTriageData.urgency}</span>`;
    document.getElementById('result-urgency').innerText = `Urgency Level: ${currentTriageData.urgency.toUpperCase()}`;
    document.getElementById('result-dept').innerText = `Recommended Department: ${currentTriageData.department}`;
    document.getElementById('result-wait').innerText = `Estimated Wait Time: ${currentTriageData.waitTime}`;
});

// Handle queue confirmation
confirmQueueBtn.addEventListener('submit', (e) => {
    // This button's default type is submit if it was in form, but it's not.
    // Making it an event listener on click.
});

confirmQueueBtn.onclick = () => {
    // Save to LocalStorage
    const patients = getPatients();

    // Add position based on current queue length in that department
    const deptPatients = patients.filter(p => p.department === currentTriageData.department && p.status === 'waiting');
    currentTriageData.position = deptPatients.length + 1;

    patients.push(currentTriageData);
    savePatients(patients);

    // Show queue status
    triageResultDiv.style.display = 'none';
    queueStatusDiv.style.display = 'block';
    document.getElementById('queue-dept-name').innerText = currentTriageData.department;
    document.getElementById('queue-position').innerText = currentTriageData.position;
    document.getElementById('queue-time').innerText = currentTriageData.waitTime;

    // Simulate SMS fallback logic
    // We'll trigger it after 5 seconds to simulate a "failed notification"
    setTimeout(() => {
        smsFallbackDiv.style.display = 'block';
    }, 5000);
};
