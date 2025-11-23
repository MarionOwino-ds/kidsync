<?php
// Centralized error and exception handling for JSON API responses

// Turn off default error display, enable error logging only (done in config.php)
// error_reporting(E_ALL);
// ini_set('display_errors', 0);

ob_start();

// Convert PHP warnings and notices to ErrorException for catch
set_error_handler(function($severity, $message, $file, $line) {
    if (!(error_reporting() & $severity)) {
        // This error code is not included in error_reporting
        return;
    }
    throw new ErrorException($message, 0, $severity, $file, $line);
});

// Unexpected shutdown errors (fatal etc)
register_shutdown_function(function() {
    $error = error_get_last();
    if ($error !== NULL) {
        if (ob_get_length()) {
            ob_end_clean();
        }
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'message' => 'Fatal error: '.$error['message'].' in '.$error['file'].' on line '.$error['line']
        ]);
        exit;
    }
});

// Global exception handler
set_exception_handler(function($exception) {
    if (ob_get_length()) {
        ob_end_clean();
    }
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Exception: '.$exception->getMessage()
    ]);
    exit;
});

// Usage in each API:
// include_once "error_handling_template.php";
// then API code, wrapped in try/catch as needed, but errors upgraded to exceptions here

?>
