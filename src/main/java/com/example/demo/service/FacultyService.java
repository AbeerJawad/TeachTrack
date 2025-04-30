package com.example.demo.service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class FacultyService {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    //Get courses taught by a faculty member based on user ID
    public List<Map<String, Object>> getCoursesByFacultyUserId(Long userId) {
        String sql = "SELECT DISTINCT c.course_id, c.course_code, c.course_title " +
                    "FROM courses c " +
                    "JOIN class_offerings co ON c.course_id = co.course_id " +
                    "JOIN faculty f ON co.faculty_id = f.faculty_id " +
                    "WHERE f.user_id = ? " +
                    "ORDER BY c.course_title";
        
        return jdbcTemplate.queryForList(sql, userId);
    }

    //Get feedback data for a faculty member with optional filtering
    public Map<String, Object> getFeedbackByFacultyUserId(Long userId, Long courseId, int page, int size) {
        String facultyIdSql = "SELECT faculty_id FROM faculty WHERE user_id = ?";
        Long facultyId = jdbcTemplate.queryForObject(facultyIdSql, Long.class, userId);
        
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT fr.response_id, c.course_code, c.course_title, ");
        sql.append("(SELECT AVG(fa.rating_value) FROM feedback_answers fa ");
        sql.append("  JOIN feedback_questions fq ON fa.question_id = fq.question_id ");
        sql.append("  WHERE fa.response_id = fr.response_id AND fq.question_type LIKE '%scale%') AS avg_rating, ");
        sql.append("(SELECT fa.answer_text FROM feedback_answers fa ");
        sql.append("  JOIN feedback_questions fq ON fa.question_id = fq.question_id ");
        sql.append("  WHERE fa.response_id = fr.response_id AND fq.question_type = 'text' LIMIT 1) AS comments, ");
        sql.append("fr.submitted_at, co.section, at.term_name, fr.is_anonymous, ");
        sql.append("CASE ");
        sql.append("  WHEN (SELECT AVG(fa.rating_value) FROM feedback_answers fa ");
        sql.append("        JOIN feedback_questions fq ON fa.question_id = fq.question_id ");
        sql.append("        WHERE fa.response_id = fr.response_id AND fq.question_type LIKE '%scale%') >= 4 THEN 'POSITIVE' ");
        sql.append("  WHEN (SELECT AVG(fa.rating_value) FROM feedback_answers fa ");
        sql.append("        JOIN feedback_questions fq ON fa.question_id = fq.question_id ");
        sql.append("        WHERE fa.response_id = fr.response_id AND fq.question_type LIKE '%scale%') < 3 THEN 'NEGATIVE' ");
        sql.append("  ELSE 'NEUTRAL' ");
        sql.append("END AS sentiment, ");
        sql.append("(SELECT COUNT(*) > 0 FROM faculty_feedback_replies ffr WHERE ffr.response_id = fr.response_id) AS has_reply ");
        sql.append("FROM feedback_responses fr ");
        sql.append("JOIN class_offerings co ON fr.offering_id = co.offering_id ");
        sql.append("JOIN courses c ON co.course_id = c.course_id ");
        sql.append("JOIN academic_terms at ON co.term_id = at.term_id ");
        sql.append("WHERE fr.faculty_id = ? ");
        
        List<Object> params = new ArrayList<>();
        params.add(facultyId);
        
        if (courseId != null) {
            sql.append("AND c.course_id = ? ");
            params.add(courseId);
        }
        
        sql.append("ORDER BY fr.submitted_at DESC ");
        
        sql.append("LIMIT ? OFFSET ?");
        params.add(size);
        params.add(page * size);
        
        // Execute query
        List<Map<String, Object>> feedbackList = jdbcTemplate.queryForList(
            sql.toString(), 
            params.toArray()
        );
        
        // Count total results for pagination
        StringBuilder countSql = new StringBuilder();
        countSql.append("SELECT COUNT(*) FROM feedback_responses fr ");
        countSql.append("JOIN class_offerings co ON fr.offering_id = co.offering_id ");
        countSql.append("JOIN courses c ON co.course_id = c.course_id ");
        countSql.append("WHERE fr.faculty_id = ? ");
        
        List<Object> countParams = new ArrayList<>();
        countParams.add(facultyId);
        
        if (courseId != null) {
            countSql.append("AND c.course_id = ? ");
            countParams.add(courseId);
        }
        
        int totalItems = jdbcTemplate.queryForObject(
            countSql.toString(), 
            Integer.class, 
            countParams.toArray()
        );
        
        // Prepare result with pagination info
        Map<String, Object> result = new HashMap<>();
        result.put("content", feedbackList);
        result.put("totalItems", totalItems);
        result.put("totalPages", (int) Math.ceil((double) totalItems / size));
        result.put("currentPage", page);
        
        return result;
    }

    //Get feedback statistics for a faculty member
    public Map<String, Object> getFeedbackStatsByFacultyUserId(Long userId, Long courseId) {
        // Get faculty ID from user ID
        String facultyIdSql = "SELECT faculty_id FROM faculty WHERE user_id = ?";
        Long facultyId = jdbcTemplate.queryForObject(facultyIdSql, Long.class, userId);
        
        Map<String, Object> stats = new HashMap<>();
        
        // Get total feedback count
        StringBuilder totalSql = new StringBuilder();
        totalSql.append("SELECT COUNT(*) FROM feedback_responses fr ");
        totalSql.append("JOIN class_offerings co ON fr.offering_id = co.offering_id ");
        totalSql.append("WHERE fr.faculty_id = ? ");
        
        List<Object> params = new ArrayList<>();
        params.add(facultyId);
        
        if (courseId != null) {
            totalSql.append("AND co.course_id = ? ");
            params.add(courseId);
        }
        
        int totalFeedback = jdbcTemplate.queryForObject(
            totalSql.toString(),
            Integer.class,
            params.toArray()
        );
        
        stats.put("totalFeedback", totalFeedback);
        
        // Get positive feedback count (rating >= 4)
        StringBuilder positiveSql = new StringBuilder();
        positiveSql.append("SELECT COUNT(DISTINCT fr.response_id) FROM feedback_responses fr ");
        positiveSql.append("JOIN feedback_answers fa ON fr.response_id = fa.response_id ");
        positiveSql.append("JOIN feedback_questions fq ON fa.question_id = fq.question_id ");
        positiveSql.append("JOIN class_offerings co ON fr.offering_id = co.offering_id ");
        positiveSql.append("WHERE fr.faculty_id = ? AND fq.question_type LIKE '%scale%' ");
        positiveSql.append("AND fa.rating_value >= 4 ");
        
        params = new ArrayList<>();
        params.add(facultyId);
        
        if (courseId != null) {
            positiveSql.append("AND co.course_id = ? ");
            params.add(courseId);
        }
        
        int positiveFeedback = jdbcTemplate.queryForObject(
            positiveSql.toString(),
            Integer.class,
            params.toArray()
        );
        
        stats.put("positiveFeedback", positiveFeedback);
        
        // Get negative feedback count (rating < 3)
        StringBuilder negativeSql = new StringBuilder();
        negativeSql.append("SELECT COUNT(DISTINCT fr.response_id) FROM feedback_responses fr ");
        negativeSql.append("JOIN feedback_answers fa ON fr.response_id = fa.response_id ");
        negativeSql.append("JOIN feedback_questions fq ON fa.question_id = fq.question_id ");
        negativeSql.append("JOIN class_offerings co ON fr.offering_id = co.offering_id ");
        negativeSql.append("WHERE fr.faculty_id = ? AND fq.question_type LIKE '%scale%' ");
        negativeSql.append("AND fa.rating_value < 3 ");
        
        params = new ArrayList<>();
        params.add(facultyId);
        
        if (courseId != null) {
            negativeSql.append("AND co.course_id = ? ");
            params.add(courseId);
        }
        
        int negativeFeedback = jdbcTemplate.queryForObject(
            negativeSql.toString(),
            Integer.class,
            params.toArray()
        );
        
        stats.put("negativeFeedback", negativeFeedback);
        
        // Get average rating
        StringBuilder avgRatingSql = new StringBuilder();
        avgRatingSql.append("SELECT AVG(fa.rating_value) FROM feedback_answers fa ");
        avgRatingSql.append("JOIN feedback_questions fq ON fa.question_id = fq.question_id ");
        avgRatingSql.append("JOIN feedback_responses fr ON fa.response_id = fr.response_id ");
        avgRatingSql.append("JOIN class_offerings co ON fr.offering_id = co.offering_id ");
        avgRatingSql.append("WHERE fr.faculty_id = ? AND fq.question_type LIKE '%scale%' ");
        
        params = new ArrayList<>();
        params.add(facultyId);
        
        if (courseId != null) {
            avgRatingSql.append("AND co.course_id = ? ");
            params.add(courseId);
        }
        
        Double averageRating = jdbcTemplate.queryForObject(
            avgRatingSql.toString(),
            Double.class,
            params.toArray()
        );
        
        stats.put("averageRating", averageRating != null ? averageRating : 0);
        
        // Get last feedback date
        StringBuilder lastFeedbackSql = new StringBuilder();
        lastFeedbackSql.append("SELECT MAX(fr.submitted_at) FROM feedback_responses fr ");
        lastFeedbackSql.append("JOIN class_offerings co ON fr.offering_id = co.offering_id ");
        lastFeedbackSql.append("WHERE fr.faculty_id = ? ");
        
        params = new ArrayList<>();
        params.add(facultyId);
        
        if (courseId != null) {
            lastFeedbackSql.append("AND co.course_id = ? ");
            params.add(courseId);
        }
        
        Timestamp lastFeedbackDate = jdbcTemplate.queryForObject(
            lastFeedbackSql.toString(),
            Timestamp.class,
            params.toArray()
        );
        
        stats.put("lastFeedbackDate", lastFeedbackDate);
        stats.put("totalResponses", totalFeedback);
        
        return stats;
    }
    
    //Get detailed feedback by ID
    public Map<String, Object> getFeedbackDetailById(Long responseId) {
        // Get basic feedback details
        String feedbackSql = "SELECT fr.response_id, fr.faculty_id, fr.student_id, fr.is_anonymous, " +
                             "fr.submitted_at, c.course_id, c.course_code, c.course_title, " +
                             "co.section, at.term_id, at.term_name, " +
                             "(SELECT AVG(fa.rating_value) FROM feedback_answers fa " +
                             "JOIN feedback_questions fq ON fa.question_id = fq.question_id " +
                             "WHERE fa.response_id = fr.response_id AND fq.question_type LIKE '%scale%') AS average_rating " +
                             "FROM feedback_responses fr " +
                             "JOIN class_offerings co ON fr.offering_id = co.offering_id " +
                             "JOIN courses c ON co.course_id = c.course_id " +
                             "JOIN academic_terms at ON co.term_id = at.term_id " +
                             "WHERE fr.response_id = ?";
        
        Map<String, Object> feedback = jdbcTemplate.queryForMap(feedbackSql, responseId);
        
        // Get feedback answers
        String answersSql = "SELECT fa.answer_id, fa.question_id, fq.question_text, " +
                            "fq.question_type, fa.answer_text, fa.rating_value " +
                            "FROM feedback_answers fa " +
                            "JOIN feedback_questions fq ON fa.question_id = fq.question_id " +
                            "WHERE fa.response_id = ?";
        
        List<Map<String, Object>> answers = jdbcTemplate.queryForList(answersSql, responseId);
        feedback.put("answers", answers);
        
        // Get faculty replies
        String replySql = "SELECT ffr.reply_id, ffr.faculty_id, ffr.reply_text, ffr.replied_at " +
                          "FROM faculty_feedback_replies ffr " +
                          "WHERE ffr.response_id = ? " +
                          "ORDER BY ffr.replied_at DESC LIMIT 1";
        
        List<Map<String, Object>> replies = jdbcTemplate.queryForList(replySql, responseId);
        if (!replies.isEmpty()) {
            feedback.put("facultyReply", replies.get(0));
        }
        
        // Determine sentiment based on average rating
        Double avgRating = (Double) feedback.get("average_rating");
        String sentiment = "NEUTRAL";
        if (avgRating != null) {
            if (avgRating >= 4.0) {
                sentiment = "POSITIVE";
            } else if (avgRating < 3.0) {
                sentiment = "NEGATIVE";
            }
        }
        feedback.put("sentiment", sentiment);
        
        // Get comment preview from text answers
        String commentPreview = "";
        for (Map<String, Object> answer : answers) {
            if ("text".equals(answer.get("question_type")) && answer.get("answer_text") != null) {
                commentPreview = (String) answer.get("answer_text");
                break;
            }
        }
        feedback.put("commentPreview", commentPreview);
        
        // Add analysis data (in a real system, this might be done by an AI service)
        feedback.put("keyPoints", generateKeyPoints(answers, avgRating));
        feedback.put("actionItems", generateActionItems(answers, avgRating));
        
        return feedback;
    }
    
    //Save faculty reply to feedback
    public Map<String, Object> saveFacultyReply(Map<String, Object> replyData) {
        Long responseId = ((Integer) replyData.get("responseId")).longValue();
        Long facultyId = ((Integer) replyData.get("facultyId")).longValue();
        String replyText = (String) replyData.get("replyText");
        
        // Check if a reply already exists
        String checkReplySql = "SELECT COUNT(*) FROM faculty_feedback_replies WHERE response_id = ? AND faculty_id = ?";
        int replyCount = jdbcTemplate.queryForObject(checkReplySql, Integer.class, responseId, facultyId);
        
        if (replyCount > 0) {
            // Update existing reply
            String updateSql = "UPDATE faculty_feedback_replies SET reply_text = ?, replied_at = NOW() " +
                              "WHERE response_id = ? AND faculty_id = ?";
            jdbcTemplate.update(updateSql, replyText, responseId, facultyId);
        } else {
            // Insert new reply
            String insertSql = "INSERT INTO faculty_feedback_replies (response_id, faculty_id, reply_text) " +
                              "VALUES (?, ?, ?)";
            jdbcTemplate.update(insertSql, responseId, facultyId, replyText);
        }
        
        // Get the updated reply
        String replySql = "SELECT reply_id, faculty_id, reply_text, replied_at " +
                          "FROM faculty_feedback_replies " +
                          "WHERE response_id = ? AND faculty_id = ?";
        
        Map<String, Object> reply = jdbcTemplate.queryForMap(replySql, responseId, facultyId);
        
        return reply;
    }
    
    //Get faculty feedback replies
    public List<Map<String, Object>> getFeedbackReplies(Long responseId) {
        String sql = "SELECT ffr.reply_id, ffr.faculty_id, ffr.reply_text, ffr.replied_at, " +
                     "CONCAT(f.first_name, ' ', f.last_name) AS faculty_name " +
                     "FROM faculty_feedback_replies ffr " +
                     "JOIN faculty f ON ffr.faculty_id = f.faculty_id " +
                     "WHERE ffr.response_id = ? " +
                     "ORDER BY ffr.replied_at DESC";
        
        return jdbcTemplate.queryForList(sql, responseId);
    }
    
    //Get faculty rating
    public Map<String, Object> getFacultyRating(Long userId, Long courseId, Long termId) {
        // Get faculty ID from user ID
        String facultyIdSql = "SELECT faculty_id FROM faculty WHERE user_id = ?";
        Long facultyId = jdbcTemplate.queryForObject(facultyIdSql, Long.class, userId);
        
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT AVG(fa.rating_value) AS average_rating, ");
        sql.append("COUNT(DISTINCT fr.response_id) AS total_responses, ");
        sql.append("MAX(fr.submitted_at) AS last_feedback_date ");
        sql.append("FROM feedback_answers fa ");
        sql.append("JOIN feedback_questions fq ON fa.question_id = fq.question_id ");
        sql.append("JOIN feedback_responses fr ON fa.response_id = fr.response_id ");
        sql.append("JOIN class_offerings co ON fr.offering_id = co.offering_id ");
        sql.append("WHERE fr.faculty_id = ? AND fq.question_type LIKE '%scale%' ");
        
        List<Object> params = new ArrayList<>();
        params.add(facultyId);
        
        if (courseId != null) {
            sql.append("AND co.course_id = ? ");
            params.add(courseId);
        }
        
        if (termId != null) {
            sql.append("AND co.term_id = ? ");
            params.add(termId);
        }
        
        Map<String, Object> rating = jdbcTemplate.queryForMap(
            sql.toString(),
            params.toArray()
        );
        
        // Get rating distribution
        if (rating.get("total_responses") != null && ((Long) rating.get("total_responses")) > 0) {
            String distributionSql = "SELECT " +
                                     "SUM(CASE WHEN fa.rating_value = 1 THEN 1 ELSE 0 END) AS rating_1, " +
                                     "SUM(CASE WHEN fa.rating_value = 2 THEN 1 ELSE 0 END) AS rating_2, " +
                                     "SUM(CASE WHEN fa.rating_value = 3 THEN 1 ELSE 0 END) AS rating_3, " +
                                     "SUM(CASE WHEN fa.rating_value = 4 THEN 1 ELSE 0 END) AS rating_4, " +
                                     "SUM(CASE WHEN fa.rating_value = 5 THEN 1 ELSE 0 END) AS rating_5 " +
                                     "FROM feedback_answers fa " +
                                     "JOIN feedback_questions fq ON fa.question_id = fq.question_id " +
                                     "JOIN feedback_responses fr ON fa.response_id = fr.response_id " +
                                     "JOIN class_offerings co ON fr.offering_id = co.offering_id " +
                                     "WHERE fr.faculty_id = ? AND fq.question_type LIKE '%scale%' ";
            
            List<Object> distParams = new ArrayList<>();
            distParams.add(facultyId);
            
            if (courseId != null) {
                distributionSql += "AND co.course_id = ? ";
                distParams.add(courseId);
            }
            
            if (termId != null) {
                distributionSql += "AND co.term_id = ? ";
                distParams.add(termId);
            }
            
            Map<String, Object> distribution = jdbcTemplate.queryForMap(
                distributionSql,
                distParams.toArray()
            );
            
            rating.put("distribution", distribution);
        }
        
        return rating;
    }
    
    // Helper method to generate key points from feedback answers
    private List<Map<String, Object>> generateKeyPoints(List<Map<String, Object>> answers, Double avgRating) {
        List<Map<String, Object>> keyPoints = new ArrayList<>();
        
        // Create key points based on text answers
        for (Map<String, Object> answer : answers) {
            if ("text".equals(answer.get("question_type")) && answer.get("answer_text") != null) {
                String answerText = (String) answer.get("answer_text");
                if (!answerText.trim().isEmpty()) {
                    Map<String, Object> keyPoint = new HashMap<>();
                    keyPoint.put("text", answerText);
                    keyPoint.put("isPositive", avgRating != null && avgRating >= 3.5);
                    keyPoints.add(keyPoint);
                    
                    // In a real system, you might analyze the text to generate more specific key points
                    // This is just a basic implementation
                }
            }
        }
        
        // Create key points based on rating answers
        for (Map<String, Object> answer : answers) {
            if (answer.get("question_type").toString().contains("scale") && answer.get("rating_value") != null) {
                Integer rating = (Integer) answer.get("rating_value");
                if (rating != null) {
                    // Only create key points for notably high or low ratings
                    if (rating >= 4 || rating <= 2) {
                        Map<String, Object> keyPoint = new HashMap<>();
                        String questionText = (String) answer.get("question_text");
                        boolean isPositive = rating >= 4;
                        
                        keyPoint.put("text", (isPositive ? "Strength" : "Improvement needed") + 
                                    " in: " + questionText + " (Rating: " + rating + ")");
                        keyPoint.put("isPositive", isPositive);
                        keyPoints.add(keyPoint);
                    }
                }
            }
        }
        
        return keyPoints;
    }
    
    // Helper method to generate action items from feedback
    private List<Map<String, Object>> generateActionItems(List<Map<String, Object>> answers, Double avgRating) {
        List<Map<String, Object>> actionItems = new ArrayList<>();
        
        // In a real system, this would use more advanced analysis
        // For now, we'll create generic action items based on ratings
        
        // Find low-rated areas and suggest improvements
        for (Map<String, Object> answer : answers) {
            if (answer.get("question_type").toString().contains("scale") && answer.get("rating_value") != null) {
                Integer rating = (Integer) answer.get("rating_value");
                if (rating != null && rating <= 3) {
                    Map<String, Object> actionItem = new HashMap<>();
                    String questionText = (String) answer.get("question_text");
                    
                    actionItem.put("text", "Consider improving: " + questionText);
                    actionItems.add(actionItem);
                }
            }
        }
        
        // Add a general action item based on overall rating
        if (avgRating != null) {
            Map<String, Object> actionItem = new HashMap<>();
            if (avgRating < 3.0) {
                actionItem.put("text", "Review teaching methods and materials to address student concerns");
                actionItems.add(actionItem);
            } else if (avgRating < 4.0) {
                actionItem.put("text", "Identify specific areas for improvement to boost overall satisfaction");
                actionItems.add(actionItem);
            } else {
                actionItem.put("text", "Continue current approach while looking for ways to maintain high standards");
                actionItems.add(actionItem);
            }
        }
        
        return actionItems;
    }
}