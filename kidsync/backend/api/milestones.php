<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../includes/Database.php';

$db = new Database();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $child_id = $_GET['child_id'] ?? 0;
    $teacher_id = $_GET['teacher_id'] ?? 0;
    
    if ($teacher_id > 0) {
        // Teacher viewing all their students' milestones
        $sql = "SELECT m.id, m.child_id, m.milestone_title, m.description, 
                       m.achieved_date, m.badge_icon,
                       CONCAT(c.first_name, ' ', c.last_name) as child_name
                FROM milestones m
                JOIN children c ON m.child_id = c.id
                WHERE c.school_id = (SELECT school_id FROM teachers WHERE id = ?)
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
    
    $sql = "SELECT id, milestone_title, description, achieved_date, badge_icon, category
            FROM milestones
            WHERE child_id = ?
            ORDER BY achieved_date DESC";
    
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
    $milestone_title = $data['milestone_title'] ?? '';
    $description = $data['description'] ?? '';
    $achieved_date = $data['achieved_date'] ?? date('Y-m-d');
    $badge_icon = $data['badge_icon'] ?? '⭐';
    $category = $data['category'] ?? 'general';
    
    if ($child_id == 0 || empty($milestone_title)) {
        echo json_encode(['success' => false, 'message' => 'Child ID and milestone title required']);
        exit;
    }
    
    $stmt = $db->prepare("INSERT INTO milestones (child_id, milestone_title, description, achieved_date, badge_icon, category) 
                         VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param('isssss', $child_id, $milestone_title, $description, $achieved_date, $badge_icon, $category);
    
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
