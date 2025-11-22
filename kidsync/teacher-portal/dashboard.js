const API_BASE = '../backend/api';
let teacher = null;
let students = [];

// Check authentication
window.addEventListener('load', () => {
  const teacherData = localStorage.getItem('teacher');
  if (!teacherData) {
    window.location.href = 'login.html';
    return;
  }

  teacher = JSON.parse(teacherData);
  document.getElementById('teacherName').textContent = teacher.first_name + ' ' + teacher.last_name;

  loadDashboard();
});

async function loadDashboard() {
  await loadStudents();
  updateStats();
}

async function loadStudents() {
  try {
    const response = await fetch(`${API_BASE}/students.php?teacher_id=${teacher.id}`);
    const data = await response.json();

    if (data.success) {
      students = data.students;
      renderStudents();
      populateStudentSelects();
    }
  } catch (error) {
    console.error('Error loading students:', error);
  }
}

function renderStudents() {
  const grid = document.getElementById('studentsGrid');
  grid.innerHTML = '';

  students.forEach(student => {
    const card = document.createElement('div');
    card.className = 'student-card';
    card.innerHTML = `
            <h3>${student.first_name} ${student.last_name}</h3>
            <p>Grade: ${student.grade}</p>
            <p>Parent: ${student.parent_name}</p>
            <p>Phone: ${student.parent_phone}</p>
            <p>Status: <strong>${student.status}</strong></p>
        `;
    grid.appendChild(card);
  });
}

function populateStudentSelects() {
  const selects = [
    document.getElementById('gradeStudentSelect'),
    document.getElementById('messageStudentSelect'),
    document.getElementById('reportStudentSelect'),
    document.getElementById('activityStudentSelect'),
    document.getElementById('healthStudentSelect'),
    document.getElementById('milestoneStudentSelect')
  ];

  selects.forEach(select => {
    if (select) {
      select.innerHTML = '<option value="">Select Student</option>';
      students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.id;
        option.dataset.parentId = student.parent_id;
        option.textContent = `${student.first_name} ${student.last_name} - ${student.grade}`;
        select.appendChild(option);
      });
    }
  });
}

function updateStats() {
  document.getElementById('totalStudents').textContent = students.length;
  document.getElementById('presentToday').textContent = students.filter(s => s.status === 'at-school').length;
  // Messages would be loaded from API
  document.getElementById('unreadMessages').textContent = '0';
}

function showSection(section) {
  // Hide all sections
  document.querySelectorAll('[id$="-section"]').forEach(el => el.style.display = 'none');

  // Show selected section
  document.getElementById(section + '-section').style.display = 'block';

  // Update active nav
  document.querySelectorAll('.sidebar nav a').forEach(a => a.classList.remove('active'));
  event.target.classList.add('active');

  // Load section data
  if (section === 'grades') loadGrades();
  if (section === 'messages') loadMessages();
  if (section === 'activities') loadActivities();
  if (section === 'health') loadHealth();
  if (section === 'milestones') loadMilestones();
}

// Grade Management
function openGradeModal() {
  document.getElementById('gradeModal').classList.add('active');
  document.getElementById('assessmentDate').value = new Date().toISOString().split('T')[0];
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

document.getElementById('gradeForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    child_id: parseInt(document.getElementById('gradeStudentSelect').value),
    teacher_id: teacher.id,
    subject: document.getElementById('gradeSubject').value,
    assessment_type: document.getElementById('gradeType').value,
    marks_obtained: parseFloat(document.getElementById('marksObtained').value),
    total_marks: parseFloat(document.getElementById('totalMarks').value),
    comments: document.getElementById('gradeComments').value,
    assessment_date: document.getElementById('assessmentDate').value
  };

  try {
    const response = await fetch(`${API_BASE}/academic.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (data.success) {
      alert('Grade added successfully! Grade: ' + data.grade);
      closeModal('gradeModal');
      document.getElementById('gradeForm').reset();
      loadGrades();
    } else {
      alert('Error: ' + data.message);
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
});

async function loadGrades() {
  try {
    const tbody = document.getElementById('gradesBody');
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Loading...</td></tr>';

    // Load grades for all students
    let allGrades = [];
    for (const student of students) {
      const response = await fetch(`${API_BASE}/academic.php?child_id=${student.id}`);
      const data = await response.json();

      if (data.success && data.records.length > 0) {
        data.records.forEach(record => {
          record.student_name = `${student.first_name} ${student.last_name}`;
        });
        allGrades = allGrades.concat(data.records);
      }
    }

    tbody.innerHTML = '';

    if (allGrades.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No grades recorded yet</td></tr>';
    } else {
      allGrades.sort((a, b) => new Date(b.assessment_date) - new Date(a.assessment_date));

      allGrades.forEach(grade => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
                    <td>${grade.student_name}</td>
                    <td>${grade.subject}</td>
                    <td>${grade.assessment_type}</td>
                    <td>${grade.marks_obtained}/${grade.total_marks}</td>
                    <td><strong>${grade.grade}</strong></td>
                    <td>${new Date(grade.assessment_date).toLocaleDateString()}</td>
                `;
        tbody.appendChild(tr);
      });
    }
  } catch (error) {
    console.error('Error loading grades:', error);
  }
}

