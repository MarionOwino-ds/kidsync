<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../includes/Database.php';

$db = new Database();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $child_id = $_GET['child_id'] ?? 0;
    $teacher_id = $_GET['teacher_id'] ?? 0;
    $date = $_GET['date'] ?? date('Y-m-d');
    
    if ($teacher_id > 0) {
        // Teacher viewing all their students' activities (by school)
        $sql = "SELECT a.id, a.title, a.description, a.activity_type, a.icon, 
                       a.activity_time as activity_date, a.created_by,
                       CONCAT(c.first_name, ' ', c.last_name) as child_name
                FROM activities a
                JOIN children c ON a.child_id = c.id
                JOIN teachers t ON c.school_id = t.school_id
                WHERE t.id = ?
                ORDER BY a.activity_time DESC
                LIMIT 100";
        $stmt = $db->prepare($sql);
        $stmt->bind_param('i', $teacher_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $activities = [];
        while ($row = $result->fetch_assoc()) {
            $activities[] = $row;
        }
        echo json_encode([
            'success' => true,
            'activities' => $activities
        ]);
        exit;
    }
    
    if ($child_id == 0) {
        echo json_encode(['success' => false, 'message' => 'Child ID or Teacher ID required']);
        exit;
    }
    
    $sql = "SELECT id, title, description, activity_type, icon, activity_time, created_by
            FROM activities
            WHERE child_id = ? AND DATE(activity_time) = ?
            ORDER BY activity_time DESC";
    
    $stmt = $db->prepare($sql);
    $stmt->bind_param('is', $child_id, $date);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $activities = [];
    while ($row = $result->fetch_assoc()) {
        $activities[] = $row;
    }
    
    echo json_encode([
        'success' => true,
        'activities' => $activities
    ]);
    
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $child_id = $data['child_id'] ?? 0;
    $activity_type = $data['activity_type'] ?? 'other';
    $description = $data['description'] ?? '';
    $activity_date = $data['activity_date'] ?? date('Y-m-d H:i:s');
    
    if ($child_id == 0 || empty($activity_type)) {
        echo json_encode(['success' => false, 'message' => 'Child ID and activity type required']);
        exit;
    }
    
    // Auto-generate title from activity type
    $title = ucfirst($activity_type);
    $icon = '📝'; // Default icon
    $created_by = 'teacher';
    
    $stmt = $db->prepare("INSERT INTO activities (child_id, title, description, activity_type, icon, activity_time, created_by) 
                         VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param('issssss', $child_id, $title, $description, $activity_type, $icon, $activity_date, $created_by);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Activity added',
            'activity_id' => $db->lastInsertId()
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to add activity']);
    }
    
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$db->close();
?>
