<?php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_PORT', 3306);

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, '', DB_PORT);

if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
}

$db_name = 'sauyo';
if ($conn->query("CREATE DATABASE IF NOT EXISTS $db_name CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci") !== TRUE) {
    die('Error creating database: ' . $conn->error);
}

$conn->select_db($db_name);
$conn->set_charset('utf8mb4');

function runOrFail($conn, $sql, $message) {
    if ($conn->query($sql) === TRUE) {
        echo $message . "<br>";
        return;
    }

    die('Database setup failed: ' . $conn->error);
}

function columnExists($conn, $table, $column) {
    $table = $conn->real_escape_string($table);
    $column = $conn->real_escape_string($column);
    $result = $conn->query("SHOW COLUMNS FROM `$table` LIKE '$column'");
    return $result && $result->num_rows > 0;
}

function ensureColumn($conn, $table, $column, $definition) {
    if (columnExists($conn, $table, $column)) {
        echo "Column $table.$column already exists.<br>";
        return;
    }

    runOrFail($conn, "ALTER TABLE `$table` ADD COLUMN `$column` $definition", "Added $table.$column.");
}

function uniqueIndexExists($conn, $table, $index_name) {
    $table = $conn->real_escape_string($table);
    $index_name = $conn->real_escape_string($index_name);
    $result = $conn->query("SHOW INDEX FROM `$table` WHERE Key_name = '$index_name'");
    return $result && $result->num_rows > 0;
}

function ensureUniqueIndex($conn, $table, $index_name, $column) {
    if (uniqueIndexExists($conn, $table, $index_name)) {
        echo "Unique index $index_name already exists.<br>";
        return;
    }

    runOrFail($conn, "ALTER TABLE `$table` ADD UNIQUE KEY `$index_name` (`$column`)", "Added unique index $index_name.");
}

runOrFail($conn, "
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'staff', 'resident') NOT NULL,
    first_name VARCHAR(100) DEFAULT '',
    middle_name VARCHAR(100) DEFAULT '',
    last_name VARCHAR(100) DEFAULT '',
    address VARCHAR(255) DEFAULT '',
    gender VARCHAR(50) DEFAULT '',
    birth_date DATE DEFAULT NULL,
    age INT DEFAULT NULL,
    registered_voter TINYINT(1) DEFAULT 0,
    barangay_id VARCHAR(50) DEFAULT '',
    username VARCHAR(100) DEFAULT '',
    valid_id_photo LONGTEXT DEFAULT NULL,
    school_id_photo LONGTEXT DEFAULT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    verified TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)", "Users table ready.");

ensureColumn($conn, 'users', 'first_name', "VARCHAR(100) DEFAULT ''");
ensureColumn($conn, 'users', 'middle_name', "VARCHAR(100) DEFAULT ''");
ensureColumn($conn, 'users', 'last_name', "VARCHAR(100) DEFAULT ''");
ensureColumn($conn, 'users', 'address', "VARCHAR(255) DEFAULT ''");
ensureColumn($conn, 'users', 'gender', "VARCHAR(50) DEFAULT ''");
ensureColumn($conn, 'users', 'birth_date', "DATE DEFAULT NULL");
ensureColumn($conn, 'users', 'age', "INT DEFAULT NULL");
ensureColumn($conn, 'users', 'registered_voter', "TINYINT(1) DEFAULT 0");
ensureColumn($conn, 'users', 'barangay_id', "VARCHAR(50) DEFAULT ''");
ensureColumn($conn, 'users', 'username', "VARCHAR(100) DEFAULT ''");
ensureColumn($conn, 'users', 'valid_id_photo', "LONGTEXT DEFAULT NULL");
ensureColumn($conn, 'users', 'school_id_photo', "LONGTEXT DEFAULT NULL");
ensureColumn($conn, 'users', 'verified', "TINYINT(1) DEFAULT 0");
ensureUniqueIndex($conn, 'users', 'users_username_unique', 'username');