// Attendance Management
function markAttendanceForToday() {
  document.getElementById('attendanceDate').value = new Date().toISOString().split('T')[0];
  markAttendanceForDate();
}

function markAttendanceForDate() {
  const date = document.getElementById('attendanceDate').value;
  const list = document.getElementById('attendanceList');
  list.innerHTML = '<h3 style="margin-bottom: 1rem;">Mark Attendance for ' + date + '</h3>';

  students.forEach(student => {
    const div = document.createElement('div');
    div.style.cssText = 'padding: 1rem; background: #f8fafc; border-radius: 8px; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center;';
    div.innerHTML = `
            <span><strong>${student.first_name} ${student.last_name}</strong> - ${student.grade}</span>
            <div>
                <button class="btn btn-primary" style="padding: 0.5rem 1rem; margin: 0 0.3rem;" onclick="markAttendance(${student.id}, '${date}', 'present')">✓ Present</button>
                <button class="btn btn-secondary" style="padding: 0.5rem 1rem; margin: 0 0.3rem;" onclick="markAttendance(${student.id}, '${date}', 'absent')">✗ Absent</button>
                <button class="btn" style="padding: 0.5rem 1rem; margin: 0 0.3rem; background: #f59e0b; color: white;" onclick="markAttendance(${student.id}, '${date}', 'late')">⏰ Late</button>
            </div>
        `;
    list.appendChild(div);
  });
}

async function markAttendance(childId, date, status) {
  try {
    const response = await fetch(`${API_BASE}/academic.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'mark_attendance',
        child_id: childId,
        attendance_date: date,
        status: status,
        marked_by: teacher.id
      })
    });

    const data = await response.json();
    alert(`Attendance marked as ${status}`);
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

// Messages
function openMessageModal() {
  document.getElementById('messageModal').classList.add('active');
}

document.getElementById('messageForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const studentSelect = document.getElementById('messageStudentSelect');
  const selectedOption = studentSelect.options[studentSelect.selectedIndex];
  const parentId = selectedOption.dataset.parentId;

  const messageData = {
    sender_type: 'teacher',
    sender_id: teacher.id,
    receiver_type: 'parent',
    receiver_id: parseInt(parentId),
    child_id: parseInt(studentSelect.value),
    message: document.getElementById('messageText').value
  };

  try {
    const response = await fetch(`${API_BASE}/messages.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messageData)
    });

    const data = await response.json();

    if (data.success) {
      alert('Message sent successfully!');
      closeModal('messageModal');
      document.getElementById('messageForm').reset();
      loadMessages();
    } else {
      alert('Error: ' + data.message);
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
});

async function loadMessages() {
  try {
    const response = await fetch(`${API_BASE}/messages.php?sender_type=teacher&sender_id=${teacher.id}`);
    const data = await response.json();

    const list = document.getElementById('messagesList');
    list.innerHTML = '';

    if (data.success && data.messages.length > 0) {
      data.messages.forEach(msg => {
        const div = document.createElement('div');
        div.style.cssText = 'padding: 1rem; background: #f8fafc; border-left: 4px solid #10b981; border-radius: 6px; margin-bottom: 0.7rem;';
        div.innerHTML = `
                    <p style="color: #10b981; font-weight: 600; margin-bottom: 0.3rem;">${msg.sender_name}</p>
                    <p style="color: #333;">${msg.message}</p>
                    <p style="color: #999; font-size: 0.85rem; margin-top: 0.3rem;">${new Date(msg.sent_at).toLocaleString()}</p>
                `;
        list.appendChild(div);
      });
    } else {
      list.innerHTML = '<p style="text-align: center; color: #999;">No messages yet</p>';
    }
  } catch (error) {
    console.error('Error loading messages:', error);
  }
}

