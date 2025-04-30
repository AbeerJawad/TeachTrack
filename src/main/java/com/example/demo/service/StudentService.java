package com.example.demo.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.example.demo.model.Student;

@Service
public class StudentService {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Get courses enrolled by a student based on user ID with optional filtering
    public List<Map<String, Object>> getCoursesByStudentUserId(Long userId, String search, String courseCode) {
        // First get the student_id from user_id
        String studentIdSql = "SELECT student_id FROM students WHERE user_id = ?";
        Long studentId = jdbcTemplate.queryForObject(studentIdSql, Long.class, userId);
        
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT c.course_id, c.course_code, c.course_title as course_name, ");
        sql.append("CONCAT(f.first_name, ' ', f.last_name) as instructor, ");
        sql.append("CONCAT(at.semester, ' ', at.year) as semester, ");
        sql.append("CASE WHEN EXISTS (SELECT 1 FROM feedback_responses fr ");
        sql.append("  JOIN class_offerings co2 ON fr.offering_id = co2.offering_id ");
        sql.append("  WHERE fr.student_id = ? AND co2.offering_id = co.offering_id) ");
        sql.append("THEN 'Completed' ELSE 'Pending' END as feedback_status ");
        sql.append("FROM student_enrollments se ");
        sql.append("JOIN class_offerings co ON se.offering_id = co.offering_id ");
        sql.append("JOIN courses c ON co.course_id = c.course_id ");
        sql.append("JOIN faculty f ON co.faculty_id = f.faculty_id ");
        sql.append("JOIN academic_terms at ON co.term_id = at.term_id ");
        sql.append("WHERE se.student_id = ? AND se.status = 'active' ");
        
        List<Object> params = new ArrayList<>();
        params.add(studentId);
        params.add(studentId);
        
        // Add search filter if provided
        if (search != null && !search.trim().isEmpty()) {
            sql.append("AND (c.course_code LIKE ? OR c.course_title LIKE ?) ");
            params.add("%" + search + "%");
            params.add("%" + search + "%");
        }
        
        // Add course code filter if provided
        if (courseCode != null && !courseCode.trim().isEmpty()) {
            sql.append("AND c.course_code = ? ");
            params.add(courseCode);
        }
        
        sql.append("ORDER BY at.year DESC, at.semester DESC, c.course_code");
        
        return jdbcTemplate.queryForList(sql.toString(), params.toArray());
    }

    // Get student dashboard statistics
    public Map<String, Object> getStudentStatsByUserId(Long userId) {
        // First get the student_id from user_id
        String studentIdSql = "SELECT student_id FROM students WHERE user_id = ?";
        Long studentId = jdbcTemplate.queryForObject(studentIdSql, Long.class, userId);
        
        Map<String, Object> stats = new HashMap<>();
        
        // Count enrolled courses
        String enrolledSql = "SELECT COUNT(*) FROM student_enrollments se " +
                             "JOIN class_offerings co ON se.offering_id = co.offering_id " +
                             "JOIN academic_terms at ON co.term_id = at.term_id " +
                             "WHERE se.student_id = ? AND se.status = 'active' AND at.is_current = TRUE";
        
        int enrolledCourses = jdbcTemplate.queryForObject(enrolledSql, Integer.class, studentId);
        stats.put("enrolledCourses", enrolledCourses);
        
        // Count completed feedback
        String completedFeedbackSql = "SELECT COUNT(DISTINCT fr.form_id) FROM feedback_responses fr " +
                                     "WHERE fr.student_id = ?";
        
        int completedFeedback = jdbcTemplate.queryForObject(completedFeedbackSql, Integer.class, studentId);
        stats.put("completedFeedback", completedFeedback);
        
        // Count pending feedback
        String pendingFeedbackSql = "SELECT COUNT(*) FROM feedback_forms ff " +
                                   "JOIN class_offerings co ON ff.course_id = co.course_id " +
                                   "JOIN student_enrollments se ON co.offering_id = se.offering_id " +
                                   "LEFT JOIN feedback_responses fr ON (ff.form_id = fr.form_id AND fr.student_id = se.student_id) " +
                                   "WHERE se.student_id = ? AND fr.response_id IS NULL " +
                                   "AND ff.status = 'open' AND CURRENT_TIMESTAMP BETWEEN ff.start_date AND ff.end_date";
        
        int pendingFeedback = jdbcTemplate.queryForObject(pendingFeedbackSql, Integer.class, studentId);
        stats.put("pendingFeedback", pendingFeedback);
        
        return stats;
    }

