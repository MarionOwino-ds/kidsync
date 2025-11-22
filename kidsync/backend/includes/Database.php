<?php
require_once __DIR__ . '/../config.php';

class Database {
    private $conn;
    
    public function __construct() {
        try {
            $this->conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
            
            if ($this->conn->connect_error) {
                throw new Exception("Connection failed: " . $this->conn->connect_error);
            }
            
            $this->conn->set_charset("utf8mb4");
        } catch (Exception $e) {
            die(json_encode(['success' => false, 'message' => $e->getMessage()]));
        }
    }
    
    public function getConnection() {
        return $this->conn;
    }
    
    public function query($sql) {
        $result = $this->conn->query($sql);
        if (!$result) {
            throw new Exception("Query failed: " . $this->conn->error);
        }
        return $result;
    }
    
    public function prepare($sql) {
        $stmt = $this->conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $this->conn->error);
        }
        return $stmt;
    }
    
    public function lastInsertId() {
        return $this->conn->insert_id;
    }
    
    public function escape($string) {
        return $this->conn->real_escape_string($string);
    }
    
    public function close() {
        if ($this->conn) {
            $this->conn->close();
        }
    }
}
?>
