use TeachTrack;

INSERT INTO departments (department_name, department_code) VALUES
('Computer Science', 'CS'),
('Artificial Intelligence', 'AI'),
('Data Science', 'DS'),
('Cybersecurity', 'CY'),
('Humanities', 'HM');

-- insert students to users
INSERT INTO users (username, email, password_hash, role)
VALUES 
('william.gibbs1', 'william.gibbs1@example.edu', '1f4681ca9846cc32b0afe3935098d16a8d10c89838762740cfba74cc11bb8bee', 'student'),
('dana.sims2', 'dana.sims2@example.edu', '1ab3a7b282060a310def5b85d6080f58150f7d371501c2ba930fd511f0015e35', 'student'),
('ryan.anderson3', 'ryan.anderson3@example.edu', '2f0d8dca5d38cd13c1b28fcb503ab6ee783893f50ce744c60a492636a4584a82', 'student'),
('michelle.serrano4', 'michelle.serrano4@example.edu', 'f39f07b362c7002b7e9fbe4104464a2c512a30a94a5f707a54e0d2bf1ef35437', 'student'),
('rhonda.adams5', 'rhonda.adams5@example.edu', 'a025c4bf9ad3e82beb0cd85c3d364cd70f9817149e0499aadcccaba8cf279f72', 'student'),
('danny.martinez6', 'danny.martinez6@example.edu', 'a7a25fb86ce8685540cd6966bdc18275c97b1f82ce784db359ed015f6062ef97', 'student'),
('brendan.cain7', 'brendan.cain7@example.edu', '1686f006628258b02056863378d63f30eec338d675569e2ab6f8b443179c6bfe', 'student'),
('ashley.dixon8', 'ashley.dixon8@example.edu', '2e41e1ee9e564cc86a44dd65fffa6a3bb5b707100e21f80b5f72c54b02fef6b6', 'student'),
('christopher.terry9', 'christopher.terry9@example.edu', 'aec72adfd792c4cd08c7b2731eafebf49162b0cb82ac5b716fd214a78f115a0f', 'student'),
('cheryl.harris10', 'cheryl.harris10@example.edu', 'e131f137c6d5f1f186514a90204150a2118a74c64c987f04346139122f508eda', 'student'),
('scott.wilson11', 'scott.wilson11@example.edu', '4e18e82def1ed2ce3db08f79f1c3ff5ece31f571b07c2490fd63d9482eeed2d7', 'student'),
('patricia.oconnor12', 'patricia.oconnor12@example.edu', 'ff88157c33ef5c8b4c195e2e935ba2c37227a4c2524869f90a4ff7641ee6d013', 'student'),
('holly.rice13', 'holly.rice13@example.edu', 'f98149fd98b9f631f452aacfbb992591e7ad1d1788f242825ab013f2466c0899', 'student'),
('james.brown14', 'james.brown14@example.edu', 'c4df3d44f321c26473716190174d13b5908e2a529a64b1064838a5de172f2301', 'student'),
('melissa.herrera15', 'melissa.herrera15@example.edu', '3aa740b6bf9d97e921da93ca07593851f5f2bc7da0e1ddbeee229c8b6ab2d7ce', 'student'),
('peggy.adams16', 'peggy.adams16@example.edu', 'fa22b49be4c6a17a6132e9cdd56fd78ca9ddd63140c84e250405274ea398cf99', 'student'),
('nicole.pearson17', 'nicole.pearson17@example.edu', '2816bc208da60c1c3a5210c394903fad160cf57225b39054c3916536e79d4599', 'student'),
('zachary.collins18', 'zachary.collins18@example.edu', '8635c25f286b1c1c21164b47b1a072c71d92d1ee4cd99d190031f62dbf4ba0e8', 'student'),
('sarah.anderson19', 'sarah.anderson19@example.edu', 'c09c6996dbefa8f4c7679a36125eeaad262213be2e28a62dfff69ea7fb93b72d', 'student'),
('chad.gonzalez20', 'chad.gonzalez20@example.edu', 'b142f34aeff6cbaf9c305182129edd20aa65b51236f0d3461254bf8826f4bd82', 'student');

SET SQL_SAFE_UPDATES = 0;

UPDATE users
SET password_hash = '123';