// Report Cards
async function generateReportCard() {
  const studentId = document.getElementById('reportStudentSelect').value;
  const term = document.getElementById('reportTerm').value;

  if (!studentId) {
    alert('Please select a student');
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/academic.php?child_id=${studentId}`);
    const data = await response.json();

    const student = students.find(s => s.id == studentId);
    const preview = document.getElementById('reportCardPreview');

    if (data.success && data.records.length > 0) {
      let totalMarks = 0;
      let totalPossible = 0;

      let tableHTML = `
                <div style="background: white; padding: 2rem; border: 2px solid #10b981; border-radius: 12px;">
                    <h2 style="text-align: center; color: #10b981; margin-bottom: 1rem;">📄 REPORT CARD</h2>
                    <div style="margin-bottom: 1.5rem;">
                        <p><strong>Student:</strong> ${student.first_name} ${student.last_name}</p>
                        <p><strong>Grade:</strong> ${student.grade}</p>
                        <p><strong>Term:</strong> ${term}</p>
                        <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
                    </div>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 1rem;">
                        <thead>
                            <tr style="background: #10b981; color: white;">
                                <th style="padding: 0.7rem; text-align: left;">Subject</th>
                                <th style="padding: 0.7rem;">Marks</th>
                                <th style="padding: 0.7rem;">Grade</th>
                                <th style="padding: 0.7rem;">Comments</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

      data.records.forEach(record => {
        totalMarks += parseFloat(record.marks_obtained);
        totalPossible += parseFloat(record.total_marks);

        tableHTML += `
                    <tr style="border-bottom: 1px solid #e5e7eb;">
                        <td style="padding: 0.7rem;">${record.subject}</td>
                        <td style="padding: 0.7rem; text-align: center;">${record.marks_obtained}/${record.total_marks}</td>
                        <td style="padding: 0.7rem; text-align: center;"><strong>${record.grade}</strong></td>
                        <td style="padding: 0.7rem;">${record.comments || '-'}</td>
                    </tr>
                `;
      });

      const overallPercentage = ((totalMarks / totalPossible) * 100).toFixed(1);

      tableHTML += `
                        </tbody>
                    </table>
                    <div style="background: #f8fafc; padding: 1rem; border-radius: 8px;">
                        <p><strong>Overall Performance:</strong> ${totalMarks.toFixed(1)} / ${totalPossible.toFixed(1)} (${overallPercentage}%)</p>
                        <p><strong>Teacher's Remarks:</strong> ${overallPercentage >= 80 ? 'Excellent performance!' : overallPercentage >= 60 ? 'Good work, keep it up!' : 'Needs improvement'}</p>
                    </div>
                    <div style="margin-top: 1.5rem; text-align: center;">
                        <p><strong>Teacher:</strong> ${teacher.first_name} ${teacher.last_name}</p>
                        <p style="margin-top: 1rem;">__________________________</p>
                        <p>Signature</p>
                    </div>
                </div>
            `;

      preview.innerHTML = tableHTML;
    } else {
      preview.innerHTML = '<p style="text-align: center; color: #999;">No academic records found for this student</p>';
    }
  } catch (error) {
    alert('Error generating report card: ' + error.message);
  }
}

// Activities Management
async function loadActivities() {
  try {
    const tbody = document.getElementById('activitiesBody');
    tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Loading...</td></tr>';

    const response = await fetch(`${API_BASE}/activities.php?teacher_id=${teacher.id}`);
    const data = await response.json();

    if (data.success && data.activities.length > 0) {
      tbody.innerHTML = data.activities.map(activity => {
        const date = new Date(activity.activity_date);
        return `
          <tr>
            <td>${activity.child_name}</td>
            <td>${activity.activity_type}</td>
            <td>${date.toLocaleString()}</td>
            <td>${activity.description}</td>
          </tr>
        `;
      }).join('');
    } else {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No activities recorded yet</td></tr>';
    }
  } catch (error) {
    console.error('Error loading activities:', error);
    document.getElementById('activitiesBody').innerHTML = '<tr><td colspan="4" style="text-align: center; color: red;">Error loading activities</td></tr>';
  }
}

function openActivityModal() {
  document.getElementById('activityModal').classList.add('active');
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  document.getElementById('activityDateTime').value = now.toISOString().slice(0, 16);
}

