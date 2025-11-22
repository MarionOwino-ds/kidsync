# KidSync Application Routes

## Parent Portal Routes

### Authentication

- **Login Page**: `http://localhost/kidsync/src/auth/login.html`
- **Signup Page**: `http://localhost/kidsync/src/auth/signup.html`

### Main Dashboard

- **Parent Dashboard**: `http://localhost/kidsync/src/html/dashboard.html`
  - View all children
  - See device tokens
  - Message notifications
  - Quick actions (View, Track)

### Child-Specific Pages

- **Individual Child Dashboard**: `http://localhost/kidsync/src/html/kid-dashboard.html`

  - Grades, Attendance, Messages
  - Today's Stats (meals, sleep, activities)
  - Activities timeline

- **Activities Page**: `http://localhost/kidsync/src/html/activities.html`
- **Health Page**: `http://localhost/kidsync/src/html/health.html`
- **Milestones Page**: `http://localhost/kidsync/src/html/milestones.html`
- **Calendar Page**: `http://localhost/kidsync/src/html/calender.html`
- **Location Tracking**: `http://localhost/kidsync/src/html/location.html`
- **Profile Page**: `http://localhost/kidsync/src/html/profile.html`
- **Settings Page**: `http://localhost/kidsync/src/html/settings.html`

---

## Teacher Portal Routes

### Teacher Authentication & Dashboard

- **Teacher Login**: `http://localhost/kidsync/teacher-portal/login.html`
- **Teacher Dashboard**: `http://localhost/kidsync/teacher-portal/dashboard.html`
  - Manage students
  - Add grades
  - Mark attendance
  - Send messages to parents

---

## Child Device Simulator

- **Device Simulator**: `http://localhost/kidsync/child-device/index.html?token={DEVICE_TOKEN}`
  - Shows child's name
  - Displays teacher messages
  - Real-time notifications every 10 seconds
  - Copy device token from parent dashboard

**Example**:

```
http://localhost/kidsync/child-device/index.html?token=ba5f818fc4c76feddc9f4a862a0f6317
```

---

## API Endpoints

### Base URL

```
http://localhost/kidsync/backend/api/
```

### Authentication APIs

- **POST** `/auth.php` - Login (parent/teacher)
- **POST** `/register.php` - Parent registration

### Children APIs

- **GET** `/children.php?parent_id={id}` - Get all children for a parent
- **POST** `/add_child.php` - Add new child to existing parent

### Academic APIs

- **GET** `/academic.php?child_id={id}` - Get grades for a child
- **GET** `/academic.php?child_id={id}&type=attendance` - Get attendance records
- **POST** `/academic.php` - Add new grade (teacher)

### Messages APIs

- **GET** `/messages.php?sender_type=parent&sender_id={id}&child_id={id}` - Get messages
- **POST** `/messages.php` - Send message
- **PUT** `/messages.php` - Mark message as read

### Activities APIs

- **GET** `/activities.php?child_id={id}` - Get child activities
- **POST** `/activities.php` - Add activity

### Location APIs

- **GET** `/locations.php?child_id={id}` - Get location history
- **POST** `/locations.php` - Update child location

### Health APIs

- **GET** `/health.php?child_id={id}` - Get health records
- **POST** `/health.php` - Add health record

### Milestones APIs

- **GET** `/milestones.php?child_id={id}` - Get milestones
- **POST** `/milestones.php` - Add milestone

---

## Demo Accounts

### Parent Accounts

| Email              | Password        | Children                             |
| ------------------ | --------------- | ------------------------------------ |
| kinyajui@gmail.com | (your password) | John (kindergarten), Nancy (Grade 2) |
| chemwami@gmail.com | (your password) | John (pre-k)                         |

### Teacher Account

| Email            | Password   | School                          |
| ---------------- | ---------- | ------------------------------- |
| teacher@demo.com | teacher123 | Nairobi Primary School (SCH001) |

### School Code

- **SCH001** - Nairobi Primary School

---

## Quick Access Links (Copy & Paste)

### For Parents:

```
http://localhost/kidsync/src/auth/login.html
http://localhost/kidsync/src/html/dashboard.html
```

### For Teachers:

```
http://localhost/kidsync/teacher-portal/login.html
http://localhost/kidsync/teacher-portal/dashboard.html
```

### For Testing Child Device:

```
http://localhost/kidsync/child-device/index.html?token=ba5f818fc4c76feddc9f4a862a0f6317
http://localhost/kidsync/child-device/index.html?token=5b281c574cb1c9b00b99662b6e54dfd9
```

---

## Notes

- All routes require XAMPP running with Apache and MySQL
- Database: `kidsync_db`
- Parent portal uses localStorage for session management
- Device tokens are unique per child
- Hard refresh (Ctrl+F5) recommended after code updates to clear browser cache
