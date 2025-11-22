<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../includes/Database.php';

$db = new Database();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $parent_id = $_GET['parent_id'] ?? 0;
    
    if ($parent_id == 0) {
        echo json_encode(['success' => false, 'message' => 'Parent ID required']);
        exit;
    }
    
    // Get all children for this parent with their latest data
    $sql = "SELECT 
                c.id, c.first_name, c.last_name, c.age, c.grade, c.status, c.avatar_emoji, c.device_token,
                s.name as school_name, s.code as school_code,
                (SELECT COUNT(*) FROM messages WHERE child_id = c.id AND receiver_type = 'parent' AND is_read = 0) as unread_messages
            FROM children c
            LEFT JOIN schools s ON c.school_id = s.id
            WHERE c.parent_id = ?
            ORDER BY c.created_at DESC";
    
    $stmt = $db->prepare($sql);
    $stmt->bind_param('i', $parent_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $children = [];
    while ($child = $result->fetch_assoc()) {
        // Get latest location
        $loc_stmt = $db->prepare("SELECT latitude, longitude, speed, location_name, timestamp 
                                   FROM locations WHERE child_id = ? 
                                   ORDER BY timestamp DESC LIMIT 1");
        $loc_stmt->bind_param('i', $child['id']);
        $loc_stmt->execute();
        $loc_result = $loc_stmt->get_result();
        $child['location'] = $loc_result->num_rows > 0 ? $loc_result->fetch_assoc() : null;
        
        // Get today's activities count
        $act_stmt = $db->prepare("SELECT COUNT(*) as count FROM activities 
                                   WHERE child_id = ? AND DATE(activity_time) = CURDATE()");
        $act_stmt->bind_param('i', $child['id']);
        $act_stmt->execute();
        $act_result = $act_stmt->get_result();
        $child['activities_today'] = $act_result->fetch_assoc()['count'];
        
        $children[] = $child;
    }
    
    echo json_encode([
        'success' => true,
        'children' => $children
    ]);
    
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$db->close();
?>