select * from users where role='student';
-- Insert faculty users
INSERT INTO users (username, email, password_hash, role) VALUES
('john.smith', 'john.smith@example.edu', '123', 'faculty'),
('sarah.johnson', 'sarah.johnson@example.edu', '123', 'faculty'),
('michael.wong', 'michael.wong@example.edu', '123', 'faculty'),
('rachel.patel', 'rachel.patel@example.edu', '123', 'faculty'),
('david.rodriguez', 'david.rodriguez@example.edu', '123', 'faculty'),
('emily.chen', 'emily.chen@example.edu', '123', 'faculty'),
('robert.miller', 'robert.miller@example.edu', '123', 'faculty'),
('amanda.taylor', 'amanda.taylor@example.edu', '123', 'faculty'),
('james.williams', 'james.williams@example.edu', '123', 'faculty'),
('lisa.garcia', 'lisa.garcia@example.edu', '123', 'faculty');

-- Insert faculty details
INSERT INTO faculty (user_id, first_name, last_name, gender, date_of_birth, department_id, designation, contact_number, qualifications, years_of_experience, office_location)
VALUES
((SELECT user_id FROM users WHERE username = 'john.smith'), 'John', 'Smith', 'male', '1975-05-12', 1, 'Professor', '+1-555-123-4567', 'PhD in Computer Science, MIT', 15, 'Building A, Room 101'),
((SELECT user_id FROM users WHERE username = 'sarah.johnson'), 'Sarah', 'Johnson', 'female', '1980-08-23', 1, 'Associate Professor', '+1-555-234-5678', 'PhD in Software Engineering, Stanford', 10, 'Building A, Room 102'),
((SELECT user_id FROM users WHERE username = 'michael.wong'), 'Michael', 'Wong', 'male', '1978-03-17', 2, 'Professor', '+1-555-345-6789', 'PhD in Artificial Intelligence, UC Berkeley', 12, 'Building B, Room 201'),
((SELECT user_id FROM users WHERE username = 'rachel.patel'), 'Rachel', 'Patel', 'female', '1982-11-05', 2, 'Assistant Professor', '+1-555-456-7890', 'PhD in Machine Learning, CMU', 8, 'Building B, Room 202'),
((SELECT user_id FROM users WHERE username = 'david.rodriguez'), 'David', 'Rodriguez', 'male', '1979-07-30', 3, 'Associate Professor', '+1-555-567-8901', 'PhD in Statistics, Harvard', 11, 'Building C, Room 301'),
((SELECT user_id FROM users WHERE username = 'emily.chen'), 'Emily', 'Chen', 'female', '1985-02-14', 3, 'Assistant Professor', '+1-555-678-9012', 'PhD in Data Science, Columbia', 7, 'Building C, Room 302'),
((SELECT user_id FROM users WHERE username = 'robert.miller'), 'Robert', 'Miller', 'male', '1973-09-28', 4, 'Professor', '+1-555-789-0123', 'PhD in Network Security, Princeton', 18, 'Building D, Room 401'),
((SELECT user_id FROM users WHERE username = 'amanda.taylor'), 'Amanda', 'Taylor', 'female', '1981-06-19', 4, 'Associate Professor', '+1-555-890-1234', 'PhD in Cryptography, Yale', 9, 'Building D, Room 402'),
((SELECT user_id FROM users WHERE username = 'james.williams'), 'James', 'Williams', 'male', '1976-12-03', 5, 'Professor', '+1-555-901-2345', 'PhD in Philosophy, Oxford', 14, 'Building E, Room 501'),
((SELECT user_id FROM users WHERE username = 'lisa.garcia'), 'Lisa', 'Garcia', 'female', '1984-04-11', 5, 'Assistant Professor', '+1-555-012-3456', 'PhD in Literature, Cambridge', 6, 'Building E, Room 502');

-- Insert admin user
INSERT INTO users (username, email, password_hash, role) VALUES
('admin.user', 'admin@example.edu', '123', 'admin');

-- Insert admin details
INSERT INTO admins (user_id, first_name, last_name, contact_number) VALUES
((SELECT user_id FROM users WHERE username = 'admin.user'), 'Admin', 'User', '+1-555-999-0000');

