# 🔑 KidSync Demo Credentials & Access Codes

## 🏫 School Codes

### Nairobi Primary School

```
Code: SCH001
```

**Use this code when registering as a parent**

---

## 👨‍👩‍👧 Parent Demo Account

```
Email: parent@demo.com
Password: demo123
```

**Features:**

- View 2 demo children (Emma Johnson, Liam Johnson)
- Access all parent portal features
- Track location, activities, health, milestones
- Receive messages from teachers

---

## 👩‍🏫 Teacher Demo Account

```
Email: teacher@demo.com
Password: teacher123
```

**Features:**

- Manage students in Grade 1A
- Post grades and attendance
- Send messages to parents
- View student profiles

---

## 📱 Quick Start

1. **Setup Database**: http://localhost/kidsync/SETUP.html
2. **Register New Parent**: http://localhost/kidsync/src/html/signup.html
   - Use school code: **SCH001**
3. **Login**: http://localhost/kidsync/src/html/login.html
4. **Access Dashboard**: http://localhost/kidsync/src/html/dashboard.html

---

## 🎯 Testing Child Device Simulator

After logging in as parent:

1. Go to Dashboard
2. Copy the Child ID from any child card
3. Open simulator: `http://localhost/kidsync/child-device/index.html?child_id=1`
4. Watch live GPS updates on parent's location page

---

## 📝 Notes

- **School Code is required** during parent registration
- Only **SCH001** is available in the demo database
- Password must be at least 6 characters
- Teachers are assigned to specific grades (e.g., Grade 1A)
- All data is stored in `kidsync_db` MySQL database
