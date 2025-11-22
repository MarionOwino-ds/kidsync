<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../includes/Database.php';

$db = new Database();
$conn = $db->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $email = $db->escape($data['email'] ?? '');
    $password = $data['password'] ?? '';
    
    if (empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Email and password required']);
        exit;
    }
    
    // Check in users table (parents)
    $stmt = $db->prepare("SELECT id, first_name, last_name, email, phone, password, 'parent' as role FROM users WHERE email = ?");
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        
        if (password_verify($password, $user['password'])) {
            unset($user['password']);
            
            // Get children
            $stmt2 = $db->prepare("SELECT c.*, s.name as school_name FROM children c LEFT JOIN schools s ON c.school_id = s.id WHERE c.parent_id = ?");
            $stmt2->bind_param('i', $user['id']);
            $stmt2->execute();
            $children_result = $stmt2->get_result();
            $children = [];
            while ($child = $children_result->fetch_assoc()) {
                $children[] = $child;
            }
            
            echo json_encode([
                'success' => true,
                'message' => 'Login successful',
                'user' => $user,
                'children' => $children
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid password']);
        }
    } else {
        // Check in teachers table
        $stmt = $db->prepare("SELECT id, first_name, last_name, email, phone, password, school_id, 'teacher' as role FROM teachers WHERE email = ?");
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            
            if (password_verify($password, $user['password'])) {
                unset($user['password']);
                echo json_encode([
                    'success' => true,
                    'message' => 'Login successful',
                    'user' => $user
                ]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Invalid password']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'User not found']);
        }
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$db->close();
?>