INSERT INTO courses (course_code, course_title, department_id, semester, course_type, credit_hours) VALUES
('CS101', 'Introduction to Programming', 1, 1, 'Theory', 3),
('CS102', 'Data Structures', 1, 2, 'Theory', 3),
('CS103', 'Algorithms', 1, 3, 'Theory', 4),
('CS104', 'Database Systems', 1, 4, 'Theory', 3),
('CS105', 'Programming Lab', 1, 1, 'Lab', 1),
('AI201', 'Introduction to AI', 2, 3, 'Theory', 3),
('AI202', 'Machine Learning Fundamentals', 2, 4, 'Theory', 4),
('AI203', 'Neural Networks', 2, 5, 'Theory', 3),
('AI204', 'AI Lab', 2, 4, 'Lab', 1),
('DS301', 'Data Science Fundamentals', 3, 3, 'Theory', 3),
('DS302', 'Statistical Analysis', 3, 4, 'Theory', 3),
('DS303', 'Big Data Analytics', 3, 5, 'Theory', 4),
('DS304', 'Data Visualization', 3, 6, 'Theory', 3),
('CY401', 'Cybersecurity Fundamentals', 4, 3, 'Theory', 3),
('CY402', 'Network Security', 4, 4, 'Theory', 3),
('CY403', 'Ethical Hacking', 4, 5, 'Theory', 3),
('CY404', 'Security Lab', 4, 4, 'Lab', 1),
('HM501', 'Critical Thinking', 5, 1, 'Theory', 2),
('HM502', 'Technical Writing', 5, 2, 'Theory', 2),
('HM503', 'Professional Ethics', 5, 3, 'Theory', 2);

-- Insert academic terms
INSERT INTO academic_terms (term_name, year, semester, start_date, end_date, is_current) VALUES
('Fall 2023', 2023, 1, '2023-09-01', '2023-12-15', 0),
('Spring 2024', 2024, 2, '2024-01-15', '2024-05-30', 0),
('Fall 2024', 2024, 1, '2024-09-01', '2024-12-15', 0),
('Spring 2025', 2025, 2, '2025-01-15', '2025-05-30', 1);

-- Insert class offerings
INSERT INTO class_offerings (course_id, faculty_id, term_id, section, max_students) VALUES
(1, 1, 1, 'A', 40),
(1, 2, 1, 'B', 40),
(2, 1, 2, 'A', 35),
(3, 2, 3, 'A', 30),
(4, 1, 4, 'A', 35),
(5, 2, 1, 'A', 25),
(5, 2, 1, 'B', 25),
(6, 3, 2, 'A', 40),
(7, 4, 3, 'A', 35),
(8, 3, 4, 'A', 30),
(9, 4, 2, 'A', 25),
(10, 5, 3, 'A', 40),
(11, 6, 4, 'A', 35),
(12, 5, 1, 'A', 30),
(13, 6, 2, 'A', 35),
(14, 7, 3, 'A', 40),
(15, 8, 4, 'A', 35),
(16, 7, 1, 'A', 30),
(17, 8, 2, 'A', 25),
(18, 9, 3, 'A', 45),
(19, 10, 4, 'A', 45),
(20, 9, 1, 'A', 45);


