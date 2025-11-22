<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../includes/Database.php';

$db = new Database();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $child_id = $_GET['child_id'] ?? 0;
    $teacher_id = $_GET['teacher_id'] ?? 0;
    
    if ($teacher_id > 0) {
        // Teacher viewing all their students' health records
        $sql = "SELECT hr.id, hr.child_id, hr.record_date, hr.meals_today, 
                       hr.sleep_hours, hr.notes,
                       CONCAT(c.first_name, ' ', c.last_name) as child_name
                FROM health_records hr
                JOIN children c ON hr.child_id = c.id
                WHERE c.school_id = (SELECT school_id FROM teachers WHERE id = ?)
                ORDER BY hr.record_date DESC
                LIMIT 100";
        
        $stmt = $db->prepare($sql);
        $stmt->bind_param('i', $teacher_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $health_records = [];
        while ($row = $result->fetch_assoc()) {
            $health_records[] = $row;
        }
        
        echo json_encode([
            'success' => true,
            'health_records' => $health_records
        ]);
        exit;
    }
    
    if ($child_id == 0) {
        echo json_encode(['success' => false, 'message' => 'Child ID or Teacher ID required']);
        exit;
    }
    
    $sql = "SELECT id, record_date, meals_today, sleep_hours, water_intake, notes
            FROM health_records
            WHERE child_id = ?
            ORDER BY record_date DESC
            LIMIT 30";
    
    $stmt = $db->prepare($sql);
    $stmt->bind_param('i', $child_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $health_records = [];
    while ($row = $result->fetch_assoc()) {
        $health_records[] = $row;
    }
    
    echo json_encode([
        'success' => true,
        'health_records' => $health_records
    ]);
    
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $child_id = $data['child_id'] ?? 0;
    $record_date = $data['record_date'] ?? date('Y-m-d');
    $meals_today = $data['meals_today'] ?? '';
    $sleep_hours = $data['sleep_hours'] ?? 0;
    $water_intake = $data['water_intake'] ?? 0;
    $notes = $data['notes'] ?? '';
    
    if ($child_id == 0) {
        echo json_encode(['success' => false, 'message' => 'Child ID required']);
        exit;
    }
    
    $stmt = $db->prepare("INSERT INTO health_records (child_id, record_date, meals_today, sleep_hours, water_intake, notes) 
                         VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param('issdds', $child_id, $record_date, $meals_today, $sleep_hours, $water_intake, $notes);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Health record added',
            'record_id' => $db->lastInsertId()
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to add health record']);
    }
    
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$db->close();
?>
