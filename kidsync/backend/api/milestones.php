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
        // Teacher viewing all their students' milestones (by school)
        $sql = "SELECT m.id, m.child_id, m.title, m.description, m.badge_emoji, m.achieved_date,
                       CONCAT(c.first_name, ' ', c.last_name) as child_name
                FROM milestones m
                JOIN children c ON m.child_id = c.id
                JOIN teachers t ON c.school_id = t.school_id
                WHERE t.id = ?
                ORDER BY m.achieved_date DESC
                LIMIT 100";
        $stmt = $db->prepare($sql);
        $stmt->bind_param('i', $teacher_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $milestones = [];
        while ($row = $result->fetch_assoc()) {
            $milestones[] = $row;
        }
        
        echo json_encode([
            'success' => true,
            'milestones' => $milestones
        ]);
        exit;
    }
    
    if ($child_id == 0) {
        echo json_encode(['success' => false, 'message' => 'Child ID or Teacher ID required']);
        exit;
    }
    
    $sql = "SELECT id, milestone_date, description
            FROM milestones
            WHERE child_id = ?
            ORDER BY milestone_date DESC
            LIMIT 30";
    $stmt = $db->prepare($sql);
    $stmt->bind_param('i', $child_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $milestones = [];
    while ($row = $result->fetch_assoc()) {
        $milestones[] = $row;
    }
    
    echo json_encode([
        'success' => true,
        'milestones' => $milestones
    ]);
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $child_id = $data['child_id'] ?? 0;
    $milestone_date = $data['milestone_date'] ?? date('Y-m-d');
    $description = $data['description'] ?? '';
    
    if ($child_id == 0) {
        echo json_encode(['success' => false, 'message' => 'Child ID required']);
        exit;
    }
    
    $stmt = $db->prepare("INSERT INTO milestones (child_id, milestone_date, description) VALUES (?, ?, ?)");
    $stmt->bind_param('iss', $child_id, $milestone_date, $description);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Milestone added',
            'milestone_id' => $db->lastInsertId()
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to add milestone']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$db->close();

?>
