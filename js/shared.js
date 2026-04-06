// Shared Logic for CareFlow Prototype

/**
 * Data Storage Functions
 */
function getPatients() {
    const data = localStorage.getItem('careflow_patients');
    return data ? JSON.parse(data) : [];
}

function savePatients(patients) {
    localStorage.setItem('careflow_patients', JSON.stringify(patients));
}

function clearPatients() {
    localStorage.removeItem('careflow_patients');
}

/**
 * Mock Patient History Data
 */
const MOCK_HISTORIES = {
    'p1': { name: 'John Doe', history: 'Hypertension, High Cholesterol', age: 45 },
    'p2': { name: 'Jane Smith', history: 'Asthma, Allergy to Penicillin', age: 32 },
    'p3': { name: 'Robert Brown', history: 'Type 2 Diabetes', age: 68 },
    'new': { name: '', history: 'No known medical history', age: 30 }
};

/**
 * Initial Mock Data if Storage is empty
 */
function seedInitialData() {
    if (getPatients().length === 0) {
        const initialPatients = [
            {
                id: 'mock-1',
                name: 'Alice Johnson',
                symptoms: 'Mild fever and cough',
                urgency: 'non-urgent',
                department: 'General Practice',
                waitTime: '45 mins',
                status: 'waiting',
                history: 'None',
                position: 1,
                timestamp: Date.now() - 1000 * 60 * 30
            },
            {
                id: 'mock-2',
                name: 'Bob Wilson',
                symptoms: 'Sudden chest pain',
                urgency: 'critical',
                department: 'Emergency Care',
                waitTime: 'Immediate',
                status: 'waiting',
                history: 'Hypertension',
                position: 1,
                timestamp: Date.now() - 1000 * 60 * 5
            },
            {
                id: 'mock-3',
                name: 'Charlie Davis',
                symptoms: 'Persistent headache and nausea',
                urgency: 'urgent',
                department: 'Neurology',
                waitTime: '15 mins',
                status: 'waiting',
                history: 'Migraines',
                position: 2,
                timestamp: Date.now() - 1000 * 60 * 15
            }
        ];
        savePatients(initialPatients);
    }
}

// Initialize when scripts load
seedInitialData();
