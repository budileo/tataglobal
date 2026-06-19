// Default data for demonstration
const defaultEmployees = [
  { id: 'emp-1', name: 'Ahmad Fauzi', position: 'Spv Produksi', department: 'Operations' },
  { id: 'emp-2', name: 'Budi Santoso', position: 'Staf Keuangan', department: 'Finance' },
  { id: 'emp-3', name: 'Siti Aminah', position: 'HR Admin', department: 'HRD' }
];

const defaultPeriods = ['Q1 2026', 'Q2 2026', 'Annual 2025'];

// Store keys
const KEYS = {
  EMPLOYEES: 'hrd_employees',
  PERIODS: 'hrd_periods',
  ASSESSMENTS: 'hrd_assessments'
};

export const store = {
  getEmployees() {
    const data = localStorage.getItem(KEYS.EMPLOYEES);
    return data ? JSON.parse(data) : defaultEmployees;
  },
  
  saveEmployee(employee) {
    const employees = this.getEmployees();
    if (employee.id) {
      // Update
      const index = employees.findIndex(e => e.id === employee.id);
      if (index !== -1) employees[index] = employee;
    } else {
      // Add
      employee.id = 'emp-' + Date.now();
      employees.push(employee);
    }
    localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(employees));
    return employee;
  },

  deleteEmployee(id) {
    const employees = this.getEmployees().filter(e => e.id !== id);
    localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(employees));
  },

  getPeriods() {
    const data = localStorage.getItem(KEYS.PERIODS);
    return data ? JSON.parse(data) : defaultPeriods;
  },

  savePeriod(period) {
    const periods = this.getPeriods();
    if (!periods.includes(period)) {
      periods.push(period);
      localStorage.setItem(KEYS.PERIODS, JSON.stringify(periods));
    }
  },

  getAssessments() {
    const data = localStorage.getItem(KEYS.ASSESSMENTS);
    return data ? JSON.parse(data) : [];
  },

  getAssessmentById(id) {
    return this.getAssessments().find(a => a.id === id);
  },

  saveAssessment(assessment) {
    const assessments = this.getAssessments();
    if (assessment.id) {
      const index = assessments.findIndex(a => a.id === assessment.id);
      if (index !== -1) assessments[index] = assessment;
    } else {
      assessment.id = 'assrv-' + Date.now();
      assessments.push(assessment);
    }
    localStorage.setItem(KEYS.ASSESSMENTS, JSON.stringify(assessments));
    return assessment;
  }
};