-- Insert students into students table based on existing user records
INSERT INTO students (
    user_id, first_name, last_name, gender, date_of_birth, department_id, batch_year, semester, registration_number, contact_number
)
VALUES
-- CS Department Students
((SELECT user_id FROM users WHERE username = 'william.gibbs1'), 'William', 'Gibbs', 'male', '2000-03-15', 1, 2022, 4, 'CS22001', '+1-555-100-1001'),
((SELECT user_id FROM users WHERE username = 'dana.sims2'), 'Dana', 'Sims', 'female', '2001-05-22', 1, 2022, 4, 'CS22002', '+1-555-100-1002'),
((SELECT user_id FROM users WHERE username = 'ryan.anderson3'), 'Ryan', 'Anderson', 'male', '2000-11-08', 1, 2023, 2, 'CS23001', '+1-555-100-1003'),
((SELECT user_id FROM users WHERE username = 'michelle.serrano4'), 'Michelle', 'Serrano', 'female', '2002-01-30', 1, 2023, 2, 'CS23002', '+1-555-100-1004'),
-- AI Department Students
((SELECT user_id FROM users WHERE username = 'rhonda.adams5'), 'Rhonda', 'Adams', 'female', '2001-04-12', 2, 2022, 4, 'AI22001', '+1-555-100-1005'),
((SELECT user_id FROM users WHERE username = 'danny.martinez6'), 'Danny', 'Martinez', 'male', '2000-09-27', 2, 2022, 4, 'AI22002', '+1-555-100-1006'),
((SELECT user_id FROM users WHERE username = 'brendan.cain7'), 'Brendan', 'Cain', 'male', '2002-06-18', 2, 2023, 2, 'AI23001', '+1-555-100-1007'),
((SELECT user_id FROM users WHERE username = 'ashley.dixon8'), 'Ashley', 'Dixon', 'female', '2001-10-05', 2, 2023, 2, 'AI23002', '+1-555-100-1008'),
-- Data Science Department Students
((SELECT user_id FROM users WHERE username = 'christopher.terry9'), 'Christopher', 'Terry', 'male', '2000-07-14', 3, 2022, 4, 'DS22001', '+1-555-100-1009'),
((SELECT user_id FROM users WHERE username = 'cheryl.harris10'), 'Cheryl', 'Harris', 'female', '2001-02-25', 3, 2022, 4, 'DS22002', '+1-555-100-1010'),
((SELECT user_id FROM users WHERE username = 'scott.wilson11'), 'Scott', 'Wilson', 'male', '2002-12-03', 3, 2023, 2, 'DS23001', '+1-555-100-1011'),
((SELECT user_id FROM users WHERE username = 'patricia.oconnor12'), 'Patricia', 'O\'Connor', 'female', '2000-08-19', 3, 2023, 2, 'DS23002', '+1-555-100-1012'),
-- Cybersecurity Department Students
((SELECT user_id FROM users WHERE username = 'holly.rice13'), 'Holly', 'Rice', 'female', '2001-11-29', 4, 2022, 4, 'CY22001', '+1-555-100-1013'),
((SELECT user_id FROM users WHERE username = 'james.brown14'), 'James', 'Brown', 'male', '2000-04-07', 4, 2022, 4, 'CY22002', '+1-555-100-1014'),
((SELECT user_id FROM users WHERE username = 'melissa.herrera15'), 'Melissa', 'Herrera', 'female', '2002-03-21', 4, 2023, 2, 'CY23001', '+1-555-100-1015'),
((SELECT user_id FROM users WHERE username = 'peggy.adams16'), 'Peggy', 'Adams', 'female', '2001-09-10', 4, 2023, 2, 'CY23002', '+1-555-100-1016'),
-- Humanities Department Students
((SELECT user_id FROM users WHERE username = 'nicole.pearson17'), 'Nicole', 'Pearson', 'female', '2000-12-15', 5, 2022, 4, 'HM22001', '+1-555-100-1017'),
((SELECT user_id FROM users WHERE username = 'zachary.collins18'), 'Zachary', 'Collins', 'male', '2001-06-30', 5, 2022, 4, 'HM22002', '+1-555-100-1018'),
((SELECT user_id FROM users WHERE username = 'sarah.anderson19'), 'Sarah', 'Anderson', 'female', '2002-05-14', 5, 2023, 2, 'HM23001', '+1-555-100-1019'),
((SELECT user_id FROM users WHERE username = 'chad.gonzalez20'), 'Chad', 'Gonzalez', 'male', '2000-08-02', 5, 2023, 2, 'HM23002', '+1-555-100-1020');


-- Populate student_enrollments table (enrolling students in classes)
INSERT INTO student_enrollments (student_id, offering_id, status) VALUES
-- CS students in CS courses
(1, 1, 'active'), -- William Gibbs in CS101 Section A
(1, 5, 'active'), -- William Gibbs in CS104 Section A
(2, 2, 'active'), -- Dana Sims in CS101 Section B
(2, 5, 'active'), -- Dana Sims in CS104 Section A
(3, 3, 'active'), -- Ryan Anderson in CS102 Section A
(3, 6, 'active'), -- Ryan Anderson in CS105 Section A
(4, 4, 'active'), -- Michelle Serrano in CS103 Section A
(4, 7, 'active'), -- Michelle Serrano in CS105 Section B
-- AI students in AI courses
(5, 8, 'active'), -- Rhonda Adams in AI201 Section A
(5, 10, 'active'), -- Rhonda Adams in AI203 Section A
(6, 9, 'active'), -- Danny Martinez in AI202 Section A
(6, 11, 'active'), -- Danny Martinez in AI204 Section A
(7, 8, 'active'), -- Brendan Cain in AI201 Section A
(7, 9, 'active'), -- Brendan Cain in AI202 Section A
(8, 10, 'active'), -- Ashley Dixon in AI203 Section A
(8, 11, 'active'), -- Ashley Dixon in AI204 Section A
-- Data Science students in DS courses
(9, 12, 'active'), -- Christopher Terry in DS301 Section A
(9, 14, 'active'), -- Christopher Terry in DS303 Section A
(10, 13, 'active'), -- Cheryl Harris in DS302 Section A
(10, 15, 'active'), -- Cheryl Harris in DS304 Section A
(11, 12, 'active'), -- Scott Wilson in DS301 Section A
(11, 13, 'active'), -- Scott Wilson in DS302 Section A
(12, 14, 'active'), -- Patricia O'Connor in DS303 Section A
(12, 15, 'active'), -- Patricia O'Connor in DS304 Section A
-- Cybersecurity students in CY courses
(13, 16, 'active'), -- Holly Rice in CY401 Section A
(13, 18, 'active'), -- Holly Rice in CY403 Section A
(14, 17, 'active'), -- James Brown in CY402 Section A
(14, 19, 'active'), -- James Brown in CY404 Section A
(15, 16, 'active'), -- Melissa Herrera in CY401 Section A
(15, 17, 'active'), -- Melissa Herrera in CY402 Section A
(16, 18, 'active'), -- Peggy Adams in CY403 Section A
(16, 19, 'active'), -- Peggy Adams in CY404 Section A
-- Humanities students in HM courses
(17, 20, 'active'), -- Nicole Pearson in HM501 Section A
(17, 22, 'active'), -- Nicole Pearson in HM503 Section A
(18, 21, 'active'), -- Zachary Collins in HM502 Section A
(18, 20, 'active'), -- Zachary Collins in HM501 Section A
(19, 21, 'active'), -- Sarah Anderson in HM502 Section A
(19, 22, 'active'), -- Sarah Anderson in HM503 Section A
(20, 20, 'active'), -- Chad Gonzalez in HM501 Section A
(20, 21, 'active'); -- Chad Gonzalez in HM502 Section A


