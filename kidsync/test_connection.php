<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "Testing database connection...<br>";

// Test 1: Check if config exists
$configPath = __DIR__ . '/backend/config.php';
if (file_exists($configPath)) {
    echo "✅ Config file exists at: $configPath<br>";
    require_once $configPath;
} else {
    die("❌ Config file not found at: $configPath<br>");
}

// Test 2: Check if Database class exists
$dbClassPath = __DIR__ . '/backend/includes/Database.php';
if (file_exists($dbClassPath)) {
    echo "✅ Database class file exists at: $dbClassPath<br>";
    require_once $dbClassPath;
} else {
    die("❌ Database class not found at: $dbClassPath<br>");
}

// Test 3: Try to connect
try {
    $db = new Database();
    echo "✅ Database class instantiated<br>";
    
    $conn = $db->getConnection();
    echo "✅ Database connection established<br>";
    
    // Test 4: Check if tables exist
    $result = $conn->query("SHOW TABLES");
    $tables = [];
    while ($row = $result->fetch_array()) {
        $tables[] = $row[0];
    }
    
    echo "✅ Found " . count($tables) . " tables:<br>";
    foreach ($tables as $table) {
        echo "  - " . $table . "<br>";
    }
    
    // Test 5: Check schools table
    $result = $conn->query("SELECT * FROM schools WHERE code = 'SCH001'");
    if ($result && $result->num_rows > 0) {
        $school = $result->fetch_assoc();
        echo "✅ School found: " . $school['name'] . "<br>";
    } else {
        echo "❌ School SCH001 not found<br>";
    }
    
    echo "<br><strong>All tests passed! ✅</strong>";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "<br>";
}
?>