runOrFail($conn, "
CREATE TABLE IF NOT EXISTS announcements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    publish_date DATE NOT NULL,
    category VARCHAR(100) NOT NULL,
    featured TINYINT(1) NOT NULL DEFAULT 0,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    image VARCHAR(255) NOT NULL DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)", "Announcements table ready.");

runOrFail($conn, "
CREATE TABLE IF NOT EXISTS events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    event_date DATE NOT NULL,
    event_time VARCHAR(100) NOT NULL DEFAULT '',
    location VARCHAR(255) NOT NULL DEFAULT '',
    organizer VARCHAR(255) NOT NULL DEFAULT '',
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)", "Events table ready.");

runOrFail($conn, "
CREATE TABLE IF NOT EXISTS officials (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    term_label VARCHAR(100) NOT NULL DEFAULT '',
    photo VARCHAR(255) NOT NULL DEFAULT '',
    responsibilities TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 999,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)", "Officials table ready.");

runOrFail($conn, "
CREATE TABLE IF NOT EXISTS hotlines (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    number VARCHAR(255) NOT NULL,
    sort_order INT NOT NULL DEFAULT 999,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)", "Hotlines table ready.");

runOrFail($conn, "
CREATE TABLE IF NOT EXISTS requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('pending', 'in_progress', 'completed', 'rejected') DEFAULT 'pending',
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
)", "Requests table ready.");

$default_admin_email = 'admin@sauyo.local';
$default_admin_password = password_hash('admin12345', PASSWORD_BCRYPT);
$admin_check = $conn->query("SELECT id FROM users WHERE email = '{$default_admin_email}' LIMIT 1");
if ($admin_check && $admin_check->num_rows === 0) {
    $stmt = $conn->prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
    $name = 'System Admin';
    $role = 'admin';
    $stmt->bind_param('ssss', $name, $default_admin_email, $default_admin_password, $role);
    $stmt->execute();
    echo "Default admin user seeded.<br>";
}

if ((int) $conn->query('SELECT COUNT(*) AS total FROM announcements')->fetch_assoc()['total'] === 0) {
    runOrFail($conn, "
    INSERT INTO announcements (title, publish_date, category, featured, summary, content, image) VALUES
    ('Free Medical Check-up for Senior Citizens', '2026-02-15', 'Health', 1, 'Barangay Sauyo, in partnership with the City Health Office, will conduct a free medical check-up for all senior citizens this coming Saturday.', 'All senior citizens of Barangay Sauyo are invited to a free medical check-up at the Barangay Hall. Services include blood pressure monitoring, blood sugar testing, eye check-up, and free medicines. Please bring your Senior Citizen ID.', ''),
    ('Road Clearing Operations Schedule', '2026-02-10', 'Infrastructure', 0, 'Road clearing operations will be conducted along Quirino Highway and surrounding streets.', 'As part of the DILG directive, road clearing operations will commence along Quirino Highway. All residents are advised to remove obstructions from public roads and sidewalks.', ''),
    ('Barangay Assembly Meeting Notice', '2026-02-20', 'Governance', 0, 'All residents are invited to attend the quarterly Barangay Assembly at the covered court.', 'The quarterly Barangay Assembly will discuss the barangay budget, upcoming projects, and community concerns. Light snacks will be provided. Your attendance is highly encouraged.', ''),
    ('Distribution of Relief Goods', '2026-02-08', 'Social Services', 1, 'Relief goods distribution for families affected by recent flooding in Purok 5 and 6.', 'Affected families in Purok 5 and 6 may claim their relief goods at the Barangay Hall. Please bring a valid ID and your Barangay Certificate of Residency.', '')
    ", "Seeded announcements.");
}

if ((int) $conn->query('SELECT COUNT(*) AS total FROM events')->fetch_assoc()['total'] === 0) {
    runOrFail($conn, "
    INSERT INTO events (title, event_date, event_time, location, organizer, description, category) VALUES
    ('Barangay Fiesta 2026', '2026-03-15', '8:00 AM - 10:00 PM', 'Barangay Covered Court', 'Barangay Council', 'Annual celebration of Barangay Sauyo''s founding anniversary featuring cultural shows, games, and community feast.', 'Festival'),
    ('Clean-Up Drive', '2026-02-22', '6:00 AM - 12:00 PM', 'Along Quirino Highway', 'Environmental Committee', 'Community clean-up drive to maintain cleanliness and proper waste disposal along main roads.', 'Environment'),
    ('Youth Basketball League Opening', '2026-03-01', '2:00 PM - 6:00 PM', 'Barangay Basketball Court', 'SK Council', 'Opening ceremony of the inter-purok basketball league for the youth of Barangay Sauyo.', 'Sports'),
    ('Livelihood Training: Baking', '2026-02-28', '9:00 AM - 4:00 PM', 'Barangay Multi-Purpose Hall', 'BWSC', 'Free baking training for interested residents. Materials will be provided. Limited slots available.', 'Livelihood'),
    ('Barangay Assembly', '2026-02-20', '1:00 PM - 5:00 PM', 'Barangay Hall', 'Barangay Council', 'Quarterly assembly to discuss barangay budget, projects, and community concerns.', 'Governance')
    ", "Seeded events.");
}

if ((int) $conn->query('SELECT COUNT(*) AS total FROM officials')->fetch_assoc()['total'] === 0) {
    runOrFail($conn, "
    INSERT INTO officials (name, position, term_label, photo, responsibilities, sort_order) VALUES
    ('Hon. Noel F. Vitug', 'Punong Barangay', '2023 - 2026', '', 'Overall administration and governance of the barangay. Presides over the Barangay Council.', 1),
    ('Hon. Rizza Joy P. Magtibay', 'Barangay Kagawad', '2023 - 2026', '', 'Supports governance and administration of the barangay.', 2),
    ('Hon. Carlos Dm. Apo', 'Barangay Kagawad', '2023 - 2026', '', 'Supports governance and administration of the barangay.', 3),
    ('Hon. Symond R. Del Mundo', 'Barangay Kagawad', '2023 - 2026', '', 'Supports governance and administration of the barangay.', 4),
    ('Hon. Camille J. Dela Cruz-Sibal', 'Barangay Kagawad', '2023 - 2026', '', 'Supports governance and administration of the barangay.', 5),
    ('Hon. Karina Joyce D. Quilo-Diaz', 'Barangay Kagawad', '2023 - 2026', '', 'Supports governance and administration of the barangay.', 6),
    ('Hon. Dendo M. Alvarez', 'Barangay Kagawad', '2023 - 2026', '', 'Supports governance and administration of the barangay.', 7),
    ('Hon. Luz P. Savilla', 'Barangay Kagawad', '2023 - 2026', '', 'Supports governance and administration of the barangay.', 8),
    ('Bryan Rolly G. Maliwat', 'SK Chairperson', '2023 - 2026', '', 'Leads the Sangguniang Kabataan programs and youth development activities.', 9)
    ", "Seeded officials.");
}

if ((int) $conn->query('SELECT COUNT(*) AS total FROM hotlines')->fetch_assoc()['total'] === 0) {
    runOrFail($conn, "
    INSERT INTO hotlines (name, number, sort_order) VALUES
    ('Barangay Desk Officer', '7369-91-56 / 0967 054 5117', 1),
    ('BDRRM / Fire Dept.', '0919-096-6996', 2),
    ('Secretariat', '7369-43-82', 3),
    ('BCPC / VAWC Desk Officer', '0967-054-5117', 4),
    ('Lupon', '0960-876-0468', 5),
    ('BADAC', '0999-991-4028', 6)
    ", "Seeded hotlines.");
}

echo "<br><strong>Database setup complete.</strong>";
echo "<br>API endpoint: http://localhost/sauyo/server/api.php?action=announcements";
echo "<br>Default admin: admin@sauyo.local / admin12345";

$conn->close();
?>