-- Populate faculty_statistics table with initial data
INSERT INTO faculty_statistics (faculty_id, avg_rating, total_feedbacks)
SELECT faculty_id, 0, 0 FROM faculty;

-- Populate feedback_forms for current term (Spring 2025, term_id=4)
INSERT INTO feedback_forms (course_id, term_id, semester, year, form_title, is_active, start_date, end_date, status)
SELECT 
    course_id, 
    4, -- Spring 2025 term_id
    2, -- Spring semester
    2025, -- Year
    CONCAT('Feedback for ', course_title, ' - Spring 2025'),
    TRUE, -- is_active
    '2025-05-01 00:00:00', -- start_date (beginning of May)
    '2025-05-15 23:59:59', -- end_date (mid May)
    'open' -- status
FROM courses
WHERE course_id IN (
    SELECT DISTINCT course_id 
    FROM class_offerings 
    WHERE term_id = 4
);

-- Populate feedback_questions for each form
-- First, get the IDs of the forms we just created
SET @form_count = (SELECT COUNT(*) FROM feedback_forms);

-- Insert standard questions for each form
INSERT INTO feedback_questions (form_id, question_text, question_type, is_required)
SELECT 
    form_id,
    'How would you rate the overall quality of instruction in this course?',
    'scale_1_5',
    TRUE
FROM feedback_forms;

INSERT INTO feedback_questions (form_id, question_text, question_type, is_required)
SELECT 
    form_id,
    'How well did the instructor explain complex concepts?',
    'scale_1_5',
    TRUE
FROM feedback_forms;

INSERT INTO feedback_questions (form_id, question_text, question_type, is_required)
SELECT 
    form_id,
    'Was the course material presented in an organized manner?',
    'scale_1_5',
    TRUE
FROM feedback_forms;

INSERT INTO feedback_questions (form_id, question_text, question_type, is_required)
SELECT 
    form_id,
    'How responsive was the instructor to student questions and concerns?',
    'scale_1_5',
    TRUE
FROM feedback_forms;

INSERT INTO feedback_questions (form_id, question_text, question_type, is_required)
SELECT 
    form_id,
    'What aspects of the course did you find most beneficial?',
    'text',
    FALSE
FROM feedback_forms;

INSERT INTO feedback_questions (form_id, question_text, question_type, is_required)
SELECT 
    form_id,
    'Do you have any suggestions for improving this course?',
    'text',
    FALSE
FROM feedback_forms;



-- Insert some completed feedback responses for previous term (Fall 2024, term_id=3)
-- First create feedback forms for previous term
INSERT INTO feedback_forms (course_id, term_id, semester, year, form_title, is_active, start_date, end_date, status)
SELECT 
    course_id, 
    3, -- Fall 2024 term_id
    1, -- Fall semester
    2024, -- Year
    CONCAT('Feedback for ', course_title, ' - Fall 2024'),
    FALSE, -- is_active (these are now closed)
    '2024-12-01 00:00:00', -- start_date
    '2024-12-15 23:59:59', -- end_date
    'closed' -- status
FROM courses
WHERE course_id IN (
    SELECT DISTINCT course_id 
    FROM class_offerings 
    WHERE term_id = 3
);

-- Add questions to these previous forms too
INSERT INTO feedback_questions (form_id, question_text, question_type, is_required)
SELECT 
    form_id,
    'How would you rate the overall quality of instruction in this course?',
    'scale_1_5',
    TRUE
FROM feedback_forms
WHERE term_id = 3;

