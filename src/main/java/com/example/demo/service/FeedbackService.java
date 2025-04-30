package com.example.demo.service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FeedbackService {
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Transactional
    public Map<String, Object> submitFeedback(Long userId, Map<String, Object> feedbackData) {
        // Existing implementation - unchanged
        Map<String, Object> result = new HashMap<>();
        
        try {
            // First get the student_id from user_id
            String studentIdSql = "SELECT student_id FROM students WHERE user_id = ?";
            Long studentId = jdbcTemplate.queryForObject(studentIdSql, Long.class, userId);
            
            // Extract data from request
            Long formId = Long.parseLong(feedbackData.get("form_id").toString());
            Long facultyId = Long.parseLong(feedbackData.get("faculty_id").toString());
            Long offeringId = Long.parseLong(feedbackData.get("offering_id").toString());
            Boolean isAnonymous = (Boolean) feedbackData.get("is_anonymous");
            
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> answers = (List<Map<String, Object>>) feedbackData.get("answers");
            
            // Insert feedback response
            String insertResponseSql = "INSERT INTO feedback_responses " +
                "(form_id, student_id, faculty_id, offering_id, is_anonymous) " +
                "VALUES (?, ?, ?, ?, ?)";
            
            jdbcTemplate.update(
                insertResponseSql, 
                formId, 
                studentId, 
                facultyId, 
                offeringId, 
                isAnonymous
            );
            
            // Get the generated response ID
            String getResponseIdSql = "SELECT LAST_INSERT_ID()";
            Long responseId = jdbcTemplate.queryForObject(getResponseIdSql, Long.class);
            
            // Insert each answer
            for (Map<String, Object> answer : answers) {
                Long questionId = Long.parseLong(answer.get("question_id").toString());
                String answerText = (String) answer.get("answer_text");
                
                Integer ratingValue = null;
                if (answer.get("rating_value") != null) {
                    ratingValue = Integer.parseInt(answer.get("rating_value").toString());
                }
                
                String insertAnswerSql = "INSERT INTO feedback_answers " +
                    "(response_id, question_id, answer_text, rating_value) " +
                    "VALUES (?, ?, ?, ?)";
                
                jdbcTemplate.update(
                    insertAnswerSql, 
                    responseId, 
                    questionId, 
                    answerText, 
                    ratingValue
                );
            }
            
            // Update faculty statistics
            updateFacultyStatistics(facultyId);
            
            // Update faculty ratings summary
            updateFacultyRatingsSummary(facultyId, formId, offeringId);
            
            result.put("success", true);
            result.put("message", "Feedback submitted successfully");
            result.put("responseId", responseId);
            
        } catch (Exception e) {
            e.printStackTrace();
            result.put("success", false);
            result.put("message", "Error submitting feedback: " + e.getMessage());
        }
        
        return result;
    }
    
    @Transactional(readOnly = true)
    public Map<String, Object> getSubmittedFeedbackById(Long userId, Long feedbackId) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // First get the student_id from user_id
            String studentIdSql = "SELECT student_id FROM students WHERE user_id = ?";
            Long studentId;
            
            try {
                studentId = jdbcTemplate.queryForObject(studentIdSql, Long.class, userId);
            } catch (EmptyResultDataAccessException e) {
                // Handle case where student doesn't exist for this user ID
                result.put("success", false);
                result.put("error", "Student not found for user ID: " + userId);
                return result;
            }
            
            // Get response details
            String responseSql = "SELECT fr.response_id, fr.form_id, fr.submitted_at, fr.is_anonymous, " +
                             "ff.form_title, c.course_code, c.course_title as course_name, " +
                             "CONCAT(f.first_name, ' ', f.last_name) as instructor_name " +
                             "FROM feedback_responses fr " +
                             "JOIN feedback_forms ff ON fr.form_id = ff.form_id " +
                             "JOIN class_offerings co ON fr.offering_id = co.offering_id " +
                             "JOIN courses c ON co.course_id = c.course_id " +
                             "JOIN faculty f ON fr.faculty_id = f.faculty_id " +
                             "WHERE fr.response_id = ? AND fr.student_id = ?";
            
            Map<String, Object> responseData;
            try {
                responseData = jdbcTemplate.queryForMap(responseSql, feedbackId, studentId);
            } catch (EmptyResultDataAccessException e) {
                // Handle case where feedback doesn't exist or doesn't belong to this student
                result.put("success", false);
                result.put("error", "Feedback not found or you don't have permission to view it");
                return result;
            }
            
            result.putAll(responseData);
            
            // Get questions and answers
            String questionsSql = "SELECT fq.question_id, fq.question_text, fq.question_type, " +
                               "fa.answer_text, fa.rating_value " +
                               "FROM feedback_questions fq " +
                               "JOIN feedback_answers fa ON fq.question_id = fa.question_id " +
                               "WHERE fa.response_id = ?";
            
            List<Map<String, Object>> questions = jdbcTemplate.queryForList(questionsSql, feedbackId);
            result.put("questions", questions);
            
            // Get faculty replies if any
            String repliesSql = "SELECT ffr.reply_id, ffr.reply_text, ffr.replied_at, " +
                             "CONCAT(f.first_name, ' ', f.last_name) as faculty_name " +
                             "FROM faculty_feedback_replies ffr " +
                             "JOIN faculty f ON ffr.faculty_id = f.faculty_id " +
                             "WHERE ffr.response_id = ?";
            
            List<Map<String, Object>> facultyReplies = jdbcTemplate.queryForList(repliesSql, feedbackId);
            result.put("facultyReplies", facultyReplies);
            
            result.put("success", true);
            
        } catch (Exception e) {
            e.printStackTrace();
            result.put("success", false);
            result.put("error", "Error retrieving feedback: " + e.getMessage());
        }
        
        return result;
    }
    
    @Transactional(readOnly = true)
    public Map<String, Object> getSubmittedFeedbackByCourseId(Long userId, Long courseId) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // First get the student_id from user_id
            String studentIdSql = "SELECT student_id FROM students WHERE user_id = ?";
            Long studentId;
            
            try {
                studentId = jdbcTemplate.queryForObject(studentIdSql, Long.class, userId);
            } catch (EmptyResultDataAccessException e) {
                // Handle case where student doesn't exist for this user ID
                result.put("success", false);
                result.put("error", "Student not found for user ID: " + userId);
                return result;
            }
            
            // Get latest response for this course
            String responseIdSql = "SELECT MAX(fr.response_id) " +
                                "FROM feedback_responses fr " +
                                "JOIN class_offerings co ON fr.offering_id = co.offering_id " +
                                "WHERE fr.student_id = ? AND co.course_id = ?";
            
            Long latestResponseId;
            try {
                latestResponseId = jdbcTemplate.queryForObject(responseIdSql, Long.class, studentId, courseId);
            } catch (EmptyResultDataAccessException e) {
                result.put("success", false);
                result.put("error", "No feedback found for this course");
                return result;
            }
            
            if (latestResponseId == null) {
                result.put("success", false);
                result.put("error", "No feedback found for this course");
                return result;
            }
            
            // Use the existing method to get the details
            return getSubmittedFeedbackById(userId, latestResponseId);
            
        } catch (Exception e) {
            e.printStackTrace();
            result.put("success", false);
            result.put("error", "Error retrieving feedback: " + e.getMessage());
        }
        
        return result;
    }
    
    // Existing methods - unchanged
    private void updateFacultyStatistics(Long facultyId) {
        // Check if faculty statistics record exists
        String checkSql = "SELECT COUNT(*) FROM faculty_statistics WHERE faculty_id = ?";
        int count = jdbcTemplate.queryForObject(checkSql, Integer.class, facultyId);
        
        if (count == 0) {
            // Insert new record
            String insertSql = "INSERT INTO faculty_statistics (faculty_id, avg_rating, total_feedbacks, last_feedback_date) " +
                              "VALUES (?, " +
                              "(SELECT AVG(rating_value) FROM feedback_answers fa " +
                              "JOIN feedback_responses fr ON fa.response_id = fr.response_id " +
                              "WHERE fr.faculty_id = ? AND fa.rating_value IS NOT NULL), " +
                              "(SELECT COUNT(DISTINCT fr.response_id) FROM feedback_responses fr WHERE fr.faculty_id = ?), " +
                              "CURRENT_TIMESTAMP)";
            
            jdbcTemplate.update(insertSql, facultyId, facultyId, facultyId);
        } else {
            // Update existing record
            String updateSql = "UPDATE faculty_statistics SET " +
                              "avg_rating = (SELECT AVG(rating_value) FROM feedback_answers fa " +
                              "JOIN feedback_responses fr ON fa.response_id = fr.response_id " +
                              "WHERE fr.faculty_id = ? AND fa.rating_value IS NOT NULL), " +
                              "total_feedbacks = (SELECT COUNT(DISTINCT fr.response_id) FROM feedback_responses fr WHERE fr.faculty_id = ?), " +
                              "last_feedback_date = CURRENT_TIMESTAMP " +
                              "WHERE faculty_id = ?";
            
            jdbcTemplate.update(updateSql, facultyId, facultyId, facultyId);
        }
    }
    
    private void updateFacultyRatingsSummary(Long facultyId, Long formId, Long offeringId) {
        // Get course and department IDs
        String getIdsSql = "SELECT co.course_id, f.department_id, co.term_id " +
                          "FROM class_offerings co " +
                          "JOIN faculty f ON co.faculty_id = f.faculty_id " +
                          "WHERE co.offering_id = ?";
        
        Map<String, Object> ids = jdbcTemplate.queryForMap(getIdsSql, offeringId);
        
        Long courseId = Long.parseLong(ids.get("course_id").toString());
        Long departmentId = Long.parseLong(ids.get("department_id").toString());
        Long termId = Long.parseLong(ids.get("term_id").toString());
        
        // Get feedback questions from the form
        String getQuestionsSql = "SELECT question_id FROM feedback_questions WHERE form_id = ?";
        List<Long> questionIds = jdbcTemplate.queryForList(getQuestionsSql, Long.class, formId);
        
        // For each question, update or insert summary stats
        for (Long questionId : questionIds) {
            // Check if summary record exists
            String checkSql = "SELECT COUNT(*) FROM faculty_ratings_summary " +
                             "WHERE faculty_id = ? AND course_id = ? AND term_id = ? AND offering_id = ? AND question_id = ?";
            
            int count = jdbcTemplate.queryForObject(checkSql, Integer.class, 
                                                  facultyId, courseId, termId, offeringId, questionId);
            
            if (count == 0) {
                // Insert new summary record
                String insertSql = "INSERT INTO faculty_ratings_summary " +
                                  "(faculty_id, course_id, term_id, department_id, offering_id, question_id, " +
                                  "avg_rating, median_rating, min_rating, max_rating, std_deviation, response_count, anonymous_count) " +
                                  "SELECT ?, ?, ?, ?, ?, ?, " +
                                  "AVG(fa.rating_value), " +
                                  "0, " + // Placeholder for median (would require more complex query)
                                  "MIN(fa.rating_value), " +
                                  "MAX(fa.rating_value), " +
                                  "STDDEV_POP(fa.rating_value), " +
                                  "COUNT(fa.answer_id), " +
                                  "SUM(CASE WHEN fr.is_anonymous THEN 1 ELSE 0 END) " +
                                  "FROM feedback_answers fa " +
                                  "JOIN feedback_responses fr ON fa.response_id = fr.response_id " +
                                  "WHERE fr.faculty_id = ? AND fr.offering_id = ? AND fa.question_id = ? " +
                                  "AND fa.rating_value IS NOT NULL";
                
                jdbcTemplate.update(insertSql, 
                                   facultyId, courseId, termId, departmentId, offeringId, questionId,
                                   facultyId, offeringId, questionId);
            } else {
                // Update existing summary record
                String updateSql = "UPDATE faculty_ratings_summary SET " +
                                  "avg_rating = (SELECT AVG(fa.rating_value) FROM feedback_answers fa " +
                                  "JOIN feedback_responses fr ON fa.response_id = fr.response_id " +
                                  "WHERE fr.faculty_id = ? AND fr.offering_id = ? AND fa.question_id = ? " +
                                  "AND fa.rating_value IS NOT NULL), " +
                                  "min_rating = (SELECT MIN(fa.rating_value) FROM feedback_answers fa " +
                                  "JOIN feedback_responses fr ON fa.response_id = fr.response_id " +
                                  "WHERE fr.faculty_id = ? AND fr.offering_id = ? AND fa.question_id = ? " +
                                  "AND fa.rating_value IS NOT NULL), " +
                                  "max_rating = (SELECT MAX(fa.rating_value) FROM feedback_answers fa " +
                                  "JOIN feedback_responses fr ON fa.response_id = fr.response_id " +
                                  "WHERE fr.faculty_id = ? AND fr.offering_id = ? AND fa.question_id = ? " +
                                  "AND fa.rating_value IS NOT NULL), " +
                                  "std_deviation = (SELECT STDDEV_POP(fa.rating_value) FROM feedback_answers fa " +
                                  "JOIN feedback_responses fr ON fa.response_id = fr.response_id " +
                                  "WHERE fr.faculty_id = ? AND fr.offering_id = ? AND fa.question_id = ? " +
                                  "AND fa.rating_value IS NOT NULL), " +
                                  "response_count = (SELECT COUNT(fa.answer_id) FROM feedback_answers fa " +
                                  "JOIN feedback_responses fr ON fa.response_id = fr.response_id " +
                                  "WHERE fr.faculty_id = ? AND fr.offering_id = ? AND fa.question_id = ? " +
                                  "AND fa.rating_value IS NOT NULL), " +
                                  "anonymous_count = (SELECT SUM(CASE WHEN fr.is_anonymous THEN 1 ELSE 0 END) " +
                                  "FROM feedback_answers fa " +
                                  "JOIN feedback_responses fr ON fa.response_id = fr.response_id " +
                                  "WHERE fr.faculty_id = ? AND fr.offering_id = ? AND fa.question_id = ? " +
                                  "AND fa.rating_value IS NOT NULL) " +
                                  "WHERE faculty_id = ? AND course_id = ? AND term_id = ? AND offering_id = ? AND question_id = ?";
                
                jdbcTemplate.update(updateSql, 
                                  facultyId, offeringId, questionId,
                                  facultyId, offeringId, questionId,
                                  facultyId, offeringId, questionId,
                                  facultyId, offeringId, questionId,
                                  facultyId, offeringId, questionId,
                                  facultyId, offeringId, questionId,
                                  facultyId, courseId, termId, offeringId, questionId);
            }
        }
    }
}