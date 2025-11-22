<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../includes/Database.php';

$db = new Database();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $child_id = $_GET['child_id'] ?? 0;
    
    if ($child_id == 0) {
        echo json_encode(['success' => false, 'message' => 'Child ID required']);
        exit;
    }
    
    // Get latest location
    $stmt = $db->prepare("SELECT * FROM locations WHERE child_id = ? ORDER BY timestamp DESC LIMIT 1");
    $stmt->bind_param('i', $child_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        echo json_encode([
            'success' => true,
            'location' => $result->fetch_assoc()
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'No location data available'
        ]);
    }
    
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $child_id = $data['child_id'] ?? 0;
    $latitude = $data['latitude'] ?? 0;
    $longitude = $data['longitude'] ?? 0;
    $speed = $data['speed'] ?? 0;
    $location_name = $data['location_name'] ?? '';
    
    if ($child_id == 0) {
        echo json_encode(['success' => false, 'message' => 'Child ID required']);
        exit;
    }
    
    $stmt = $db->prepare("INSERT INTO locations (child_id, latitude, longitude, speed, location_name) 
                         VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param('iddds', $child_id, $latitude, $longitude, $speed, $location_name);
    
    if ($stmt->execute()) {
        // Update child status based on location
        $status = 'home';
        if ($speed > 10) {
            $status = 'on-bus';
        } elseif (stripos($location_name, 'school') !== false) {
            $status = 'at-school';
        }
        
        $update_stmt = $db->prepare("UPDATE children SET status = ? WHERE id = ?");
        $update_stmt->bind_param('si', $status, $child_id);
        $update_stmt->execute();
        
        echo json_encode([
            'success' => true,
            'message' => 'Location updated',
            'location_id' => $db->lastInsertId()
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update location']);
    }
    
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$db->close();
?>