INSERT INTO feedback_questions (form_id, question_text, question_type, is_required)
SELECT 
    form_id,
    'How well did the instructor explain complex concepts?',
    'scale_1_5',
    TRUE
FROM feedback_forms
WHERE term_id = 3;

INSERT INTO feedback_questions (form_id, question_text, question_type, is_required)
SELECT 
    form_id,
    'What aspects of the course did you find most beneficial?',
    'text',
    FALSE
FROM feedback_forms
WHERE term_id = 3;

-- Insert some feedback responses for Fall 2024 courses
-- First, get a mapping of offering_id to faculty_id for term 3
CREATE TEMPORARY TABLE term3_offering AS
SELECT o.offering_id, o.course_id, o.faculty_id, f.form_id
FROM class_offerings o
JOIN feedback_forms f ON o.course_id = f.course_id AND o.term_id = f.term_id
WHERE o.term_id = 3;

-- Now insert some feedback responses
-- For CS course (Algorithms taught by Sarah Johnson)
INSERT INTO feedback_responses (form_id, student_id, faculty_id, offering_id, is_anonymous)
SELECT 
    form_id,
    3, -- Ryan Anderson
    2, -- Sarah Johnson
    offering_id,
    TRUE -- anonymous
FROM term3_offerings
WHERE course_id = 3
LIMIT 1;

SET @last_response_id = LAST_INSERT_ID();

-- Insert answers for this response
INSERT INTO feedback_answers (response_id, question_id, rating_value, answer_text)
SELECT 
    @last_response_id,
    question_id,
    CASE 
        WHEN question_type = 'scale_1_5' AND question_text LIKE '%overall quality%' THEN 4
        WHEN question_type = 'scale_1_5' AND question_text LIKE '%complex concepts%' THEN 5
        ELSE NULL
    END,
    CASE
        WHEN question_type = 'text' THEN 'The practical examples were very helpful in understanding the course material.'
        ELSE NULL
    END
FROM feedback_questions
WHERE form_id = (SELECT form_id FROM term3_offerings WHERE course_id = 3 LIMIT 1);

-- For AI course (Machine Learning Fundamentals taught by Rachel Patel)
INSERT INTO feedback_responses (form_id, student_id, faculty_id, offering_id, is_anonymous)
SELECT 
    form_id,
    7, -- Brendan Cain
    4, -- Rachel Patel
    offering_id,
    FALSE -- not anonymous
FROM term3_offerings
WHERE course_id = 7
LIMIT 1;

SET @last_response_id = LAST_INSERT_ID();

-- Insert answers for this response
INSERT INTO feedback_answers (response_id, question_id, rating_value, answer_text)
SELECT 
    @last_response_id,
    question_id,
    CASE 
        WHEN question_type = 'scale_1_5' AND question_text LIKE '%overall quality%' THEN 5
        WHEN question_type = 'scale_1_5' AND question_text LIKE '%complex concepts%' THEN 4
        ELSE NULL
    END,
    CASE
        WHEN question_type = 'text' THEN 'The hands-on projects really helped solidify the theoretical concepts.'
        ELSE NULL
    END
FROM feedback_questions
WHERE form_id = (SELECT form_id FROM term3_offerings WHERE course_id = 7 LIMIT 1);

-- Add some faculty replies to feedback
INSERT INTO faculty_feedback_replies (response_id, faculty_id, reply_text)
VALUES
(@last_response_id, 4, 'Thank you for your feedback! I am glad the projects were helpful. I will continue to incorporate hands-on elements in future classes');

-- Update faculty statistics based on feedback
UPDATE faculty_statistics
SET 
    avg_rating = (
        SELECT AVG(rating_value)
        FROM feedback_answers a
        JOIN feedback_responses r ON a.response_id = r.response_id
        WHERE r.faculty_id = faculty_statistics.faculty_id AND a.rating_value IS NOT NULL
    ),
    total_feedbacks = (
        SELECT COUNT(DISTINCT response_id)
        FROM feedback_responses
        WHERE faculty_id = faculty_statistics.faculty_id
    ),
    last_feedback_date = (
        SELECT MAX(submitted_at)
        FROM feedback_responses
        WHERE faculty_id = faculty_statistics.faculty_id
    )
WHERE faculty_id IN (
    SELECT DISTINCT faculty_id
    FROM feedback_responses
);