document.getElementById('activityForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    child_id: parseInt(document.getElementById('activityStudentSelect').value),
    activity_type: document.getElementById('activityType').value,
    activity_date: document.getElementById('activityDateTime').value,
    description: document.getElementById('activityDescription').value
  };

  try {
    const response = await fetch(`${API_BASE}/activities.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    if (data.success) {
      alert('Activity added successfully!');
      closeModal('activityModal');
      document.getElementById('activityForm').reset();
      loadActivities();
    } else {
      alert('Error: ' + data.message);
    }
  } catch (error) {
    alert('Error adding activity: ' + error.message);
  }
});

// Health Management
async function loadHealth() {
  try {
    const tbody = document.getElementById('healthBody');
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Loading...</td></tr>';

    const response = await fetch(`${API_BASE}/health.php?teacher_id=${teacher.id}`);
    const data = await response.json();

    if (data.success && data.health_records.length > 0) {
      tbody.innerHTML = data.health_records.map(record => {
        const date = new Date(record.record_date).toLocaleDateString();
        return `
          <tr>
            <td>${record.child_name}</td>
            <td>${date}</td>
            <td>${record.meals_today || 'Not recorded'}</td>
            <td>${record.sleep_hours || 'N/A'}</td>
            <td>${record.notes || '-'}</td>
          </tr>
        `;
      }).join('');
    } else {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No health records yet</td></tr>';
    }
  } catch (error) {
    console.error('Error loading health records:', error);
    document.getElementById('healthBody').innerHTML = '<tr><td colspan="5" style="text-align: center; color: red;">Error loading health records</td></tr>';
  }
}

function openHealthModal() {
  document.getElementById('healthModal').classList.add('active');
  document.getElementById('healthDate').value = new Date().toISOString().split('T')[0];
}

document.getElementById('healthForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    child_id: parseInt(document.getElementById('healthStudentSelect').value),
    record_date: document.getElementById('healthDate').value,
    meals_today: document.getElementById('healthMeals').value,
    sleep_hours: parseFloat(document.getElementById('healthSleep').value),
    notes: document.getElementById('healthNotes').value || ''
  };

  try {
    const response = await fetch(`${API_BASE}/health.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    if (data.success) {
      alert('Health record added successfully!');
      closeModal('healthModal');
      document.getElementById('healthForm').reset();
      loadHealth();
    } else {
      alert('Error: ' + data.message);
    }
  } catch (error) {
    alert('Error adding health record: ' + error.message);
  }
});

// Milestones Management
async function loadMilestones() {
  try {
    const tbody = document.getElementById('milestonesBody');
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Loading...</td></tr>';

    const response = await fetch(`${API_BASE}/milestones.php?teacher_id=${teacher.id}`);
    const data = await response.json();

    if (data.success && data.milestones.length > 0) {
      tbody.innerHTML = data.milestones.map(milestone => {
        const date = new Date(milestone.achieved_date).toLocaleDateString();
        return `
          <tr>
            <td>${milestone.child_name}</td>
            <td>${milestone.milestone_title}</td>
            <td>${date}</td>
            <td>${milestone.description}</td>
            <td style="font-size: 1.5rem;">${milestone.badge_icon}</td>
          </tr>
        `;
      }).join('');
    } else {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No milestones recorded yet</td></tr>';
    }
  } catch (error) {
    console.error('Error loading milestones:', error);
    document.getElementById('milestonesBody').innerHTML = '<tr><td colspan="5" style="text-align: center; color: red;">Error loading milestones</td></tr>';
  }
}

function openMilestoneModal() {
  document.getElementById('milestoneModal').classList.add('active');
  document.getElementById('milestoneDate').value = new Date().toISOString().split('T')[0];
}

document.getElementById('milestoneForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    child_id: parseInt(document.getElementById('milestoneStudentSelect').value),
    milestone_title: document.getElementById('milestoneTitle').value,
    achieved_date: document.getElementById('milestoneDate').value,
    description: document.getElementById('milestoneDescription').value,
    badge_icon: document.getElementById('milestoneBadge').value
  };

  try {
    const response = await fetch(`${API_BASE}/milestones.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    if (data.success) {
      alert('Milestone added successfully!');
      closeModal('milestoneModal');
      document.getElementById('milestoneForm').reset();
      loadMilestones();
    } else {
      alert('Error: ' + data.message);
    }
  } catch (error) {
    alert('Error adding milestone: ' + error.message);
  }
});

function logout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('teacher');
    window.location.href = 'login.html';
  }
}