    // Get feedback forms available for the student
    public Map<String, Object> getFeedbackFormsByStudentUserId(Long userId, int page, int size) {
        // First get the student_id from user_id
        String studentIdSql = "SELECT student_id FROM students WHERE user_id = ?";
        Long studentId = jdbcTemplate.queryForObject(studentIdSql, Long.class, userId);
        
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT ff.form_id, c.course_code, c.course_title as course_name, ");
        sql.append("ff.form_title, ff.end_date as deadline, ");
        sql.append("CASE WHEN fr.response_id IS NULL THEN 'Open' ELSE 'Submitted' END as status ");
        sql.append("FROM student_enrollments se ");
        sql.append("JOIN class_offerings co ON se.offering_id = co.offering_id ");
        sql.append("JOIN courses c ON co.course_id = c.course_id ");
        sql.append("JOIN feedback_forms ff ON c.course_id = ff.course_id AND co.term_id = ff.term_id ");
        sql.append("LEFT JOIN feedback_responses fr ON (ff.form_id = fr.form_id AND fr.student_id = se.student_id) ");
        sql.append("WHERE se.student_id = ? AND se.status = 'active' ");
        sql.append("AND ff.status = 'open' AND CURRENT_TIMESTAMP BETWEEN ff.start_date AND ff.end_date ");
        sql.append("ORDER BY ff.end_date ASC ");
        sql.append("LIMIT ? OFFSET ?");
        
        List<Map<String, Object>> content = jdbcTemplate.queryForList(
            sql.toString(), 
            studentId, 
            size, 
            page * size
        );
        
        // Count total items for pagination
        String countSql = "SELECT COUNT(*) FROM student_enrollments se " +
                          "JOIN class_offerings co ON se.offering_id = co.offering_id " +
                          "JOIN courses c ON co.course_id = c.course_id " +
                          "JOIN feedback_forms ff ON c.course_id = ff.course_id AND co.term_id = ff.term_id " +
                          "LEFT JOIN feedback_responses fr ON (ff.form_id = fr.form_id AND fr.student_id = se.student_id) " +
                          "WHERE se.student_id = ? AND se.status = 'active' " +
                          "AND ff.status = 'open' AND CURRENT_TIMESTAMP BETWEEN ff.start_date AND ff.end_date";
        
        int totalItems = jdbcTemplate.queryForObject(countSql, Integer.class, studentId);
        
        Map<String, Object> result = new HashMap<>();
        result.put("content", content);
        result.put("totalItems", totalItems);
        result.put("totalPages", (int) Math.ceil((double) totalItems / size));
        result.put("currentPage", page);
        
        return result;
    }

    // Get student's submitted feedback
    public Map<String, Object> getSubmittedFeedbackByStudentUserId(Long userId, int page, int size) {
        // First get the student_id from user_id
        String studentIdSql = "SELECT student_id FROM students WHERE user_id = ?";
        Long studentId = jdbcTemplate.queryForObject(studentIdSql, Long.class, userId);
        
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT fr.response_id, c.course_code, c.course_title as course_name, ");
        sql.append("ff.form_title, fr.submitted_at, ");
        sql.append("CONCAT(f.first_name, ' ', f.last_name) as instructor, ");
        sql.append("(SELECT COUNT(*) FROM faculty_feedback_replies ffr WHERE ffr.response_id = fr.response_id) as has_reply ");
        sql.append("FROM feedback_responses fr ");
        sql.append("JOIN feedback_forms ff ON fr.form_id = ff.form_id ");
        sql.append("JOIN courses c ON ff.course_id = c.course_id ");
        sql.append("JOIN class_offerings co ON fr.offering_id = co.offering_id ");
        sql.append("JOIN faculty f ON co.faculty_id = f.faculty_id ");
        sql.append("WHERE fr.student_id = ? ");
        sql.append("ORDER BY fr.submitted_at DESC ");
        sql.append("LIMIT ? OFFSET ?");
        
        List<Map<String, Object>> content = jdbcTemplate.queryForList(
            sql.toString(), 
            studentId, 
            size, 
            page * size
        );
        
        // Count total items for pagination
        String countSql = "SELECT COUNT(*) FROM feedback_responses fr WHERE fr.student_id = ?";
        int totalItems = jdbcTemplate.queryForObject(countSql, Integer.class, studentId);
        
        Map<String, Object> result = new HashMap<>();
        result.put("content", content);
        result.put("totalItems", totalItems);
        result.put("totalPages", (int) Math.ceil((double) totalItems / size));
        result.put("currentPage", page);
        
        return result;
    }