-- Add entries to the faculty_ratings_summary table
INSERT INTO faculty_ratings_summary (
    faculty_id, course_id, term_id, department_id, offering_id, 
    question_id, question_category, avg_rating, median_rating, 
    min_rating, max_rating, response_count, anonymous_count
)
SELECT 
    r.faculty_id,
    c.course_id,
    ff.term_id,
    c.department_id,
    r.offering_id,
    fq.question_id,
    CASE 
        WHEN fq.question_text LIKE '%overall quality%' THEN 'Overall Quality'
        WHEN fq.question_text LIKE '%complex concepts%' THEN 'Concept Explanation'
        ELSE 'General'
    END as question_category,
    AVG(fa.rating_value) as avg_rating,
    AVG(fa.rating_value) as median_rating, -- Using AVG as an approximation for median
    MIN(fa.rating_value) as min_rating,
    MAX(fa.rating_value) as max_rating,
    COUNT(DISTINCT r.response_id) as response_count,
    SUM(CASE WHEN r.is_anonymous = TRUE THEN 1 ELSE 0 END) as anonymous_count
FROM feedback_responses r
JOIN feedback_answers fa ON r.response_id = fa.response_id
JOIN feedback_questions fq ON fa.question_id = fq.question_id
JOIN feedback_forms ff ON fq.form_id = ff.form_id
JOIN class_offerings co ON r.offering_id = co.offering_id
JOIN courses c ON co.course_id = c.course_id
WHERE fa.rating_value IS NOT NULL
GROUP BY r.faculty_id, c.course_id, ff.term_id, c.department_id, r.offering_id, fq.question_id;

-- Add some activity logs
INSERT INTO activity_logs (user_id, action, description, ip_address)
VALUES
((SELECT user_id FROM users WHERE username = 'william.gibbs1'), 'LOGIN', 'User logged in', '192.168.1.101'),
((SELECT user_id FROM users WHERE username = 'william.gibbs1'), 'VIEW', 'Viewed course materials for CS101', '192.168.1.101'),
((SELECT user_id FROM users WHERE username = 'dana.sims2'), 'LOGIN', 'User logged in', '192.168.1.102'),
((SELECT user_id FROM users WHERE username = 'dana.sims2'), 'SUBMIT', 'Submitted assignment for CS104', '192.168.1.102'),
((SELECT user_id FROM users WHERE username = 'john.smith'), 'LOGIN', 'User logged in', '192.168.1.201'),
((SELECT user_id FROM users WHERE username = 'john.smith'), 'UPDATE', 'Updated course materials for CS101', '192.168.1.201'),
((SELECT user_id FROM users WHERE username = 'sarah.johnson'), 'LOGIN', 'User logged in', '192.168.1.202'),
((SELECT user_id FROM users WHERE username = 'sarah.johnson'), 'GRADE', 'Graded assignments for CS103', '192.168.1.202'),
((SELECT user_id FROM users WHERE username = 'admin.user'), 'LOGIN', 'User logged in', '192.168.1.250'),
((SELECT user_id FROM users WHERE username = 'admin.user'), 'CREATE', 'Created new user account', '192.168.1.250');

-- Add user documents
INSERT INTO user_documents (user_id, document_type, file_url, uploaded_at)
VALUES
((SELECT user_id FROM users WHERE username = 'john.smith'), 'profile_picture', 'https://teachtrack.edu/uploads/profiles/john_smith.jpg', '2024-01-15 10:30:00'),
((SELECT user_id FROM users WHERE username = 'john.smith'), 'cv', 'https://teachtrack.edu/uploads/documents/john_smith_cv.pdf', '2024-01-15 10:35:00'),
((SELECT user_id FROM users WHERE username = 'sarah.johnson'), 'profile_picture', 'https://teachtrack.edu/uploads/profiles/sarah_johnson.jpg', '2024-01-20 14:15:00'),
((SELECT user_id FROM users WHERE username = 'sarah.johnson'), 'certification', 'https://teachtrack.edu/uploads/documents/sarah_johnson_cert.pdf', '2024-01-20 14:20:00'),
((SELECT user_id FROM users WHERE username = 'william.gibbs1'), 'profile_picture', 'https://teachtrack.edu/uploads/profiles/william_gibbs.jpg', '2024-02-05 09:45:00'),
((SELECT user_id FROM users WHERE username = 'dana.sims2'), 'profile_picture', 'https://teachtrack.edu/uploads/profiles/dana_sims.jpg', '2024-02-10 11:20:00');

-- Grades for previous term courses (Fall 2024)
UPDATE student_enrollments
SET grade = 'A'
WHERE student_id IN (1, 5, 9, 13, 17) 
AND offering_id IN (SELECT offering_id FROM class_offerings WHERE term_id = 3);

UPDATE student_enrollments
SET grade = 'B+'
WHERE student_id IN (2, 6, 10, 14, 18) 
AND offering_id IN (SELECT offering_id FROM class_offerings WHERE term_id = 3);

