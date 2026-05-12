<?php
require_once 'config.php';

$request_method = $_SERVER['REQUEST_METHOD'];

handleAPI($request_method);

function handleAPI($request_method) {
    $input = getJsonInput();
    $action = $_GET['action'] ?? null;

    switch ($action) {
        case 'login':
            ensureMethod($request_method, ['POST']);
            login($input);
            break;
        case 'register':
            ensureMethod($request_method, ['POST']);
            register($input);
            break;
        case 'logout':
            ensureMethod($request_method, ['POST']);
            logout();
            break;
        case 'getUser':
            ensureMethod($request_method, ['GET']);
            getUser();
            break;
        case 'announcements':
            handleAnnouncements($request_method, $input);
            break;
        case 'announcement':
            ensureMethod($request_method, ['GET']);
            getAnnouncement();
            break;
        case 'events':
            handleEvents($request_method, $input);
            break;
        case 'event':
            ensureMethod($request_method, ['GET']);
            getEvent();
            break;
        case 'officials':
            handleOfficials($request_method, $input);
            break;
        case 'hotlines':
            handleHotlines($request_method, $input);
            break;
        case 'users':
            handleUsers($request_method, $input);
            break;
        default:
            sendResponse('error', ['message' => 'Action not specified'], 400);
    }
}

function ensureMethod($request_method, $allowed_methods) {
    if (!in_array($request_method, $allowed_methods, true)) {
        sendResponse('error', ['message' => 'Method not allowed'], 405);
    }
}

