<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../includes/Database.php';

$db = new Database();
$conn = $db->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Validate input
    $required = ['firstName', 'lastName', 'email', 'phone', 'password', 'childFirstName', 'childLastName', 'childAge', 'childGrade', 'schoolCode'];
    foreach ($required as $field) {
        if (empty($data[$field])) {
            echo json_encode(['success' => false, 'message' => 'Missing required field: ' . $field]);
            exit;
        }
    }
    
    // Check if email already exists
    $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param('s', $data['email']);
    $stmt->execute();
    if ($stmt->get_result()->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Email already registered']);
        exit;
    }
    
    // Check if school exists
    $stmt = $db->prepare("SELECT id FROM schools WHERE code = ?");
    $stmt->bind_param('s', $data['schoolCode']);
    $stmt->execute();
    $school_result = $stmt->get_result();
    if ($school_result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Invalid school code']);
        exit;
    }
    $school = $school_result->fetch_assoc();
    
    // Start transaction
    $conn->begin_transaction();
    
    try {
        // Insert parent
        $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
        $stmt = $db->prepare("INSERT INTO users (first_name, last_name, email, phone, password) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param('sssss', $data['firstName'], $data['lastName'], $data['email'], $data['phone'], $hashedPassword);
        $stmt->execute();
        $parent_id = $db->lastInsertId();
        
        // Insert child
        $device_token = bin2hex(random_bytes(16));
        $stmt = $db->prepare("INSERT INTO children (parent_id, school_id, first_name, last_name, age, grade, device_token) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param('iississ', $parent_id, $school['id'], $data['childFirstName'], $data['childLastName'], $data['childAge'], $data['childGrade'], $device_token);
        $stmt->execute();
        $child_id = $db->lastInsertId();
        
        $conn->commit();
        
        echo json_encode([
            'success' => true,
            'message' => 'Account created successfully',
            'parent_id' => $parent_id,
            'child_id' => $child_id,
            'device_token' => $device_token
        ]);
        
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(['success' => false, 'message' => 'Registration failed: ' . $e->getMessage()]);
    }
    
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$db->close();
?>
