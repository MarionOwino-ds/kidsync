<?php

require_once __DIR__ . '/error_handling_template.php';
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../includes/Database.php';

$db = new Database();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $child_id = $_GET['child_id'] ?? 0;
    $teacher_id = $_GET['teacher_id'] ?? 0;
    
    if ($teacher_id > 0) {
        $sql = "SELECT hr.id, hr.child_id, hr.meal_type, hr.meal_description, hr.hydration_cups, hr.sleep_hours, hr.mood, hr.temperature, hr.notes, hr.record_date,
                       CONCAT(c.first_name, ' ', c.last_name) as child_name
                FROM health_records hr
                JOIN children c ON hr.child_id = c.id
                JOIN teachers t ON c.school_id = t.school_id
                WHERE t.id = ?
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
    
    $sql = "SELECT id, record_date, meal_type, meal_description, hydration_cups, sleep_hours, mood, temperature, notes
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
    $meal_type = $data['meal_type'] ?? null;
    $meal_description = $data['meal_description'] ?? '';
    $hydration_cups = $data['hydration_cups'] ?? 0;
    $sleep_hours = $data['sleep_hours'] ?? 0;
    $mood = $data['mood'] ?? '';
    $temperature = $data['temperature'] ?? null;
    $notes = $data['notes'] ?? '';
    
    if ($child_id == 0) {
        echo json_encode(['success' => false, 'message' => 'Child ID required']);
        exit;
    }
    
    $stmt = $db->prepare("INSERT INTO health_records (child_id, record_date, meal_type, meal_description, hydration_cups, sleep_hours, mood, temperature, notes) 
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param('issdiisss', $child_id, $record_date, $meal_type, $meal_description, $hydration_cups, $sleep_hours, $mood, $temperature, $notes);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Health record added',
            'record_id' => $db->insert_id
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to add health record']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$db->close();

?>