    // Get all faculty members with optional department filter
    public List<Map<String, Object>> getAllFaculty(String department) {
        StringBuilder sql = new StringBuilder();
        List<Object> params = new ArrayList<>();
        
        sql.append("SELECT f.faculty_id as id, CONCAT(f.first_name, ' ', f.last_name) as name, ");
        sql.append("d.department_name as department, f.designation, ");
        sql.append("u.profile_image_url as image, ");
        sql.append("COALESCE(fs.avg_rating, 0) as rating ");
        sql.append("FROM faculty f ");
        sql.append("JOIN departments d ON f.department_id = d.department_id ");
        sql.append("JOIN users u ON f.user_id = u.user_id ");
        sql.append("LEFT JOIN faculty_statistics fs ON f.faculty_id = fs.faculty_id ");
        
        if (department != null && !department.isEmpty()) {
            sql.append("WHERE d.department_name LIKE ? ");
            params.add("%" + department + "%");
        }
        
        sql.append("ORDER BY name");
        
        return jdbcTemplate.queryForList(sql.toString(), params.toArray());
    }
    
    // Get faculty statistics
    public Map<String, Object> getFacultyStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Get total faculty count
        String facultyCountSql = "SELECT COUNT(*) FROM faculty";
        int totalFaculty = jdbcTemplate.queryForObject(facultyCountSql, Integer.class);
        stats.put("totalFaculty", totalFaculty);
        
        // Get departments count
        String departmentCountSql = "SELECT COUNT(*) FROM departments";
        int departments = jdbcTemplate.queryForObject(departmentCountSql, Integer.class);
        stats.put("departments", departments);
        