function getJsonInput() {
    $raw = file_get_contents('php://input');
    if (!$raw) {
        return [];
    }

    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function getRequiredId() {
    $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
    if ($id <= 0) {
        sendResponse('error', ['message' => 'A valid id is required'], 400);
    }

    return $id;
}

function mapAnnouncement($row) {
    return [
        'id' => (string) $row['id'],
        'title' => $row['title'],
        'date' => $row['publish_date'],
        'category' => $row['category'],
        'featured' => (bool) $row['featured'],
        'summary' => $row['summary'],
        'content' => $row['content'],
        'image' => $row['image']
    ];
}

function mapEvent($row) {
    return [
        'id' => (string) $row['id'],
        'title' => $row['title'],
        'date' => $row['event_date'],
        'time' => $row['event_time'],
        'location' => $row['location'],
        'organizer' => $row['organizer'],
        'description' => $row['description'],
        'category' => $row['category']
    ];
}

function mapOfficial($row) {
    return [
        'id' => (string) $row['id'],
        'name' => $row['name'],
        'position' => $row['position'],
        'term' => $row['term_label'],
        'photo' => $row['photo'],
        'responsibilities' => $row['responsibilities']
    ];
}

function mapHotline($row) {
    return [
        'id' => (string) $row['id'],
        'name' => $row['name'],
        'number' => $row['number']
    ];
}

function mapUser($row) {
    return [
        'id' => (int) $row['id'],
        'name' => $row['name'],
        'email' => $row['email'],
        'role' => $row['role'],
        'firstName' => $row['first_name'],
        'middleName' => $row['middle_name'],
        'lastName' => $row['last_name'],
        'address' => $row['address'],
        'gender' => $row['gender'],
        'birthDate' => $row['birth_date'],
        'age' => $row['age'] !== null ? (int) $row['age'] : null,
        'registeredVoter' => (bool) $row['registered_voter'],
        'barangayId' => $row['barangay_id'],
        'username' => $row['username'],
        'validIdPhoto' => $row['valid_id_photo'],
        'schoolIdPhoto' => $row['school_id_photo']
    ];
}

function mapManagedUser($row) {
    $role = ucfirst($row['role']);
    $prefix = $row['role'] === 'admin' ? 'ADM' : ($row['role'] === 'staff' ? 'STF' : 'RES');
    $year = date('Y', strtotime((string) ($row['created_at'] ?? date('Y-m-d H:i:s'))));

    return [
        'id' => $prefix . '-' . $year . '-' . str_pad((string) $row['id'], 5, '0', STR_PAD_LEFT),
        'userId' => (int) $row['id'],
        'name' => $row['name'],
        'email' => $row['email'],
        'role' => $role,
        'status' => ucfirst($row['status'] ?? 'active'),
        'verified' => (bool) ($row['verified'] ?? 0),
        'username' => $row['username'] ?? '',
        'firstName' => $row['first_name'] ?? '',
        'middleName' => $row['middle_name'] ?? '',
        'lastName' => $row['last_name'] ?? '',
        'address' => $row['address'] ?? '',
        'gender' => $row['gender'] ?? '',
        'birthDate' => $row['birth_date'] ?? '',
        'age' => $row['age'] !== null ? (int) $row['age'] : null,
        'registeredVoter' => (bool) ($row['registered_voter'] ?? 0),
        'barangayId' => $row['barangay_id'] ?? '',
        'validIdPhoto' => $row['valid_id_photo'] ?? '',
        'schoolIdPhoto' => $row['school_id_photo'] ?? ''
    ];
}

function saveUploadedDataUrl($data_url, $prefix) {
    $data_url = trim((string) $data_url);
    if ($data_url === '') {
        return '';
    }

    if (!preg_match('/^data:([a-zA-Z0-9\/.+-]+);base64,(.+)$/', $data_url, $matches)) {
        return $data_url;
    }

    $mime_type = strtolower($matches[1]);
    $extensions = [
        'image/jpeg' => 'jpg',
        'image/jpg' => 'jpg',
        'image/png' => 'png',
        'image/gif' => 'gif',
        'image/webp' => 'webp',
        'application/pdf' => 'pdf'
    ];

    if (!isset($extensions[$mime_type])) {
        sendResponse('error', ['message' => 'Uploaded ID must be an image or PDF file'], 400);
    }

    $file_data = base64_decode($matches[2], true);
    if ($file_data === false) {
        sendResponse('error', ['message' => 'Uploaded ID file could not be read'], 400);
    }

    $upload_dir = __DIR__ . '/uploads/id-documents';
    if (!is_dir($upload_dir) && !mkdir($upload_dir, 0755, true)) {
        sendResponse('error', ['message' => 'Could not prepare upload folder'], 500);
    }

    $filename = $prefix . '-' . date('YmdHis') . '-' . bin2hex(random_bytes(6)) . '.' . $extensions[$mime_type];
    $target = $upload_dir . '/' . $filename;

    if (file_put_contents($target, $file_data) === false) {
        sendResponse('error', ['message' => 'Could not save uploaded ID file'], 500);
    }

    return 'uploads/id-documents/' . $filename;
}

function login($input) {
    global $conn;

    if ((!isset($input['email']) && !isset($input['username']) && !isset($input['identifier'])) || !isset($input['password'])) {
        sendResponse('error', ['message' => 'Email or username and password are required'], 400);
    }
    
    $identifier = trim((string) ($input['identifier'] ?? $input['email'] ?? $input['username']));
    $password = $input['password'];
    
    $stmt = $conn->prepare('SELECT id, name, email, role, password, status, first_name, middle_name, last_name, address, gender, birth_date, age, registered_voter, barangay_id, username, valid_id_photo, school_id_photo FROM users WHERE email = ? OR username = ? LIMIT 1');
    $stmt->bind_param('ss', $identifier, $identifier);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        sendResponse('error', ['message' => 'Invalid email or password'], 401);
    }

    $user = $result->fetch_assoc();

    if (!password_verify($password, $user['password'])) {
        sendResponse('error', ['message' => 'Invalid email or password'], 401);
    }

    if (in_array($user['role'], ['admin', 'staff'], true) && strtolower((string) ($user['status'] ?? 'inactive')) !== 'active') {
        sendResponse('error', ['message' => 'This account is inactive. Please contact an administrator.'], 403);
    }

    $_SESSION['user_id'] = (int) $user['id'];
    $_SESSION['user_email'] = $user['email'];
    
    sendResponse('success', [
        'message' => 'Login successful',
        'user' => mapUser($user)
    ]);
}

