<?php
require_once '../config.php';
require_once 'Database.php';

// Create database if not exists
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "CREATE DATABASE IF NOT EXISTS " . DB_NAME . " CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
if ($conn->query($sql) === TRUE) {
    echo "Database created successfully or already exists\n";
} else {
    die("Error creating database: " . $conn->error);
}
$conn->close();

// Now connect to the database
$db = new Database();
$conn = $db->getConnection();

// Users Table (Parents)
$sql = "CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('parent', 'admin') DEFAULT 'parent',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
$db->query($sql);
echo "Users table created\n";

// Schools Table
$sql = "CREATE TABLE IF NOT EXISTS schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
$db->query($sql);
echo "Schools table created\n";

// Teachers Table
$sql = "CREATE TABLE IF NOT EXISTS teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    school_id INT NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    subject VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    INDEX idx_email (email),
    INDEX idx_school (school_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
$db->query($sql);
echo "Teachers table created\n";

// Children Table
$sql = "CREATE TABLE IF NOT EXISTS children (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parent_id INT NOT NULL,
    school_id INT NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    grade VARCHAR(50) NOT NULL,
    device_token VARCHAR(255) UNIQUE,
    status ENUM('home', 'on-bus', 'at-school') DEFAULT 'home',
    avatar_emoji VARCHAR(10) DEFAULT '🧒',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    INDEX idx_parent (parent_id),
    INDEX idx_school (school_id),
    INDEX idx_device_token (device_token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
$db->query($sql);
echo "Children table created\n";

// Locations Table (GPS Tracking)
$sql = "CREATE TABLE IF NOT EXISTS locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    child_id INT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    speed DECIMAL(5, 2) DEFAULT 0,
    location_name VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
    INDEX idx_child (child_id),
    INDEX idx_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
$db->query($sql);
echo "Locations table created\n";

// Activities Table
$sql = "CREATE TABLE IF NOT EXISTS activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    child_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    activity_type ENUM('meal', 'class', 'play', 'transport', 'other') DEFAULT 'other',
    icon VARCHAR(10) DEFAULT '📝',
    activity_time DATETIME NOT NULL,
    created_by ENUM('system', 'teacher', 'parent') DEFAULT 'system',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
    INDEX idx_child (child_id),
    INDEX idx_time (activity_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
$db->query($sql);
echo "Activities table created\n";

// Health Records Table
$sql = "CREATE TABLE IF NOT EXISTS health_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    child_id INT NOT NULL,
    meal_type ENUM('breakfast', 'lunch', 'snack', 'dinner'),
    meal_description TEXT,
    hydration_cups INT DEFAULT 0,
    sleep_hours DECIMAL(3, 1) DEFAULT 0,
    mood VARCHAR(50),
    temperature DECIMAL(3, 1),
    notes TEXT,
    record_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
    INDEX idx_child (child_id),
    INDEX idx_date (record_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
$db->query($sql);
echo "Health records table created\n";

// Milestones Table
$sql = "CREATE TABLE IF NOT EXISTS milestones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    child_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    badge_emoji VARCHAR(10),
    achieved_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
    INDEX idx_child (child_id),
    INDEX idx_date (achieved_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
$db->query($sql);
echo "Milestones table created\n";

// Messages Table
$sql = "CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_type ENUM('parent', 'teacher') NOT NULL,
    sender_id INT NOT NULL,
    receiver_type ENUM('parent', 'teacher') NOT NULL,
    receiver_id INT NOT NULL,
    child_id INT,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
    INDEX idx_sender (sender_type, sender_id),
    INDEX idx_receiver (receiver_type, receiver_id),
    INDEX idx_child (child_id),
    INDEX idx_timestamp (sent_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
$db->query($sql);
echo "Messages table created\n";

// Academic Records Table (Marks, Report Cards)
$sql = "CREATE TABLE IF NOT EXISTS academic_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    child_id INT NOT NULL,
    teacher_id INT NOT NULL,
    subject VARCHAR(100) NOT NULL,
    assessment_type ENUM('test', 'exam', 'assignment', 'project') NOT NULL,
    marks_obtained DECIMAL(5, 2) NOT NULL,
    total_marks DECIMAL(5, 2) NOT NULL,
    grade VARCHAR(5),
    comments TEXT,
    assessment_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
    INDEX idx_child (child_id),
    INDEX idx_teacher (teacher_id),
    INDEX idx_date (assessment_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
$db->query($sql);
echo "Academic records table created\n";

// Attendance Table
$sql = "CREATE TABLE IF NOT EXISTS attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    child_id INT NOT NULL,
    attendance_date DATE NOT NULL,
    status ENUM('present', 'absent', 'late', 'excused') DEFAULT 'present',
    arrival_time TIME,
    notes TEXT,
    marked_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
    FOREIGN KEY (marked_by) REFERENCES teachers(id) ON DELETE SET NULL,
    UNIQUE KEY unique_attendance (child_id, attendance_date),
    INDEX idx_child (child_id),
    INDEX idx_date (attendance_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
$db->query($sql);
echo "Attendance table created\n";

// Insert sample school
$sql = "INSERT INTO schools (name, code, address, phone, email) VALUES 
('Nairobi Primary School', 'SCH001', 'Nairobi, Kenya', '+254 700 000 000', 'info@nairobiprimary.ac.ke')
ON DUPLICATE KEY UPDATE name=name";
$db->query($sql);
echo "Sample school inserted\n";

// Insert sample teacher
$sql = "INSERT INTO teachers (school_id, first_name, last_name, email, phone, password, subject) VALUES 
(1, 'Jane', 'Smith', 'teacher@demo.com', '+254 700 000 001', '" . password_hash('teacher123', PASSWORD_DEFAULT) . "', 'Mathematics')
ON DUPLICATE KEY UPDATE email=email";
$db->query($sql);
echo "Sample teacher inserted\n";

// Insert demo parent
$sql = "INSERT INTO users (first_name, last_name, email, phone, password) VALUES 
('Marion', 'Angela', 'parent@demo.com', '+254 700 000 002', '" . password_hash('demo123', PASSWORD_DEFAULT) . "')
ON DUPLICATE KEY UPDATE email=email";
$db->query($sql);
echo "Demo parent inserted\n";

echo "\n✅ All database tables created successfully!\n";
echo "Demo Accounts:\n";
echo "Parent: parent@demo.com / demo123\n";
echo "Teacher: teacher@demo.com / teacher123\n";

$db->close();
?>
