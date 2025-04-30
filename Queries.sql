use TeachTrack;

SELECT 
    c.course_id,
    c.course_code,
    c.course_title,
    c.course_type,
    c.credit_hours,
    co.section,
    co.term_id
FROM 
    users u
JOIN 
    faculty f ON u.user_id = f.user_id
JOIN 
    class_offerings co ON f.faculty_id = co.faculty_id
JOIN 
    courses c ON co.course_id = c.course_id
WHERE 
    u.user_id = 23;



SELECT DISTINCT f.user_id, u.username, f.first_name, f.last_name
FROM feedback_responses fr
JOIN class_offerings co ON fr.offering_id = co.offering_id
JOIN faculty f ON co.faculty_id = f.faculty_id
JOIN users u ON f.user_id = u.user_id;


SELECT 
    c.course_code,
    c.course_title,
    co.section,
    at.term_name,
    at.year,
    s.first_name,
    s.last_name
FROM users u
JOIN students s ON u.user_id = s.user_id
JOIN student_enrollments se ON s.student_id = se.student_id
JOIN class_offerings co ON se.offering_id = co.offering_id
JOIN courses c ON co.course_id = c.course_id
JOIN academic_terms at ON co.term_id = at.term_id
WHERE u.user_id = 13;

SELECT 
    ff.form_id,
    ff.form_title,
    ff.status,
    ff.is_active,
    ff.start_date,
    ff.end_date,
    c.course_code,
    c.course_title,
    at.term_name,
    at.year,
    at.semester
FROM feedback_forms ff
JOIN courses c ON ff.course_id = c.course_id
LEFT JOIN academic_terms at ON ff.term_id = at.term_id
ORDER BY ff.start_date DESC;


SELECT 
    c.course_id,
    c.course_code,
    c.course_title,
    co.section,
    at.term_name,
    at.year,
    at.semester
FROM students s
JOIN student_enrollments se ON s.student_id = se.student_id
JOIN class_offerings co ON se.offering_id = co.offering_id
JOIN courses c ON co.course_id = c.course_id
LEFT JOIN academic_terms at ON co.term_id = at.term_id
WHERE s.user_id = 13;


SELECT 
    ff.form_id,
    ff.form_title,
    ff.start_date,
    ff.end_date,
    ff.status AS form_status
FROM 
    feedback_forms ff
ORDER BY 
    ff.form_id;


SELECT 
    ff.form_id,
    ff.form_title,
    ff.start_date,
    ff.end_date,
    ff.status AS form_status
FROM 
    feedback_forms ff
WHERE 
    ff.status = 'open'
ORDER BY 
    ff.form_id;
    
    
    SELECT 
    fq.question_id,
    fq.question_text,
    fq.question_type,
    fq.is_required
FROM 
    feedback_questions fq
WHERE 
    fq.form_id = 3
ORDER BY 
    fq.question_id;



SELECT 
    f.faculty_id,
    f.first_name,
    f.last_name,
    f.designation,
    f.contact_number,
    f.years_of_experience,
    d.department_name
FROM 
    faculty f
JOIN 
    departments d ON f.department_id = d.department_id
WHERE 
    f.department_id = 2
ORDER BY 
    f.faculty_id;


SELECT 
    f.faculty_id,
    f.first_name,
    f.last_name,
    f.gender,
    f.date_of_birth,
    f.designation,
    f.contact_number,
    f.qualifications,
    f.years_of_experience,
    f.office_location,
    d.department_name,
    u.user_id,
    u.username,
    u.email,
    u.profile_image_url
FROM faculty f
LEFT JOIN departments d ON f.department_id = d.department_id
LEFT JOIN users u ON f.user_id = u.user_id;


SELECT 
    question_id,
    question_text,
    question_type,
    is_required
FROM feedback_questions
WHERE form_id = 1;


SELECT DISTINCT s.student_id, u.user_id, u.username, s.first_name, s.last_name
FROM students s
JOIN users u ON s.user_id = u.user_id
JOIN student_enrollments se ON s.student_id = se.student_id
JOIN class_offerings co ON se.offering_id = co.offering_id
JOIN feedback_forms ff ON co.course_id = ff.course_id AND co.term_id = ff.term_id
LEFT JOIN feedback_responses fr 
    ON fr.form_id = ff.form_id 
    AND fr.student_id = s.student_id 
    AND fr.offering_id = se.offering_id
WHERE ff.is_active = TRUE
  AND fr.response_id IS NULL;
  
  
  SELECT fq.question_id, fq.question_text, fq.question_type
FROM courses c
JOIN feedback_forms ff ON c.course_id = ff.course_id
JOIN feedback_questions fq ON ff.form_id = fq.form_id
WHERE c.course_code = 'CS401' AND c.course_title = 'Advanced Database Systems';


SELECT DISTINCT s.*
FROM students s
JOIN student_enrollments se ON s.student_id = se.student_id
JOIN class_offerings co ON se.offering_id = co.offering_id
JOIN feedback_forms ff ON co.course_id = ff.course_id AND co.term_id = ff.term_id
WHERE se.status = 'active'
  AND ff.is_active = TRUE
  AND ff.status = 'open'
  AND NOW() BETWEEN ff.start_date AND ff.end_date;
  
  
  SELECT
    ffr.reply_id,
    ffr.reply_text,
    ffr.replied_at,
    fr.submitted_at AS feedback_submitted_at,
    fac.first_name AS faculty_first_name,
    fac.last_name AS faculty_last_name,
    stu.first_name AS student_first_name,
    stu.last_name AS student_last_name,
    c.course_title,
    c.course_code,
    at.term_name,
    at.year
