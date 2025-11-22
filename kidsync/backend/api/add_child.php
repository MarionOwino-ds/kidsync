<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../includes/Database.php';

$db = new Database();
$conn = $db->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Validate input
    $required = ['parent_id', 'first_name', 'last_name', 'age', 'grade', 'school_code'];
    foreach ($required as $field) {
        if (empty($data[$field])) {
            echo json_encode(['success' => false, 'message' => 'Missing required field: ' . $field]);
            exit;
        }
    }
    
    // Check if school exists
    $stmt = $db->prepare("SELECT id FROM schools WHERE code = ?");
    $stmt->bind_param('s', $data['school_code']);
    $stmt->execute();
    $school_result = $stmt->get_result();
    
    if ($school_result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Invalid school code']);
        exit;
    }
    
    $school = $school_result->fetch_assoc();
    
    try {
        // Generate device token
        $device_token = bin2hex(random_bytes(16));
        
        // Insert child
        $stmt = $db->prepare("INSERT INTO children (parent_id, school_id, first_name, last_name, age, grade, device_token) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param('iississ', 
            $data['parent_id'], 
            $school['id'], 
            $data['first_name'], 
            $data['last_name'], 
            $data['age'], 
            $data['grade'], 
            $device_token
        );
        
        if ($stmt->execute()) {
            $child_id = $db->lastInsertId();
            
            echo json_encode([
                'success' => true,
                'message' => 'Child added successfully',
                'child_id' => $child_id,
                'device_token' => $device_token
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to add child']);
        }
        
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    }
    
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$db->close();
?>
