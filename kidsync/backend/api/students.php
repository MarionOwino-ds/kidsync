<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../includes/Database.php';

$db = new Database();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $teacher_id = $_GET['teacher_id'] ?? 0;
    $school_id = $_GET['school_id'] ?? 0;
    
    if ($teacher_id == 0 && $school_id == 0) {
        echo json_encode(['success' => false, 'message' => 'Teacher ID or School ID required']);
        exit;
    }
    
    $sql = "SELECT c.*, 
                   CONCAT(u.first_name, ' ', u.last_name) as parent_name,
                   u.phone as parent_phone,
                   s.name as school_name
            FROM children c
            LEFT JOIN users u ON c.parent_id = u.id
            LEFT JOIN schools s ON c.school_id = s.id";
    
    if ($school_id > 0) {
        $sql .= " WHERE c.school_id = ?";
        $stmt = $db->prepare($sql);
        $stmt->bind_param('i', $school_id);
    } else {
        // Get students from teacher's school
        $sql .= " WHERE c.school_id = (SELECT school_id FROM teachers WHERE id = ?)";
        $stmt = $db->prepare($sql);
        $stmt->bind_param('i', $teacher_id);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    
    $students = [];
    while ($row = $result->fetch_assoc()) {
        $students[] = $row;
    }
    
    echo json_encode([
        'success' => true,
        'students' => $students
    ]);
    
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$db->close();
?>
