<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../includes/Database.php';

$db = new Database();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $sender_type = $_GET['sender_type'] ?? '';
    $sender_id = $_GET['sender_id'] ?? 0;
    $receiver_type = $_GET['receiver_type'] ?? '';
    $receiver_id = $_GET['receiver_id'] ?? 0;
    $child_id = $_GET['child_id'] ?? 0;
    
    if (empty($sender_type) || $sender_id == 0) {
        echo json_encode(['success' => false, 'message' => 'Sender info required']);
        exit;
    }
    
    // Get messages for this conversation
    $sql = "SELECT m.*, 
                   CASE 
                       WHEN m.sender_type = 'parent' THEN CONCAT(u.first_name, ' ', u.last_name)
                       WHEN m.sender_type = 'teacher' THEN CONCAT(t.first_name, ' ', t.last_name)
                   END as sender_name
            FROM messages m
            LEFT JOIN users u ON m.sender_type = 'parent' AND m.sender_id = u.id
            LEFT JOIN teachers t ON m.sender_type = 'teacher' AND m.sender_id = t.id
            WHERE ((m.sender_type = ? AND m.sender_id = ?) OR (m.receiver_type = ? AND m.receiver_id = ?))";
    
    if ($child_id > 0) {
        $sql .= " AND m.child_id = ?";
    }
    
    $sql .= " ORDER BY m.sent_at DESC LIMIT 50";
    
    $stmt = $db->prepare($sql);
    if ($child_id > 0) {
        $stmt->bind_param('sisii', $sender_type, $sender_id, $sender_type, $sender_id, $child_id);
    } else {
        $stmt->bind_param('sisi', $sender_type, $sender_id, $sender_type, $sender_id);
    }
    $stmt->execute();
    $result = $stmt->get_result();
    
    $messages = [];
    while ($row = $result->fetch_assoc()) {
        $messages[] = $row;
    }
    
    echo json_encode([
        'success' => true,
        'messages' => array_reverse($messages)
    ]);
    
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $sender_type = $data['sender_type'] ?? '';
    $sender_id = $data['sender_id'] ?? 0;
    $receiver_type = $data['receiver_type'] ?? '';
    $receiver_id = $data['receiver_id'] ?? 0;
    $child_id = $data['child_id'] ?? null;
    $message = $data['message'] ?? '';
    
    if (empty($sender_type) || $sender_id == 0 || empty($receiver_type) || $receiver_id == 0 || empty($message)) {
        echo json_encode(['success' => false, 'message' => 'All fields required']);
        exit;
    }
    
    $stmt = $db->prepare("INSERT INTO messages (sender_type, sender_id, receiver_type, receiver_id, child_id, message) 
                         VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param('sisiis', $sender_type, $sender_id, $receiver_type, $receiver_id, $child_id, $message);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Message sent',
            'message_id' => $db->lastInsertId()
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to send message']);
    }
    
} elseif ($method === 'PUT') {
    // Mark messages as read
    $data = json_decode(file_get_contents('php://input'), true);
    
    $message_ids = $data['message_ids'] ?? [];
    
    if (empty($message_ids)) {
        echo json_encode(['success' => false, 'message' => 'Message IDs required']);
        exit;
    }
    
    $placeholders = implode(',', array_fill(0, count($message_ids), '?'));
    $sql = "UPDATE messages SET is_read = 1 WHERE id IN ($placeholders)";
    $stmt = $db->prepare($sql);
    
    $types = str_repeat('i', count($message_ids));
    $stmt->bind_param($types, ...$message_ids);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Messages marked as read']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update messages']);
    }
    
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$db->close();
?>
