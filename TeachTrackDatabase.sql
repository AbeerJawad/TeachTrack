CREATE DATABASE TeachTrack;
USE TeachTrack;

-- Users Table
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role ENUM('student', 'faculty', 'admin') NOT NULL,
    profile_image_url TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Departments Table
CREATE TABLE departments (
    department_id INT PRIMARY KEY AUTO_INCREMENT,
    department_name VARCHAR(100) UNIQUE NOT NULL,
    department_code VARCHAR(10) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX (department_name)
);


-- Students Table
CREATE TABLE students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    gender ENUM('male', 'female', 'other'),
    date_of_birth DATE,
    department_id INT,
    batch_year INT,
    semester INT,
    registration_number VARCHAR(50) UNIQUE,
    contact_number VARCHAR(15),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL
);

-- Faculty Table
CREATE TABLE faculty (
    faculty_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    gender ENUM('male', 'female', 'other'),
    date_of_birth DATE,
    department_id INT,
    designation ENUM('Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'Lab Instructor'),
    contact_number VARCHAR(15),
    qualifications TEXT,
    years_of_experience INT,
    office_location VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL
);

-- Admins Table
CREATE TABLE admins (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    contact_number VARCHAR(15),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Courses Table
CREATE TABLE courses (
    course_id INT PRIMARY KEY AUTO_INCREMENT,
    course_code VARCHAR(20) UNIQUE NOT NULL,
    course_title VARCHAR(100),
    department_id INT,
    semester INT,
    course_type ENUM('Theory', 'Lab'),
    credit_hours INT,
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL
);

-- Academic Terms Table
CREATE TABLE academic_terms (
    term_id INT PRIMARY KEY AUTO_INCREMENT,
    term_name VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    semester INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (year, semester)
);

-- Class Offerings Table
CREATE TABLE class_offerings (
    offering_id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    faculty_id INT NOT NULL,
    term_id INT NOT NULL,
    section VARCHAR(10) NOT NULL,
    max_students INT DEFAULT 50,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (course_id, faculty_id, term_id, section),
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    FOREIGN KEY (faculty_id) REFERENCES faculty(faculty_id) ON DELETE CASCADE,
    FOREIGN KEY (term_id) REFERENCES academic_terms(term_id) ON DELETE CASCADE
);

-- Student Enrollments Table
CREATE TABLE student_enrollments (
    enrollment_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    offering_id INT NOT NULL,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    grade VARCHAR(2),
    status ENUM('active', 'dropped', 'completed') DEFAULT 'active',
    UNIQUE (student_id, offering_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (offering_id) REFERENCES class_offerings(offering_id) ON DELETE CASCADE
);

-- Feedback Forms Table
CREATE TABLE feedback_forms (
    form_id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    term_id INT,
    semester INT,
    year INT,
    form_title VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    status ENUM('draft', 'open', 'closed', 'archived') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    FOREIGN KEY (term_id) REFERENCES academic_terms(term_id) ON DELETE CASCADE
);

-- Feedback Questions Table
CREATE TABLE feedback_questions (
    question_id INT PRIMARY KEY AUTO_INCREMENT,
    form_id INT NOT NULL,
    question_text TEXT,
    question_type ENUM('rating', 'text', 'yes_no', 'scale_1_5', 'scale_1_10'),
    is_required BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (form_id) REFERENCES feedback_forms(form_id) ON DELETE CASCADE
);

-- Feedback Responses Table
CREATE TABLE feedback_responses (
    response_id INT PRIMARY KEY AUTO_INCREMENT,
    form_id INT NOT NULL,
    student_id INT,
    faculty_id INT NOT NULL,
    offering_id INT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_anonymous BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (form_id) REFERENCES feedback_forms(form_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE SET NULL,
    FOREIGN KEY (faculty_id) REFERENCES faculty(faculty_id) ON DELETE CASCADE,
    FOREIGN KEY (offering_id) REFERENCES class_offerings(offering_id) ON DELETE CASCADE
);

-- Feedback Answers Table
CREATE TABLE feedback_answers (
    answer_id INT PRIMARY KEY AUTO_INCREMENT,
    response_id INT NOT NULL,
    question_id INT NOT NULL,
    answer_text TEXT,
    rating_value INT,
    FOREIGN KEY (response_id) REFERENCES feedback_responses(response_id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES feedback_questions(question_id) ON DELETE CASCADE
);

-- Faculty Feedback Replies Table
CREATE TABLE faculty_feedback_replies (
    reply_id INT PRIMARY KEY AUTO_INCREMENT,
    response_id INT NOT NULL,
    faculty_id INT NOT NULL,
    reply_text TEXT,
    replied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (response_id) REFERENCES feedback_responses(response_id) ON DELETE CASCADE,
    FOREIGN KEY (faculty_id) REFERENCES faculty(faculty_id) ON DELETE CASCADE
);

-- Faculty Statistics Table
CREATE TABLE faculty_statistics (
    faculty_id INT PRIMARY KEY,
    avg_rating FLOAT DEFAULT 0,
    total_feedbacks INT DEFAULT 0,
    last_feedback_date TIMESTAMP,
    FOREIGN KEY (faculty_id) REFERENCES faculty(faculty_id) ON DELETE CASCADE
);

-- User Documents Table
CREATE TABLE user_documents (
    document_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    document_type ENUM('profile_picture', 'cv', 'certification'),
    file_url TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Activity Logs Table
CREATE TABLE activity_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(255),
    description TEXT,
    ip_address VARCHAR(50),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- Faculty Ratings Summary Table
CREATE TABLE faculty_ratings_summary (
    summary_id INT PRIMARY KEY AUTO_INCREMENT,
    faculty_id INT NOT NULL,
    course_id INT NOT NULL,
    term_id INT NOT NULL,
    department_id INT NOT NULL,
    offering_id INT NOT NULL,
    question_id INT,
    question_category VARCHAR(50),
    avg_rating FLOAT DEFAULT 0,
    median_rating FLOAT DEFAULT 0,
    min_rating INT DEFAULT 0,
    max_rating INT DEFAULT 0,
    std_deviation FLOAT DEFAULT 0,
    response_count INT DEFAULT 0,
    anonymous_count INT DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (faculty_id) REFERENCES faculty(faculty_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    FOREIGN KEY (term_id) REFERENCES academic_terms(term_id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE CASCADE,
    FOREIGN KEY (offering_id) REFERENCES class_offerings(offering_id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES feedback_questions(question_id) ON DELETE SET NULL
);

CREATE TABLE student_notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT, 
    student_id INT NOT NULL, 
    title VARCHAR(255) NOT NULL, 
    message TEXT NOT NULL, 
    notification_type ENUM('feedback', 'deadline', 'announcement') NOT NULL, 
    is_read BOOLEAN DEFAULT FALSE, 
    related_id INT, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);