function register($input) {
    global $conn;
    
    $required_fields = ['firstName', 'lastName', 'username', 'email', 'password', 'validIdPhoto'];
    foreach ($required_fields as $field) {
        if (!isset($input[$field]) || trim((string) $input[$field]) === '') {
            sendResponse('error', ['message' => ucfirst($field) . ' is required'], 400);
        }
    }
    
    $first_name = trim($input['firstName']);
    $last_name = trim($input['lastName']);
    $middle_name = trim((string) ($input['middleName'] ?? ''));
    $name = trim($first_name . ' ' . ($middle_name !== '' ? $middle_name . ' ' : '') . $last_name);
    $username = trim($input['username']);
    $email = trim($input['email']);
    $password = password_hash($input['password'], PASSWORD_BCRYPT);
    $role = $input['role'] ?? 'resident';
    $address = trim((string) ($input['address'] ?? ''));
    $gender = trim((string) ($input['gender'] ?? ''));
    $birth_date = trim((string) ($input['birthDate'] ?? ''));
    $age = isset($input['age']) && $input['age'] !== '' ? (int) $input['age'] : null;
    $registered_voter = !empty($input['registeredVoter']) ? 1 : 0;
    $valid_id_photo = saveUploadedDataUrl($input['validIdPhoto'] ?? '', 'valid-id');
    $school_id_photo = saveUploadedDataUrl($input['schoolIdPhoto'] ?? '', 'school-id');
    $barangay_id = 'BRGY-' . date('Y') . '-' . str_pad((string) random_int(1, 99999), 5, '0', STR_PAD_LEFT);
    
    if (!in_array($role, ['admin', 'staff', 'resident'], true)) {
        sendResponse('error', ['message' => 'Invalid role'], 400);
    }
    
    $stmt = $conn->prepare('SELECT id FROM users WHERE email = ? OR username = ?');
    $stmt->bind_param('ss', $email, $username);
    $stmt->execute();
    
    if ($stmt->get_result()->num_rows > 0) {
        sendResponse('error', ['message' => 'Email or username already exists'], 409);
    }
    
    $stmt = $conn->prepare('INSERT INTO users (name, email, password, role, first_name, middle_name, last_name, address, gender, birth_date, age, registered_voter, barangay_id, username, valid_id_photo, school_id_photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $stmt->bind_param('ssssssssssisssss', $name, $email, $password, $role, $first_name, $middle_name, $last_name, $address, $gender, $birth_date, $age, $registered_voter, $barangay_id, $username, $valid_id_photo, $school_id_photo);

    if ($stmt->execute()) {
        sendResponse('success', [
            'message' => 'Registration successful',
            'user_id' => $stmt->insert_id
        ], 201);
    }

    sendResponse('error', ['message' => 'Registration failed: ' . $stmt->error], 500);
}

function logout() {
    $_SESSION = [];
    session_destroy();
    sendResponse('success', ['message' => 'Logged out successfully']);
}

function getUser() {
    global $conn;

    if (!isset($_SESSION['user_id'])) {
        sendResponse('success', ['user' => null]);
    }

    $user_id = (int) $_SESSION['user_id'];

    $stmt = $conn->prepare('SELECT id, name, email, role, first_name, middle_name, last_name, address, gender, birth_date, age, registered_voter, barangay_id, username, valid_id_photo, school_id_photo FROM users WHERE id = ? LIMIT 1');
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        sendResponse('error', ['message' => 'User not found'], 404);
    }

    $user = $result->fetch_assoc();
    sendResponse('success', ['user' => mapUser($user)]);
}

function handleAnnouncements($request_method, $input) {
    switch ($request_method) {
        case 'GET':
            listAnnouncements();
            break;
        case 'POST':
            createAnnouncement($input);
            break;
        case 'PUT':
            updateAnnouncement(getRequiredId(), $input);
            break;
        case 'DELETE':
            deleteAnnouncement(getRequiredId());
            break;
        default:
            sendResponse('error', ['message' => 'Method not allowed'], 405);
    }
}

function listAnnouncements() {
    global $conn;

    $result = $conn->query('SELECT id, title, publish_date, category, featured, summary, content, image FROM announcements ORDER BY publish_date DESC, id DESC');
    $items = [];

    while ($row = $result->fetch_assoc()) {
        $items[] = mapAnnouncement($row);
    }

    sendResponse('success', ['announcements' => $items]);
}

function getAnnouncement() {
    global $conn;

    $id = getRequiredId();
    $stmt = $conn->prepare('SELECT id, title, publish_date, category, featured, summary, content, image FROM announcements WHERE id = ? LIMIT 1');
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        sendResponse('error', ['message' => 'Announcement not found'], 404);
    }

    sendResponse('success', ['announcement' => mapAnnouncement($result->fetch_assoc())]);
}

