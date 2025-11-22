# 🎓 KidSync - Complete Kids Tracking Platform

## 📋 Overview

KidSync is a comprehensive platform designed to help parents track their children's daily activities, location, health, and academic progress. The system includes three main components:

1. **Parent Dashboard** - Web interface for parents to monitor children
2. **Child Device Simulator** - Simulates child's mobile device with GPS tracking
3. **Teacher Portal** - Interface for teachers to manage students, grades, and communication

## 🏗️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: PHP 7.4+
- **Database**: MySQL 5.7+
- **Server**: Apache/Nginx with PHP support

## 📁 Project Structure

```
kidsync/
├── backend/
│   ├── api/                    # API endpoints
│   │   ├── login.php          # Authentication
│   │   ├── signup.php         # User registration
│   │   ├── children.php       # Children management
│   │   ├── activities.php     # Activity tracking
│   │   ├── location.php       # GPS location updates
│   │   ├── messages.php       # Messaging system
│   │   ├── academic.php       # Academic records & grades
│   │   └── students.php       # Student management
│   ├── includes/
│   │   ├── Database.php       # Database connection class
│   │   └── setup_database.php # Database setup script
│   └── config.php             # Configuration file
├── src/
│   ├── html/                  # Parent dashboard pages
│   │   ├── index.html
│   │   ├── login.html
│   │   ├── signup.html
│   │   ├── dashboard.html
│   │   ├── activities.html
│   │   ├── health.html
│   │   ├── location.html
│   │   ├── milestones.html
│   │   ├── profile.html
│   │   └── settings.html
│   └── js/                    # JavaScript files
│       ├── common.js
│       ├── dashboard.js
│       ├── login.js
│       └── [other js files]
├── child-device/
│   └── index.html             # Child device simulator
├── teacher-portal/
│   ├── login.html             # Teacher login
│   ├── dashboard.html         # Teacher dashboard
│   └── dashboard.js           # Teacher functionality
└── README.md
```

## 🗄️ Database Schema

### Tables Created:

1. **users** - Parent accounts
2. **schools** - School information
3. **teachers** - Teacher accounts
4. **children** - Child profiles with device tokens
5. **locations** - GPS tracking data
6. **activities** - Daily activities log
7. **health_records** - Health and meal tracking
8. **milestones** - Achievement tracking
9. **messages** - Parent-Teacher messaging
10. **academic_records** - Grades and marks
11. **attendance** - Student attendance records

## 🚀 Installation & Setup

### Prerequisites

- PHP 7.4 or higher
- MySQL 5.7 or higher
- Apache/Nginx web server
- Web browser (Chrome, Firefox, Edge)

### Step 1: Setup Web Server

#### Option A: Using XAMPP (Windows)