FROM faculty_feedback_replies ffr
JOIN feedback_responses fr ON ffr.response_id = fr.response_id
JOIN faculty fac ON ffr.faculty_id = fac.faculty_id
LEFT JOIN students stu ON fr.student_id = stu.student_id
JOIN class_offerings co ON fr.offering_id = co.offering_id
JOIN courses c ON co.course_id = c.course_id
JOIN academic_terms at ON co.term_id = at.term_id
ORDER BY ffr.replied_at DESC;


INSERT INTO feedback_responses (
    form_id, student_id, faculty_id, offering_id, submitted_at, is_anonymous
)
SELECT
    ff.form_id,
    s.student_id,
    co.faculty_id,
    co.offering_id,
    NOW(),
    FALSE
FROM feedback_forms ff
JOIN courses c ON ff.course_id = c.course_id
JOIN class_offerings co ON c.course_id = co.course_id AND ff.term_id = co.term_id
JOIN students s ON s.user_id = 13
WHERE ff.form_title = 'Feedback for Statistical Analysis - Spring 2025'
  AND c.course_code = 'DS302'
LIMIT 1;


INSERT INTO feedback_answers (response_id, question_id, answer_text, rating_value)
SELECT
    fr.response_id,
    fq.question_id,
    CASE
        WHEN fq.question_type IN ('text', 'yes_no') THEN 'Sample answer'
        ELSE NULL
    END AS answer_text,
    CASE
        WHEN fq.question_type IN ('rating', 'scale_1_5') THEN 4
        WHEN fq.question_type = 'scale_1_10' THEN 8
        ELSE NULL
    END AS rating_value
FROM feedback_forms ff
JOIN feedback_questions fq ON ff.form_id = fq.form_id
JOIN courses c ON ff.course_id = c.course_id
JOIN academic_terms t ON ff.term_id = t.term_id
JOIN class_offerings co ON co.course_id = c.course_id AND co.term_id = t.term_id
JOIN students s ON s.user_id = 13
JOIN feedback_responses fr ON fr.form_id = ff.form_id AND fr.student_id = s.student_id
WHERE ff.form_title = 'Feedback for Statistical Analysis - Spring 2025'
  AND c.course_code = 'DS302'
ORDER BY fr.submitted_at DESC
LIMIT 10;


SELECT
    fr.response_id,
    fq.question_id,
    fq.question_text,
    fq.question_type,
    fa.answer_text,
    fa.rating_value,
    fr.submitted_at
FROM feedback_answers fa
JOIN feedback_questions fq ON fa.question_id = fq.question_id
JOIN feedback_responses fr ON fa.response_id = fr.response_id
JOIN students s ON fr.student_id = s.student_id
JOIN users u ON s.user_id = u.user_id
JOIN feedback_forms ff ON fr.form_id = ff.form_id
WHERE u.user_id = 13
  AND ff.form_title = 'Feedback for Statistical Analysis - Spring 2025'
ORDER BY fr.submitted_at DESC, fq.question_id;

SELECT
    ffr.reply_id,
    ffr.response_id,
    CONCAT(fac.first_name, ' ', fac.last_name) AS faculty_name,
    ffr.reply_text,
    ffr.replied_at
FROM faculty_feedback_replies ffr
JOIN feedback_responses fr ON ffr.response_id = fr.response_id
JOIN feedback_forms ff ON fr.form_id = ff.form_id
JOIN faculty fac ON ffr.faculty_id = fac.faculty_id
WHERE ff.form_title = 'Feedback for Statistical Analysis - Spring 2025'
ORDER BY ffr.replied_at DESC;


INSERT INTO faculty_feedback_replies (response_id, faculty_id, reply_text)
SELECT 
    fr.response_id,
    fr.faculty_id,
    'Thank you for your feedback. I appreciate your comments and will work on improving the practical sessions.'
FROM feedback_responses fr
JOIN students s ON fr.student_id = s.student_id
JOIN users u ON s.user_id = u.user_id
JOIN feedback_forms ff ON fr.form_id = ff.form_id
WHERE u.user_id = 13
  AND ff.form_title = 'Feedback for Statistical Analysis - Spring 2025'
LIMIT 1;


SELECT 
    u.username AS student_username,
    CONCAT(fac.first_name, ' ', fac.last_name) AS faculty_name,
    ff.form_title,
    ffr.reply_text,
    ffr.replied_at
FROM faculty_feedback_replies ffr
JOIN feedback_responses fr ON ffr.response_id = fr.response_id
JOIN feedback_forms ff ON fr.form_id = ff.form_id
JOIN faculty fac ON ffr.faculty_id = fac.faculty_id
JOIN students s ON fr.student_id = s.student_id
JOIN users u ON s.user_id = u.user_id
WHERE u.user_id = 13
  AND ff.form_title = 'Feedback for Statistical Analysis - Spring 2025';


SELECT 
    u.username AS student_username,
    ff.form_title,
    fq.question_text,
    fa.answer_text,
    fa.rating_value
FROM feedback_answers fa
JOIN feedback_responses fr ON fa.response_id = fr.response_id
JOIN feedback_questions fq ON fa.question_id = fq.question_id
JOIN feedback_forms ff ON fr.form_id = ff.form_id
JOIN students s ON fr.student_id = s.student_id
JOIN users u ON s.user_id = u.user_id
WHERE u.user_id = 13
  AND fr.form_id = 3;


SELECT 
    u.username AS student_username,
    c.course_code,
    c.course_title,
    se.status,
    se.grade
FROM student_enrollments se
JOIN students s ON se.student_id = s.student_id
JOIN users u ON s.user_id = u.user_id
JOIN class_offerings co ON se.offering_id = co.offering_id
JOIN courses c ON co.course_id = c.course_id
WHERE u.user_id = 13
  AND se.status = 'completed';


