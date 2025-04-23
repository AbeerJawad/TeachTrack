CREATE DATABASE facultyfeedback;
USE facultyfeedback;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    created_at DATE NOT NULL DEFAULT (CURRENT_DATE),
    dtype ENUM('student', 'faculty', 'admin') NOT NULL,
    student_id VARCHAR(20) NULL,     
    faculty_id VARCHAR(20) NULL,     
    admin_id VARCHAR(20) NULL        
);

CREATE UNIQUE INDEX idx_student_id ON users(student_id);
CREATE UNIQUE INDEX idx_faculty_id ON users(faculty_id);

CREATE TABLE courses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_code VARCHAR(20) NOT NULL UNIQUE,
    course_name VARCHAR(100) NOT NULL,
    faculty_id VARCHAR(20) NOT NULL,  -- Changed to VARCHAR(20)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (faculty_id) REFERENCES users(faculty_id) ON DELETE CASCADE
);

-- Create the student_courses table
CREATE TABLE student_courses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(20) NOT NULL, -- Changed to VARCHAR(20)
    course_id BIGINT NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Create the feedback table
CREATE TABLE feedback (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(20) NOT NULL, -- Changed to VARCHAR(20)
    faculty_id VARCHAR(20) NOT NULL, -- Changed to VARCHAR(20)
    course_id BIGINT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(student_id) ON DELETE CASCADE,
    FOREIGN KEY (faculty_id) REFERENCES users(faculty_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- For user profile extensions (phone, bio, role, status)
CREATE TABLE user_profiles (
    user_id BIGINT PRIMARY KEY,
    phone_number VARCHAR(20),
    bio TEXT,
    role VARCHAR(50),
    status VARCHAR(20) DEFAULT 'Active',
    profile_image_url VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- For social media links
CREATE TABLE social_links (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    platform VARCHAR(50) NOT NULL,
    url VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- For skills and expertise
CREATE TABLE skills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- For activities timeline
CREATE TABLE activities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    activity_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    activity_date DATE NOT NULL,
    icon VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- For projects
CREATE TABLE projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- For project tags/technologies
CREATE TABLE project_tags (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    tag_name VARCHAR(50) NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);



INSERT INTO users (username, email, full_name, password_hash, date_of_birth, dtype, student_id) VALUES
('stu1', 'stu1@mail.com', 'Student One', 'pass1', '2002-05-15', 'STUDENT', 'STU-1'),
('stu2', 'stu2@mail.com', 'Student Two', 'pass2', '2003-07-22', 'STUDENT', 'STU-2'),
('stu3', 'stu3@mail.com', 'Student Three', 'pass3', '2001-11-10', 'STUDENT', 'STU-3');

INSERT INTO users (username, email, full_name, password_hash, date_of_birth, dtype, faculty_id) VALUES
('fac1', 'fac1@mail.com', 'Faculty One', 'pass4', '1980-04-25', 'FACULTY', 'FAC-2');

-- Inserting dummy data into the courses table
INSERT INTO courses (course_code, course_name, faculty_id)
VALUES 
    ('CS101', 'Introduction to Computer Science', 'FAC-2'),
    ('CS102', 'Data Structures and Algorithms', 'FAC-2');

-- Inserting dummy data into the student_courses table
INSERT INTO student_courses (student_id, course_id)
VALUES 
    ('STU-1', 1),  
    ('STU-1', 2);

-- Inserting dummy data into the feedback table
INSERT INTO feedback (student_id, faculty_id, course_id, rating, comments)
VALUES 
    ('STU-1', 'FAC-2', 1, 5, 'Great course!'),
    ('STU-1', 'FAC-2', 2, 4, 'Good course, but needs improvement in some topics.');
    
INSERT INTO feedback (student_id, faculty_id, course_id, rating, comments)
VALUES 
    ('STU-2', 'FAC-2', 1, 2, 'The lectures were hard to follow.'),
    ('STU-3', 'FAC-2', 2, 1, 'The course lacked clarity and structure.');
    
-- Get the user_id for FAC-2
SET @faculty_user_id = (SELECT id FROM users WHERE faculty_id = 'FAC-2');

-- Insert user profile data
INSERT INTO user_profiles (user_id, phone_number, bio, role, status, profile_image_url) 
VALUES (
    @faculty_user_id,
    '+92 3312345678',
    'Professor of Computer Science with 10+ years of teaching experience. Specializing in web development and data structures.',
    'Professor',
    'Active',
    'images/pfp.webp'
);

-- Insert social links
INSERT INTO social_links (user_id, platform, url) VALUES
(@faculty_user_id, 'Facebook', 'https://facebook.com/facultyone'),
(@faculty_user_id, 'LinkedIn', 'https://linkedin.com/in/facultyone'),
(@faculty_user_id, 'Twitter', 'https://twitter.com/facultyone');

-- Insert skills
INSERT INTO skills (user_id, skill_name) VALUES
(@faculty_user_id, 'Web Development'),
(@faculty_user_id, 'JavaScript'),
(@faculty_user_id, 'Data Structures'),
(@faculty_user_id, 'Algorithms'),
(@faculty_user_id, 'Python'),
(@faculty_user_id, 'Database Design');

-- Insert activities
INSERT INTO activities (user_id, activity_type, title, description, activity_date, icon) VALUES
(@faculty_user_id, 'course', 'Created a new course', 'Added "Advanced JavaScript Frameworks" to the curriculum.', '2025-03-15', '📚'),
(@faculty_user_id, 'research', 'Published a research paper', 'Published "Machine Learning Applications in Education" in the Journal of AI Research.', '2025-02-28', '📝'),
(@faculty_user_id, 'award', 'Received teaching excellence award', 'Recognized for outstanding contributions to computer science education.', '2025-01-12', '🏆'),
(@faculty_user_id, 'workshop', 'Conducted a workshop', 'Led a 3-day workshop on "Web Development Best Practices" for faculty members.', '2024-12-05', '👨‍🏫');

-- Insert projects
INSERT INTO projects (user_id, title, description, image_url) VALUES
(@faculty_user_id, 'Online Learning Platform', 'A comprehensive platform for interactive online courses with real-time feedback.', 'images/project1.jpg'),
(@faculty_user_id, 'Student Performance Analytics', 'Data-driven insights to improve student outcomes and personalize learning.', 'images/project2.jpg'),
(@faculty_user_id, 'Curriculum Development Tool', 'A collaborative tool for faculty to create and update course materials.', 'images/project3.jpg'),
(@faculty_user_id, 'Research Database', 'Centralized repository for research papers, data, and collaboration.', 'images/project4.jpg');

-- Get the project IDs
SET @project1_id = (SELECT id FROM projects WHERE title = 'Online Learning Platform' AND user_id = @faculty_user_id);
SET @project2_id = (SELECT id FROM projects WHERE title = 'Student Performance Analytics' AND user_id = @faculty_user_id);
SET @project3_id = (SELECT id FROM projects WHERE title = 'Curriculum Development Tool' AND user_id = @faculty_user_id);
SET @project4_id = (SELECT id FROM projects WHERE title = 'Research Database' AND user_id = @faculty_user_id);

-- Insert project tags
INSERT INTO project_tags (project_id, tag_name) VALUES
(@project1_id, 'React'),
(@project1_id, 'Node.js'),
(@project1_id, 'MongoDB'),
(@project2_id, 'Python'),
(@project2_id, 'TensorFlow'),
(@project2_id, 'Data Visualization'),
(@project3_id, 'Vue.js'),
(@project3_id, 'Firebase'),
(@project3_id, 'Express'),
(@project4_id, 'SQL'),
(@project4_id, 'Django'),
(@project4_id, 'AWS');

    
SELECT f.id, f.student_id, f.course_id, f.rating, f.comments
FROM feedback f
JOIN users u ON f.faculty_id = u.faculty_id
WHERE u.id = 5 AND f.rating > 3;

SELECT f.id, f.student_id, f.course_id, f.rating, f.comments
FROM feedback f
JOIN users u ON f.faculty_id = u.faculty_id
WHERE u.faculty_id = 'FAC-2' AND f.rating <= 3;

-- dashboard queries
select count(f.id) from feedback as f where f.faculty_id='FAC-2';
select count(f.id) from feedback as f where f.faculty_id='FAC-2' AND f.rating>=3;
select count(f.id) from feedback as f where f.faculty_id='FAC-2' AND f.rating<3;

SELECT id, course_code, course_name, created_at
FROM courses
WHERE faculty_id = 'FAC-2';

SELECT 
    c.course_code,
    c.course_name,
    f.rating,
    f.comments,
    f.created_at
FROM feedback f
JOIN courses c ON f.course_id = c.id
WHERE f.faculty_id = 'FAC-2'
ORDER BY f.course_id, f.created_at;

SELECT 
    COUNT(CASE WHEN f.rating > 3 THEN 1 END) AS positive_feedback,
    COUNT(CASE WHEN f.rating <= 3 THEN 1 END) AS negative_feedback,
    COUNT(f.id) AS total_feedback
FROM feedback f
JOIN courses c ON f.course_id = c.id
WHERE f.faculty_id = 'FAC-2' 
  AND c.course_code = 'CS101';
  
SELECT 
    u.id,
    u.username,
    u.email,
    u.full_name,
    u.faculty_id,
    up.phone_number,
    up.bio,
    up.role,
    up.status,
    up.profile_image_url,
    -- Count of courses
    (SELECT COUNT(*) FROM courses WHERE faculty_id = 'FAC-2') AS courses_count,
    -- Count of students
    (SELECT COUNT(DISTINCT sc.student_id) 
     FROM courses c 
     JOIN student_courses sc ON c.id = sc.course_id 
     WHERE c.faculty_id = 'FAC-2') AS students_count,
    -- Average rating
    (SELECT COALESCE(AVG(rating), 0) 
     FROM feedback 
     WHERE faculty_id = 'FAC-2') AS average_rating
FROM 
    users u
LEFT JOIN 
    user_profiles up ON u.id = up.user_id
WHERE 
    u.faculty_id = 'FAC-2';

select * from users;
select * from courses;
select * from student_courses;
select * from feedback;