1. Download and install XAMPP from https://www.apachefriends.org/
2. Start Apache and MySQL services
3. Copy the `kidsync` folder to `C:\xampp\htdocs\`

#### Option B: Using WAMP (Windows)

1. Download and install WAMP from http://www.wampserver.com/
2. Start WAMP server
3. Copy the `kidsync` folder to `C:\wamp64\www\`

#### Option C: Using built-in PHP server (for testing)

```bash
cd C:\Users\USER\Desktop\kidsyc\kidsync\kidsync
php -S localhost:8000
```

### Step 2: Configure Database

1. Open `backend/config.php` and update database credentials if needed:

```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');           // Change if you have MySQL password
define('DB_NAME', 'kidsync_db');
```

### Step 3: Initialize Database

Open your browser and run the setup script:

```
http://localhost/kidsync/backend/includes/setup_database.php
```

Or via command line:

```bash
cd backend/includes
php setup_database.php
```

This will:

- Create the `kidsync_db` database
- Create all required tables
- Insert sample school data
- Create demo accounts

### Step 4: Access the Application

#### Parent Portal

```
http://localhost/kidsync/src/html/index.html
```

**Demo Login:**

- Email: `parent@demo.com`
- Password: `demo123`

#### Teacher Portal

```
http://localhost/kidsync/teacher-portal/login.html
```

**Demo Login:**

- Email: `teacher@demo.com`
- Password: `teacher123`

#### Child Device Simulator

```
http://localhost/kidsync/child-device/index.html?child_id=1&token=YOUR_DEVICE_TOKEN
```

- You'll get the device token after registering a child
- Use child_id from your database

## 📱 Features

### Parent Dashboard

✅ Real-time location tracking  
✅ Daily activity feed  
✅ Health and meal monitoring  
✅ Milestone tracking  
✅ Parent-teacher messaging  
✅ Multiple children management  
✅ Attendance viewing  
✅ Academic progress reports

### Child Device Simulator

✅ GPS location updates (every 30 seconds)  
✅ Activity logging  
✅ Status updates (Home/On Bus/At School)  
✅ Simulated movement (Go to School, On Bus, Go Home)  
✅ Real-time sync with parent dashboard

### Teacher Portal

✅ Student management  
✅ Grade and marks entry  
✅ Report card generation  
✅ Attendance marking  
✅ Parent messaging  
✅ Academic records tracking  
✅ Class statistics dashboard

## 🔐 Demo Accounts

### Parent Account

- **Email**: parent@demo.com
- **Password**: demo123
- Access to view children's data

### Teacher Account

- **Email**: teacher@demo.com
- **Password**: teacher123
- Access to manage students and grades

### School Code

- **Code**: SCH001
- Use this when registering new parents

## 🔌 API Endpoints

### Authentication

- `POST /backend/api/login.php` - User login
- `POST /backend/api/signup.php` - Parent registration

### Children Management

- `GET /backend/api/children.php?parent_id={id}` - Get children
- `GET /backend/api/students.php?teacher_id={id}` - Get students (teacher)

### Location Tracking

- `GET /backend/api/location.php?child_id={id}` - Get latest location
- `POST /backend/api/location.php` - Update location

### Activities

- `GET /backend/api/activities.php?child_id={id}&date={date}` - Get activities
- `POST /backend/api/activities.php` - Add activity

### Messaging

- `GET /backend/api/messages.php?sender_type={type}&sender_id={id}` - Get messages
- `POST /backend/api/messages.php` - Send message
- `PUT /backend/api/messages.php` - Mark as read

### Academic Records

- `GET /backend/api/academic.php?child_id={id}` - Get academic records
- `POST /backend/api/academic.php` - Add grade/marks

## 🎯 Usage Guide

### For Parents:

1. **Register Account**

   - Go to signup page
   - Enter your details and child information
   - Use school code: SCH001
   - Save the device token provided

2. **View Dashboard**

   - Login with your credentials
   - See all your children's cards
   - View today's activities
   - Check live location
   - Read teacher messages

3. **Track Child**
   - Click on a child card to view detailed dashboard
   - Monitor location, activities, health, and milestones
   - Send messages to teachers

### For Teachers:

1. **Login**

   - Use teacher credentials
   - Access teacher portal

2. **Manage Students**

   - View all students in your school
   - Mark attendance daily
   - Add grades and marks
   - Generate report cards

3. **Communicate**
   - Send messages to parents
   - Respond to parent queries
   - Send activity updates

### For Child Device Simulation:

1. **Access Device**

   - Use the URL with child_id and device token
   - Device automatically starts tracking location

2. **Simulate Movement**

   - Click "Go to School" to simulate bus ride
   - Click "On Bus" for moving status
   - Click "Go Home" to return home
   - Add activities manually

3. **Monitor**
   - Watch the log for updates
   - See location changes
   - View activities added

## 🔧 Configuration

### Database Settings

Edit `backend/config.php`:

```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', 'your_password');
define('DB_NAME', 'kidsync_db');
```

### Location Update Interval

Edit `child-device/index.html`:

```javascript
// Change interval (milliseconds)
locationInterval = setInterval(() => {
  // Update location code
}, 30000); // 30 seconds (change as needed)
```

### API Base URL

If deploying to a different server, update in:

- `src/js/login.js`
- `src/js/dashboard.js`
- `teacher-portal/dashboard.js`
- `child-device/index.html`

Change:

```javascript
const API_BASE = "../../backend/api";
```

## 📊 Database Tables Overview

| Table            | Purpose          | Key Fields                                     |
| ---------------- | ---------------- | ---------------------------------------------- |
| users            | Parent accounts  | id, email, password, first_name, last_name     |
| children         | Child profiles   | id, parent_id, school_id, device_token, status |
| teachers         | Teacher accounts | id, school_id, email, password                 |
| schools          | School info      | id, name, code                                 |
| locations        | GPS tracking     | child_id, latitude, longitude, speed           |
| activities       | Daily activities | child_id, title, activity_type, activity_time  |
| messages         | Communication    | sender_type, receiver_type, child_id, message  |
| academic_records | Grades/marks     | child_id, teacher_id, subject, marks, grade    |
| attendance       | Daily attendance | child_id, attendance_date, status              |
| health_records   | Health tracking  | child_id, meal_type, hydration, mood           |
| milestones       | Achievements     | child_id, title, badge_emoji, achieved_date    |

## 🐛 Troubleshooting

### Database Connection Error

- Check MySQL service is running
- Verify credentials in `backend/config.php`
- Ensure database exists (run setup script)

### API Not Working

- Check CORS headers in `config.php`
- Verify Apache mod_rewrite is enabled
- Check PHP error logs

### Location Not Updating

- Verify child_id is correct
- Check API endpoint in browser console
- Ensure location.php has write permissions

### Login Failed

- Clear browser cache and localStorage
- Verify user exists in database
- Check password encryption matches

## 🚀 Deployment to Production

1. **Security Updates**

   - Change all default passwords
   - Disable error reporting in config.php
   - Enable HTTPS
   - Add input validation and sanitization
   - Implement rate limiting

2. **Database**

   - Use strong MySQL password
   - Create backup strategy
   - Restrict database user permissions

3. **File Permissions**

   - Set proper file permissions (644 for files, 755 for directories)
   - Protect sensitive files from direct access

4. **Environment Variables**
   - Move sensitive config to environment variables
   - Use .htaccess to protect backend folder

## 📝 Future Enhancements

- [ ] Email notifications
- [ ] SMS alerts for emergencies
- [ ] Photo/video sharing
- [ ] Calendar integration
- [ ] Mobile apps (iOS/Android)
- [ ] Real-time WebSocket communication
- [ ] Push notifications
- [ ] PDF report export
- [ ] Multi-language support
- [ ] Analytics dashboard

## 👥 Contributors

- Marion Angela - Full Stack Development

## 📄 License

This is a class project for educational purposes.

## 📞 Support

For issues or questions about this project, please contact your instructor or create an issue in the repository.

---

**Note**: This is a demonstration project. For production use, implement proper security measures, input validation, and follow industry best practices.

## ✅ Checklist for Submission

- [x] Database tables created
- [x] PHP backend APIs working
- [x] Parent registration and login
- [x] Teacher portal complete
- [x] Child device simulator functional
- [x] Live location tracking
- [x] Messaging system operational
- [x] Academic records and grades
- [x] Report card generation
- [x] Real-time data synchronization

**Project Status**: ✅ COMPLETE AND READY FOR USE