function createAnnouncement($input) {
    global $conn;

    validateRequiredFields($input, ['title', 'date', 'category']);

    $title = trim($input['title']);
    $date = trim($input['date']);
    $category = trim($input['category']);
    $featured = !empty($input['featured']) ? 1 : 0;
    $summary = trim((string) ($input['summary'] ?? ''));
    $content = trim((string) ($input['content'] ?? ''));
    $image = trim((string) ($input['image'] ?? ''));

    $stmt = $conn->prepare('INSERT INTO announcements (title, publish_date, category, featured, summary, content, image) VALUES (?, ?, ?, ?, ?, ?, ?)');
    $stmt->bind_param('sssisss', $title, $date, $category, $featured, $summary, $content, $image);

    if (!$stmt->execute()) {
        sendResponse('error', ['message' => 'Failed to create announcement'], 500);
    }

    sendResponse('success', ['message' => 'Announcement created', 'id' => $stmt->insert_id], 201);
}

function updateAnnouncement($id, $input) {
    global $conn;

    validateRequiredFields($input, ['title', 'date', 'category']);

    $title = trim($input['title']);
    $date = trim($input['date']);
    $category = trim($input['category']);
    $featured = !empty($input['featured']) ? 1 : 0;
    $summary = trim((string) ($input['summary'] ?? ''));
    $content = trim((string) ($input['content'] ?? ''));
    $image = trim((string) ($input['image'] ?? ''));

    $stmt = $conn->prepare('UPDATE announcements SET title = ?, publish_date = ?, category = ?, featured = ?, summary = ?, content = ?, image = ? WHERE id = ?');
    $stmt->bind_param('sssisssi', $title, $date, $category, $featured, $summary, $content, $image, $id);

    if (!$stmt->execute()) {
        sendResponse('error', ['message' => 'Failed to update announcement'], 500);
    }

    sendResponse('success', ['message' => 'Announcement updated']);
}

function deleteAnnouncement($id) {
    global $conn;

    $stmt = $conn->prepare('DELETE FROM announcements WHERE id = ?');
    $stmt->bind_param('i', $id);

    if (!$stmt->execute()) {
        sendResponse('error', ['message' => 'Failed to delete announcement'], 500);
    }

    sendResponse('success', ['message' => 'Announcement deleted']);
}

function handleEvents($request_method, $input) {
    switch ($request_method) {
        case 'GET':
            listEvents();
            break;
        case 'POST':
            createEvent($input);
            break;
        case 'PUT':
            updateEvent(getRequiredId(), $input);
            break;
        case 'DELETE':
            deleteEvent(getRequiredId());
            break;
        default:
            sendResponse('error', ['message' => 'Method not allowed'], 405);
    }
}

function listEvents() {
    global $conn;

    $result = $conn->query('SELECT id, title, event_date, event_time, location, organizer, description, category FROM events ORDER BY event_date ASC, id ASC');
    $items = [];

    while ($row = $result->fetch_assoc()) {
        $items[] = mapEvent($row);
    }

    sendResponse('success', ['events' => $items]);
}

function getEvent() {
    global $conn;

    $id = getRequiredId();
    $stmt = $conn->prepare('SELECT id, title, event_date, event_time, location, organizer, description, category FROM events WHERE id = ? LIMIT 1');
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        sendResponse('error', ['message' => 'Event not found'], 404);
    }

    sendResponse('success', ['event' => mapEvent($result->fetch_assoc())]);
}

function createEvent($input) {
    global $conn;

    validateRequiredFields($input, ['title', 'date']);

    $title = trim($input['title']);
    $date = trim($input['date']);
    $time = trim((string) ($input['time'] ?? ''));
    $location = trim((string) ($input['location'] ?? ''));
    $organizer = trim((string) ($input['organizer'] ?? ''));
    $description = trim((string) ($input['description'] ?? ''));
    $category = trim((string) ($input['category'] ?? ''));

    $stmt = $conn->prepare('INSERT INTO events (title, event_date, event_time, location, organizer, description, category) VALUES (?, ?, ?, ?, ?, ?, ?)');
    $stmt->bind_param('sssssss', $title, $date, $time, $location, $organizer, $description, $category);

    if (!$stmt->execute()) {
        sendResponse('error', ['message' => 'Failed to create event'], 500);
    }

    sendResponse('success', ['message' => 'Event created', 'id' => $stmt->insert_id], 201);
}

