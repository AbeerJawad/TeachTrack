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
    
    
SELECT f.id, f.student_id, f.course_id, f.rating, f.comments
FROM feedback f
JOIN users u ON f.faculty_id = u.faculty_id
WHERE u.faculty_id = 'FAC-2' AND f.rating > 3;

SELECT f.id, f.student_id, f.course_id, f.rating, f.comments
FROM feedback f
JOIN users u ON f.faculty_id = u.faculty_id
WHERE u.faculty_id = 'FAC-2' AND f.rating <= 3;

select count(f.id) from feedback as f where f.faculty_id='FAC-2';
select count(f.id) from feedback as f where f.faculty_id='FAC-2' AND f.rating>=3;
select count(f.id) from feedback as f where f.faculty_id='FAC-2' AND f.rating<3;

SELECT id, course_code, course_name, created_at
FROM courses
WHERE faculty_id = 'FAC-2';


select * from users;
select * from courses;
select * from student_courses;
select * from feedback;