        return stats;
    }
    
    // Search faculty by name or department
    public List<Map<String, Object>> searchFaculty(String query) {
        StringBuilder sql = new StringBuilder();
        
        sql.append("SELECT f.faculty_id as id, CONCAT(f.first_name, ' ', f.last_name) as name, ");
        sql.append("d.department_name as department, f.designation, ");
        sql.append("u.profile_image_url as image, ");
        sql.append("COALESCE(fs.avg_rating, 0) as rating ");
        sql.append("FROM faculty f ");
        sql.append("JOIN departments d ON f.department_id = d.department_id ");
        sql.append("JOIN users u ON f.user_id = u.user_id ");
        sql.append("LEFT JOIN faculty_statistics fs ON f.faculty_id = fs.faculty_id ");
        sql.append("WHERE f.first_name LIKE ? OR f.last_name LIKE ? OR d.department_name LIKE ? ");
        sql.append("ORDER BY name");
        
        String searchPattern = "%" + query + "%";
        
        return jdbcTemplate.queryForList(
            sql.toString(), 
            searchPattern, searchPattern, searchPattern
        );
    }
    
    // Get specific faculty member details by ID
    public Map<String, Object> getFacultyById(Long facultyId) {
        String sql = "SELECT f.faculty_id, CONCAT(f.first_name, ' ', f.last_name) as name, " +
                    "d.department_name as department, f.designation, " +
                    "u.profile_image_url as image, " +
                    "f.qualifications, f.years_of_experience, f.office_location, " +
                    "COALESCE(fs.avg_rating, 0) as averageRating, " +
                    "COALESCE(fs.total_feedbacks, 0) as feedbackCount " +
                    "FROM faculty f " +
                    "JOIN departments d ON f.department_id = d.department_id " +
                    "JOIN users u ON f.user_id = u.user_id " +
                    "LEFT JOIN faculty_statistics fs ON f.faculty_id = fs.faculty_id " +
                    "WHERE f.faculty_id = ?";
        
        return jdbcTemplate.queryForMap(sql, facultyId);
    }

    public Map<String, Object> getFeedbackFormById(Long userId, Long formId) {
        // First get the student_id from user_id
        String studentIdSql = "SELECT student_id FROM students WHERE user_id = ?";
        Long studentId = jdbcTemplate.queryForObject(studentIdSql, Long.class, userId);
        
        Map<String, Object> formData = new HashMap<>();
        
        // Get form metadata
        String formSql = "SELECT ff.form_id, ff.form_title, c.course_id, c.course_code, c.course_title, " +
                         "CONCAT(f.first_name, ' ', f.last_name) as faculty_name, f.faculty_id, " +
                         "co.offering_id " +
                         "FROM feedback_forms ff " +
                         "JOIN courses c ON ff.course_id = c.course_id " +
                         "JOIN class_offerings co ON (c.course_id = co.course_id AND ff.term_id = co.term_id) " +
                         "JOIN faculty f ON co.faculty_id = f.faculty_id " +
                         "JOIN student_enrollments se ON co.offering_id = se.offering_id " +
                         "WHERE ff.form_id = ? AND se.student_id = ? " +
                         "AND ff.status = 'open' AND CURRENT_TIMESTAMP BETWEEN ff.start_date AND ff.end_date " +
                         "LIMIT 1";
        
        try {
            Map<String, Object> formInfo = jdbcTemplate.queryForMap(formSql, formId, studentId);
            formData.putAll(formInfo);
            
            // Get form questions
            String questionsSql = "SELECT q.question_id, q.question_text, q.question_type, q.is_required " +
                                 "FROM feedback_questions q " +
                                 "WHERE q.form_id = ? " +
                                 "ORDER BY q.question_id";
            
            List<Map<String, Object>> questions = jdbcTemplate.queryForList(questionsSql, formId);
            formData.put("questions", questions);
            
            return formData;
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Form not found or not available");
            errorResponse.put("message", "The requested feedback form is not found or you don't have permission to access it");
            return errorResponse;
        }
    }


    public Map<String, Object> getStudentProfileByUserId(Long userId) {
        System.out.println("Loading profile for userId: " + userId);

        String sql = """
                SELECT 
                    u.username,
                    u.email,
                    u.profile_image_url,
                    s.first_name,
                    s.last_name,
                    s.gender,
                    s.date_of_birth,
                    s.registration_number,
                    s.contact_number,
                    s.semester,
                    s.batch_year,
                    d.department_name
                FROM students s
                INNER JOIN users u ON s.user_id = u.user_id
                LEFT JOIN departments d ON s.department_id = d.department_id
                WHERE s.user_id = ?
                """;

        try {
            Map<String, Object> result = jdbcTemplate.queryForMap(sql, userId);

            Map<String, Object> profile = new HashMap<>();
            profile.put("username", result.get("username"));
            profile.put("email", result.get("email"));
            profile.put("profileImageUrl", result.get("profile_image_url"));
            profile.put("firstName", result.get("first_name"));
            profile.put("lastName", result.get("last_name"));
            profile.put("gender", result.get("gender"));
            profile.put("dob", result.get("date_of_birth"));
            profile.put("registrationNumber", result.get("registration_number"));
            profile.put("contactNumber", result.get("contact_number"));
            profile.put("currentSemester", result.get("semester"));
            profile.put("batchYear", result.get("batch_year"));
            profile.put("department", result.get("department_name"));
            profile.put("fullName", result.get("first_name") + " " + result.get("last_name"));

            // Placeholder values for courses, feedback, CGPA
            profile.put("completedCourses", 0);
            profile.put("feedbackGiven", 0);
            profile.put("cgpa", 0);

            return profile;
        } catch (Exception e) {
            System.out.println("Profile not found for userId: " + userId);
            return new HashMap<>();
        }
    }

    // Update student's personal info
    public Map<String, Object> updateStudentProfile(Long userId, Map<String, Object> updatedProfile) {
        System.out.println("Updating profile for userId: " + userId);

        String firstName = (String) updatedProfile.get("firstName");
        String lastName = (String) updatedProfile.get("lastName");
        String gender = (String) updatedProfile.get("gender");
        String dob = (String) updatedProfile.get("dob"); // expected format yyyy-MM-dd
        String contactNumber = (String) updatedProfile.get("contactNumber");

        String updateSql = """
                UPDATE students 
                SET first_name = ?, 
                    last_name = ?, 
                    gender = ?, 
                    date_of_birth = ?, 
                    contact_number = ?
                WHERE user_id = ?
                """;

        jdbcTemplate.update(updateSql, firstName, lastName, gender, dob, contactNumber, userId);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Profile updated successfully");
        response.put("firstName", firstName);
        response.put("lastName", lastName);
        response.put("gender", gender);
        response.put("dob", dob);
        response.put("contactNumber", contactNumber);

        return response;
    }
}