function updateEvent($id, $input) {
    global $conn;

    validateRequiredFields($input, ['title', 'date']);

    $title = trim($input['title']);
    $date = trim($input['date']);
    $time = trim((string) ($input['time'] ?? ''));
    $location = trim((string) ($input['location'] ?? ''));
    $organizer = trim((string) ($input['organizer'] ?? ''));
    $description = trim((string) ($input['description'] ?? ''));
    $category = trim((string) ($input['category'] ?? ''));

    $stmt = $conn->prepare('UPDATE events SET title = ?, event_date = ?, event_time = ?, location = ?, organizer = ?, description = ?, category = ? WHERE id = ?');
    $stmt->bind_param('sssssssi', $title, $date, $time, $location, $organizer, $description, $category, $id);

    if (!$stmt->execute()) {
        sendResponse('error', ['message' => 'Failed to update event'], 500);
    }

    sendResponse('success', ['message' => 'Event updated']);
}

function deleteEvent($id) {
    global $conn;

    $stmt = $conn->prepare('DELETE FROM events WHERE id = ?');
    $stmt->bind_param('i', $id);

    if (!$stmt->execute()) {
        sendResponse('error', ['message' => 'Failed to delete event'], 500);
    }

    sendResponse('success', ['message' => 'Event deleted']);
}

function handleOfficials($request_method, $input) {
    switch ($request_method) {
        case 'GET':
            listOfficials();
            break;
        case 'POST':
            createOfficial($input);
            break;
        case 'PUT':
            updateOfficial(getRequiredId(), $input);
            break;
        case 'DELETE':
            deleteOfficial(getRequiredId());
            break;
        default:
            sendResponse('error', ['message' => 'Method not allowed'], 405);
    }
}

function listOfficials() {
    global $conn;

    $result = $conn->query('SELECT id, name, position, term_label, photo, responsibilities FROM officials ORDER BY sort_order ASC, id ASC');
    $items = [];

    while ($row = $result->fetch_assoc()) {
        $items[] = mapOfficial($row);
    }

    sendResponse('success', ['officials' => $items]);
}

function createOfficial($input) {
    global $conn;

    validateRequiredFields($input, ['name', 'position']);

    $name = trim($input['name']);
    $position = trim($input['position']);
    $term = trim((string) ($input['term'] ?? ''));
    $photo = trim((string) ($input['photo'] ?? ''));
    $responsibilities = trim((string) ($input['responsibilities'] ?? ''));
    $sort_order = isset($input['sort_order']) ? (int) $input['sort_order'] : 999;

    $stmt = $conn->prepare('INSERT INTO officials (name, position, term_label, photo, responsibilities, sort_order) VALUES (?, ?, ?, ?, ?, ?)');
    $stmt->bind_param('sssssi', $name, $position, $term, $photo, $responsibilities, $sort_order);

    if (!$stmt->execute()) {
        sendResponse('error', ['message' => 'Failed to create official'], 500);
    }

    sendResponse('success', ['message' => 'Official created', 'id' => $stmt->insert_id], 201);
}

function updateOfficial($id, $input) {
    global $conn;

    validateRequiredFields($input, ['name', 'position']);

    $name = trim($input['name']);
    $position = trim($input['position']);
    $term = trim((string) ($input['term'] ?? ''));
    $photo = trim((string) ($input['photo'] ?? ''));
    $responsibilities = trim((string) ($input['responsibilities'] ?? ''));
    $sort_order = isset($input['sort_order']) ? (int) $input['sort_order'] : 999;

    $stmt = $conn->prepare('UPDATE officials SET name = ?, position = ?, term_label = ?, photo = ?, responsibilities = ?, sort_order = ? WHERE id = ?');
    $stmt->bind_param('sssssii', $name, $position, $term, $photo, $responsibilities, $sort_order, $id);

    if (!$stmt->execute()) {
        sendResponse('error', ['message' => 'Failed to update official'], 500);
    }

    sendResponse('success', ['message' => 'Official updated']);
}