UPDATE student_enrollments
SET grade = 'A-'
WHERE student_id IN (3, 7, 11, 15, 19) 
AND offering_id IN (SELECT offering_id FROM class_offerings WHERE term_id = 3);

UPDATE student_enrollments
SET grade = 'B'
WHERE student_id IN (4, 8, 12, 16, 20) 
AND offering_id IN (SELECT offering_id FROM class_offerings WHERE term_id = 3);

-- Mark previous term enrollments as completed
UPDATE student_enrollments
SET status = 'completed'
WHERE offering_id IN (SELECT offering_id FROM class_offerings WHERE term_id <= 3);



UPDATE users
SET profile_image_url = CONCAT(
    'https://randomuser.me/api/portraits/',
    CASE FLOOR(RAND() * 2)
        WHEN 0 THEN 'men/'
        ELSE 'women/'
    END,
    FLOOR(RAND() * 100), '.jpg'
)
WHERE role = 'faculty';

SET SQL_SAFE_UPDATES = 1;


-- First, update an existing form in the current term to make it active and with open dates
UPDATE feedback_forms
SET 
    is_active = TRUE,
    status = 'open',
    start_date = DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY),
    end_date = DATE_ADD(CURRENT_DATE(), INTERVAL 10 DAY)
WHERE 
    term_id = 4 -- Spring 2025 (current term)
LIMIT 3; -- Update a few forms

-- If the above doesn't work, insert a completely new form
INSERT INTO feedback_forms (
    course_id, 
    term_id, 
    semester, 
    year, 
    form_title, 
    is_active, 
    start_date, 
    end_date, 
    status
)
SELECT 
    co.course_id,
    4, -- Spring 2025 term ID
    2, -- Spring semester
    2025, -- Year
    CONCAT('Urgent Course Feedback - ', c.course_title),
    TRUE, -- is_active
    DATE_SUB(CURRENT_DATE(), INTERVAL 2 DAY), -- start_date (2 days ago)
    DATE_ADD(CURRENT_DATE(), INTERVAL 14 DAY), -- end_date (14 days from now)
    'open' -- status
FROM 
    class_offerings co
JOIN 
    courses c ON co.course_id = c.course_id
WHERE 
    co.term_id = 4 -- Spring 2025
LIMIT 5; -- Create forms for 5 courses

-- Add standard questions to these new forms
INSERT INTO feedback_questions (form_id, question_text, question_type, is_required)
SELECT 
    form_id,
    'How would you rate the overall quality of instruction in this course?',
    'scale_1_5',
    TRUE
FROM 
    feedback_forms
WHERE 
    form_title LIKE 'Urgent Course Feedback%';

INSERT INTO feedback_questions (form_id, question_text, question_type, is_required)
SELECT 
    form_id,
    'What do you like most about this course?',
    'text',
    FALSE
FROM 
    feedback_forms
WHERE 
    form_title LIKE 'Urgent Course Feedback%';

-- Now run the query to get the forms and eligible students
SELECT 
    f.form_id,
    f.form_title,
    c.course_code,
    c.course_title,
    d.department_name,
    CONCAT(fac.first_name, ' ', fac.last_name) AS faculty_name,
    at.term_name,
    co.section,
    CONCAT(s.first_name, ' ', s.last_name) AS student_name,
    s.student_id,
    s.registration_number,
    u.email AS student_email,
    f.start_date,
    f.end_date,
    -- Check if the student has already submitted feedback
    (SELECT COUNT(*) FROM feedback_responses fr 
     WHERE fr.form_id = f.form_id 
     AND fr.student_id = s.student_id
     AND fr.offering_id = co.offering_id) AS response_submitted
FROM 
    feedback_forms f
JOIN 
    courses c ON f.course_id = c.course_id
JOIN 
    departments d ON c.department_id = d.department_id
JOIN 
    class_offerings co ON c.course_id = co.course_id AND f.term_id = co.term_id
JOIN 
    faculty fac ON co.faculty_id = fac.faculty_id
JOIN 
    academic_terms at ON f.term_id = at.term_id
JOIN 
    student_enrollments se ON co.offering_id = se.offering_id
JOIN 
    students s ON se.student_id = s.student_id
JOIN 
    users u ON s.user_id = u.user_id
WHERE 
    f.is_active = TRUE
AND 
    f.status = 'open'
AND
    CURRENT_DATE() BETWEEN f.start_date AND f.end_date
AND
    se.status = 'active'
ORDER BY 
    f.form_id, s.student_id;





