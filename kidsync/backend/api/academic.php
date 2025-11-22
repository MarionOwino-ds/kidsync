<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../includes/Database.php';

$db = new Database();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $child_id = $_GET['child_id'] ?? 0;
    $type = $_GET['type'] ?? 'grades';
    
    if ($child_id == 0) {
        echo json_encode(['success' => false, 'message' => 'Child ID required']);
        exit;
    }
    
    if ($type === 'attendance') {
        // Get attendance records
        $sql = "SELECT a.*, t.first_name as teacher_first_name, t.last_name as teacher_last_name
                FROM attendance a
                LEFT JOIN teachers t ON a.marked_by = t.id
                WHERE a.child_id = ?
                ORDER BY a.attendance_date DESC
                LIMIT 30";
        
        $stmt = $db->prepare($sql);
        $stmt->bind_param('i', $child_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $attendance = [];
        while ($row = $result->fetch_assoc()) {
            $row['date'] = $row['attendance_date']; // Add 'date' field for consistency
            $attendance[] = $row;
        }
        
        echo json_encode([
            'success' => true,
            'attendance' => $attendance
        ]);
    } else {
        // Get academic records (grades)
        $sql = "SELECT ar.*, t.first_name as teacher_first_name, t.last_name as teacher_last_name
                FROM academic_records ar
                LEFT JOIN teachers t ON ar.teacher_id = t.id
                WHERE ar.child_id = ?
                ORDER BY ar.assessment_date DESC";
        
        $stmt = $db->prepare($sql);
        $stmt->bind_param('i', $child_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $grades = [];
        while ($row = $result->fetch_assoc()) {
            $grades[] = [
                'id' => $row['id'],
                'subject' => $row['subject'],
                'grade' => $row['grade'],
                'marks_obtained' => $row['marks_obtained'],
                'total_marks' => $row['total_marks'],
                'comments' => $row['comments'],
                'grade_date' => $row['assessment_date'],
                'teacher_name' => $row['teacher_first_name'] . ' ' . $row['teacher_last_name']
            ];
        }
        
        echo json_encode([
            'success' => true,
            'grades' => $grades,
            'records' => $grades // Keep both for backward compatibility
        ]);
    }
    
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $required = ['child_id', 'teacher_id', 'subject', 'assessment_type', 'marks_obtained', 'total_marks', 'assessment_date'];
    foreach ($required as $field) {
        if (!isset($data[$field])) {
            echo json_encode(['success' => false, 'message' => 'Missing field: ' . $field]);
            exit;
        }
    }
    
    // Calculate grade
    $percentage = ($data['marks_obtained'] / $data['total_marks']) * 100;
    $grade = 'F';
    if ($percentage >= 90) $grade = 'A';
    elseif ($percentage >= 80) $grade = 'B';
    elseif ($percentage >= 70) $grade = 'C';
    elseif ($percentage >= 60) $grade = 'D';
    elseif ($percentage >= 50) $grade = 'E';
    
    $comments = $data['comments'] ?? '';
    
    $stmt = $db->prepare("INSERT INTO academic_records (child_id, teacher_id, subject, assessment_type, marks_obtained, total_marks, grade, comments, assessment_date) 
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param('iissddsss', $data['child_id'], $data['teacher_id'], $data['subject'], $data['assessment_type'], 
                      $data['marks_obtained'], $data['total_marks'], $grade, $comments, $data['assessment_date']);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Academic record added',
            'record_id' => $db->lastInsertId(),
            'grade' => $grade
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to add record']);
    }
    
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$db->close();
?>