function deleteOfficial($id) {
    global $conn;

    $stmt = $conn->prepare('DELETE FROM officials WHERE id = ?');
    $stmt->bind_param('i', $id);

    if (!$stmt->execute()) {
        sendResponse('error', ['message' => 'Failed to delete official'], 500);
    }

    sendResponse('success', ['message' => 'Official deleted']);
}

function handleHotlines($request_method, $input) {
    switch ($request_method) {
        case 'GET':
            listHotlines();
            break;
        case 'POST':
            createHotline($input);
            break;
        case 'PUT':
            updateHotline(getRequiredId(), $input);
            break;
        case 'DELETE':
            deleteHotline(getRequiredId());
            break;
        default:
            sendResponse('error', ['message' => 'Method not allowed'], 405);
    }
}

function listHotlines() {
    global $conn;

    $result = $conn->query('SELECT id, name, number FROM hotlines ORDER BY sort_order ASC, id ASC');
    $items = [];

    while ($row = $result->fetch_assoc()) {
        $items[] = mapHotline($row);
    }

    sendResponse('success', ['hotlines' => $items]);
}

function createHotline($input) {
    global $conn;

    validateRequiredFields($input, ['name', 'number']);

    $name = trim($input['name']);
    $number = trim($input['number']);
    $sort_order = isset($input['sort_order']) ? (int) $input['sort_order'] : 999;

    $stmt = $conn->prepare('INSERT INTO hotlines (name, number, sort_order) VALUES (?, ?, ?)');
    $stmt->bind_param('ssi', $name, $number, $sort_order);

    if (!$stmt->execute()) {
        sendResponse('error', ['message' => 'Failed to create hotline'], 500);
    }

    sendResponse('success', ['message' => 'Hotline created', 'id' => $stmt->insert_id], 201);
}

function updateHotline($id, $input) {
    global $conn;

    validateRequiredFields($input, ['name', 'number']);

    $name = trim($input['name']);
    $number = trim($input['number']);
    $sort_order = isset($input['sort_order']) ? (int) $input['sort_order'] : 999;

    $stmt = $conn->prepare('UPDATE hotlines SET name = ?, number = ?, sort_order = ? WHERE id = ?');
    $stmt->bind_param('ssii', $name, $number, $sort_order, $id);

    if (!$stmt->execute()) {
        sendResponse('error', ['message' => 'Failed to update hotline'], 500);
    }

    sendResponse('success', ['message' => 'Hotline updated']);
}

function deleteHotline($id) {
    global $conn;

    $stmt = $conn->prepare('DELETE FROM hotlines WHERE id = ?');
    $stmt->bind_param('i', $id);

    if (!$stmt->execute()) {
        sendResponse('error', ['message' => 'Failed to delete hotline'], 500);
    }

    sendResponse('success', ['message' => 'Hotline deleted']);
}

function validateRequiredFields($input, $fields) {
    foreach ($fields as $field) {
        if (!isset($input[$field]) || trim((string) $input[$field]) === '') {
            sendResponse('error', ['message' => ucfirst($field) . ' is required'], 400);
        }
    }
}

function handleUsers($request_method, $input) {
    switch ($request_method) {
        case 'GET':
            listUsers();
            break;
        case 'POST':
            createAdminManagedUser($input);
            break;
        case 'PUT':
            updateManagedUser(getRequiredId(), $input);
            break;
        case 'DELETE':
            deleteManagedUser(getRequiredId());
            break;
        default:
            sendResponse('error', ['message' => 'Method not allowed'], 405);
    }
}

function listUsers() {
    global $conn;

    $result = $conn->query('SELECT id, name, email, role, status, verified, username, created_at, first_name, middle_name, last_name, address, gender, birth_date, age, registered_voter, barangay_id, valid_id_photo, school_id_photo FROM users ORDER BY id DESC');
    $items = [];

    while ($row = $result->fetch_assoc()) {
        $items[] = mapManagedUser($row);
    }

    sendResponse('success', ['users' => $items]);
}

function createAdminManagedUser($input) {
    global $conn;

    validateRequiredFields($input, ['firstName', 'lastName', 'email', 'username', 'password', 'role']);

    $role = strtolower(trim((string) $input['role']));
    if (!in_array($role, ['staff', 'admin', 'resident'], true)) {
        sendResponse('error', ['message' => 'Invalid role'], 400);
    }

    $first_name = trim((string) $input['firstName']);
    $last_name = trim((string) $input['lastName']);
    $middle_name = trim((string) ($input['middleName'] ?? ''));
    $name = trim($first_name . ' ' . ($middle_name !== '' ? $middle_name . ' ' : '') . $last_name);
    $email = trim((string) $input['email']);
    $username = trim((string) $input['username']);
    $password = password_hash((string) $input['password'], PASSWORD_BCRYPT);
    $address = trim((string) ($input['address'] ?? ''));
    $gender = trim((string) ($input['gender'] ?? ''));
    $birth_date = trim((string) ($input['birthDate'] ?? ''));
    $age = isset($input['age']) && $input['age'] !== '' ? (int) $input['age'] : null;
    $registered_voter = !empty($input['registeredVoter']) ? 1 : 0;
    $verified = isset($input['verified']) ? (!empty($input['verified']) ? 1 : 0) : 1;
    $status = strtolower(trim((string) ($input['status'] ?? 'active')));
    if (!in_array($status, ['active', 'inactive'], true)) {
        $status = 'active';
    }

    $barangay_id = ($role === 'staff' ? 'STF' : ($role === 'admin' ? 'ADM' : 'RES')) . '-' . date('Y') . '-' . str_pad((string) random_int(1, 99999), 5, '0', STR_PAD_LEFT);

    $stmt = $conn->prepare('SELECT id FROM users WHERE email = ? OR username = ?');
    $stmt->bind_param('ss', $email, $username);
    $stmt->execute();
    if ($stmt->get_result()->num_rows > 0) {
        sendResponse('error', ['message' => 'Email or username already exists'], 409);
    }

    $valid_id_photo = trim((string) ($input['validIdPhoto'] ?? ''));
    $school_id_photo = trim((string) ($input['schoolIdPhoto'] ?? ''));
    $stmt = $conn->prepare('INSERT INTO users (name, email, password, role, first_name, middle_name, last_name, address, gender, birth_date, age, registered_voter, barangay_id, username, valid_id_photo, school_id_photo, status, verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $stmt->bind_param('ssssssssssisssssii', $name, $email, $password, $role, $first_name, $middle_name, $last_name, $address, $gender, $birth_date, $age, $registered_voter, $barangay_id, $username, $valid_id_photo, $school_id_photo, $status, $verified);

    if (!$stmt->execute()) {
        sendResponse('error', ['message' => 'Failed to create user'], 500);
    }

    sendResponse('success', ['message' => 'User created', 'id' => $stmt->insert_id], 201);
}

function updateManagedUser($id, $input) {
    global $conn;
    $updates = [];
    $params = [];
    $types = '';

    if (isset($input['status'])) {
        $status = strtolower(trim((string) $input['status']));
        if (!in_array($status, ['active', 'inactive'], true)) {
            sendResponse('error', ['message' => 'Invalid status'], 400);
        }
        $updates[] = 'status = ?';
        $params[] = $status;
        $types .= 's';
    }

    if (array_key_exists('verified', $input)) {
        $verified = !empty($input['verified']) ? 1 : 0;
        $updates[] = 'verified = ?';
        $params[] = $verified;
        $types .= 'i';
    }

    if (count($updates) === 0) {
        sendResponse('error', ['message' => 'No valid fields to update'], 400);
    }

    $params[] = $id;
    $types .= 'i';
    $sql = 'UPDATE users SET ' . implode(', ', $updates) . ' WHERE id = ?';
    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$params);

    if (!$stmt->execute()) {
        sendResponse('error', ['message' => 'Failed to update user'], 500);
    }

    sendResponse('success', ['message' => 'User updated']);
}

function deleteManagedUser($id) {
    global $conn;

    if (isset($_SESSION['user_id']) && (int) $_SESSION['user_id'] === $id) {
        sendResponse('error', ['message' => 'You cannot delete your own account'], 403);
    }

    $stmt = $conn->prepare('DELETE FROM users WHERE id = ?');
    $stmt->bind_param('i', $id);

    if (!$stmt->execute()) {
        sendResponse('error', ['message' => 'Failed to delete user'], 500);
    }

    if ($stmt->affected_rows === 0) {
        sendResponse('error', ['message' => 'User not found'], 404);
    }

    sendResponse('success', ['message' => 'User deleted']);
}
?>
