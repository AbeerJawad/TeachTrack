package com.example.demo.service;

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
public class NotificationService {
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    // Add student_notifications table if not exists
    public void createNotificationsTableIfNotExists() {
        String createTableSql = "CREATE TABLE IF NOT EXISTS student_notifications (" +
                "notification_id INT PRIMARY KEY AUTO_INCREMENT, " +
                "student_id INT NOT NULL, " +
                "title VARCHAR(255) NOT NULL, " +
                "message TEXT NOT NULL, " +
                "notification_type ENUM('feedback', 'deadline', 'announcement') NOT NULL, " +
                "is_read BOOLEAN DEFAULT FALSE, " +
                "related_id INT, " + 
                "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
                "FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE" +
                ")";
        
        jdbcTemplate.execute(createTableSql);
    }
    
    // Get notifications for a student with pagination and filtering
    public Map<String, Object> getNotificationsByStudentUserId(
            Long userId, int page, int size, String search, String type, String sort) {
        
        Map<String, Object> result = new HashMap<>();
        
        try {
            // First get the student_id from user_id
            String studentIdSql = "SELECT student_id FROM students WHERE user_id = ?";
            Long studentId = jdbcTemplate.queryForObject(studentIdSql, Long.class, userId);
            
            // Ensure the notifications table exists
            createNotificationsTableIfNotExists();
            
            // Build query
            StringBuilder sql = new StringBuilder();
            List<Object> params = new ArrayList<>();
            
            sql.append("SELECT notification_id, title, message, notification_type, is_read, related_id, created_at ");
            sql.append("FROM student_notifications ");
            sql.append("WHERE student_id = ? ");
            params.add(studentId);
            
            // Add search filter if provided
            if (search != null && !search.trim().isEmpty()) {
                sql.append("AND (title LIKE ? OR message LIKE ?) ");
                params.add("%" + search + "%");
                params.add("%" + search + "%");
            }
            
            // Add type filter if not 'all'
            if (type != null && !type.equals("all")) {
                sql.append("AND notification_type = ? ");
                params.add(type);
            }
            
            // Add sorting
            if (sort.equals("oldest")) {
                sql.append("ORDER BY created_at ASC ");
            } else if (sort.equals("unread")) {
                sql.append("ORDER BY is_read ASC, created_at DESC ");
            } else {
                // Default to newest first
                sql.append("ORDER BY created_at DESC ");
            }
            
            // Add pagination
            sql.append("LIMIT ? OFFSET ?");
            params.add(size);
            params.add(page * size);
            
            // Execute query
            List<Map<String, Object>> content = jdbcTemplate.queryForList(sql.toString(), params.toArray());
            
            // Count total items for pagination
            StringBuilder countSql = new StringBuilder();
            List<Object> countParams = new ArrayList<>();
            
            countSql.append("SELECT COUNT(*) FROM student_notifications ");
            countSql.append("WHERE student_id = ? ");
            countParams.add(studentId);
            
            // Add search filter if provided
            if (search != null && !search.trim().isEmpty()) {
                countSql.append("AND (title LIKE ? OR message LIKE ?) ");
                countParams.add("%" + search + "%");
                countParams.add("%" + search + "%");
            }
            
            // Add type filter if not 'all'
            if (type != null && !type.equals("all")) {
                countSql.append("AND notification_type = ? ");
                countParams.add(type);
            }
            
            int totalItems = jdbcTemplate.queryForObject(countSql.toString(), Integer.class, countParams.toArray());
            
            // Count unread notifications
            String unreadCountSql = "SELECT COUNT(*) FROM student_notifications WHERE student_id = ? AND is_read = FALSE";
            int unreadCount = jdbcTemplate.queryForObject(unreadCountSql, Integer.class, studentId);
            
            result.put("content", content);
            result.put("totalItems", totalItems);
            result.put("totalPages", (int) Math.ceil((double) totalItems / size));
            result.put("currentPage", page);
            result.put("unreadCount", unreadCount);
            
        } catch (EmptyResultDataAccessException e) {
            // Handle case where student ID is not found - return empty result set
            result.put("content", new ArrayList<>());
            result.put("totalItems", 0);
            result.put("totalPages", 0);
            result.put("currentPage", page);
            result.put("unreadCount", 0);
            result.put("error", "Student not found");
        } catch (Exception e) {
            // Handle any other exceptions
            result.put("content", new ArrayList<>());
            result.put("totalItems", 0);
            result.put("totalPages", 0);
            result.put("currentPage", page);
            result.put("unreadCount", 0);
            result.put("error", "Error retrieving notifications: " + e.getMessage());
        }
        
        return result;
    }
    
    // Get notification detail
    public Map<String, Object> getNotificationById(Long userId, Long notificationId) {
        try {
            // First get the student_id from user_id
            String studentIdSql = "SELECT student_id FROM students WHERE user_id = ?";
            Long studentId = jdbcTemplate.queryForObject(studentIdSql, Long.class, userId);
            
            String sql = "SELECT notification_id, title, message, notification_type, is_read, related_id, created_at " +
                         "FROM student_notifications " +
                         "WHERE notification_id = ? AND student_id = ?";
            
            try {
                Map<String, Object> notification = jdbcTemplate.queryForMap(sql, notificationId, studentId);
                
                // Get related content based on notification type
                if (notification.get("notification_type").equals("feedback") && notification.get("related_id") != null) {
                    Long formId = Long.parseLong(notification.get("related_id").toString());
                    String formSql = "SELECT ff.form_id, ff.form_title, c.course_code, c.course_title, ff.end_date " +
                                    "FROM feedback_forms ff " +
                                    "JOIN courses c ON ff.course_id = c.course_id " +
                                    "WHERE ff.form_id = ?";
                    
                    try {
                        Map<String, Object> formInfo = jdbcTemplate.queryForMap(formSql, formId);
                        notification.put("relatedContent", formInfo);
                    } catch (EmptyResultDataAccessException e) {
                        // Form might have been deleted
                        notification.put("relatedContent", null);
                    }
                }
                
                // Mark as read if not already
                if (!(Boolean) notification.get("is_read")) {
                    markNotificationAsRead(userId, notificationId);
                    notification.put("is_read", true);
                }
                
                return notification;
                
            } catch (EmptyResultDataAccessException e) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Notification not found");
                error.put("message", "The requested notification does not exist or you don't have permission to view it");
                return error;
            }
        } catch (EmptyResultDataAccessException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Student not found");
            error.put("message", "No student found with this user ID");
            return error;
        }
    }
    
    // Mark notification as read
    @Transactional
    public Map<String, Object> markNotificationAsRead(Long userId, Long notificationId) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // First get the student_id from user_id
            String studentIdSql = "SELECT student_id FROM students WHERE user_id = ?";
            Long studentId = jdbcTemplate.queryForObject(studentIdSql, Long.class, userId);
            
            String updateSql = "UPDATE student_notifications SET is_read = TRUE " +
                              "WHERE notification_id = ? AND student_id = ?";
            
            int updated = jdbcTemplate.update(updateSql, notificationId, studentId);
            
            if (updated > 0) {
                result.put("success", true);
                result.put("message", "Notification marked as read");
            } else {
                result.put("success", false);
                result.put("message", "Notification not found or already read");
            }
            
        } catch (EmptyResultDataAccessException e) {
            result.put("success", false);
            result.put("message", "Student not found with this user ID");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "Error marking notification as read: " + e.getMessage());
        }
        
        return result;
    }
    
    // Mark all notifications as read
    @Transactional
    public Map<String, Object> markAllNotificationsAsRead(Long userId) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // First get the student_id from user_id
            String studentIdSql = "SELECT student_id FROM students WHERE user_id = ?";
            Long studentId = jdbcTemplate.queryForObject(studentIdSql, Long.class, userId);
            
            String updateSql = "UPDATE student_notifications SET is_read = TRUE " +
                              "WHERE student_id = ? AND is_read = FALSE";
            
            int updated = jdbcTemplate.update(updateSql, studentId);
            
            result.put("success", true);
            result.put("message", updated + " notifications marked as read");
            
        } catch (EmptyResultDataAccessException e) {
            result.put("success", false);
            result.put("message", "Student not found with this user ID");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "Error marking notifications as read: " + e.getMessage());
        }
        
        return result;
    }
    
    // Helper method to create a notification (can be called from other services)
    @Transactional
    public void createNotification(Long studentId, String title, String message, 
                                  String notificationType, Long relatedId) {
        // Ensure the notifications table exists
        createNotificationsTableIfNotExists();
        
        String sql = "INSERT INTO student_notifications " +
                    "(student_id, title, message, notification_type, related_id) " +
                    "VALUES (?, ?, ?, ?, ?)";
        
        jdbcTemplate.update(sql, studentId, title, message, notificationType, relatedId);
    }
    
    // Method to trigger notifications creation for feedback forms (called by scheduler or during form creation)
    @Transactional
    public void createFeedbackNotifications() {
        String sql = "INSERT INTO student_notifications (student_id, title, message, notification_type, related_id) " +
                    "SELECT se.student_id, " +
                    "CONCAT('New Feedback Form: ', c.course_code), " +
                    "CONCAT('Please provide feedback for ', c.course_code, ' - ', c.course_title, ' by ', ff.end_date), " +
                    "'feedback', ff.form_id " +
                    "FROM feedback_forms ff " +
                    "JOIN courses c ON ff.course_id = c.course_id " +
                    "JOIN class_offerings co ON (ff.course_id = co.course_id AND ff.term_id = co.term_id) " +
                    "JOIN student_enrollments se ON co.offering_id = se.offering_id " +
                    "LEFT JOIN feedback_responses fr ON (ff.form_id = fr.form_id AND fr.student_id = se.student_id) " +
                    "LEFT JOIN student_notifications sn ON (sn.student_id = se.student_id AND sn.related_id = ff.form_id) " +
                    "WHERE ff.status = 'open' " +
                    "AND CURRENT_TIMESTAMP BETWEEN ff.start_date AND ff.end_date " +
                    "AND fr.response_id IS NULL " +
                    "AND sn.notification_id IS NULL";
        
        jdbcTemplate.update(sql);
    }
    
    // Method to create deadline notifications (e.g., feedback forms closing soon)
    @Transactional
    public void createDeadlineNotifications() {
        String sql = "INSERT INTO student_notifications (student_id, title, message, notification_type, related_id) " +
                    "SELECT se.student_id, " +
                    "CONCAT('Deadline Reminder: ', c.course_code), " +
                    "CONCAT('The feedback form for ', c.course_code, ' - ', c.course_title, ' closes in 24 hours.'), " +
                    "'deadline', ff.form_id " +
                    "FROM feedback_forms ff " +
                    "JOIN courses c ON ff.course_id = c.course_id " +
                    "JOIN class_offerings co ON (ff.course_id = co.course_id AND ff.term_id = co.term_id) " +
                    "JOIN student_enrollments se ON co.offering_id = se.offering_id " +
                    "LEFT JOIN feedback_responses fr ON (ff.form_id = fr.form_id AND fr.student_id = se.student_id) " +
                    "WHERE ff.status = 'open' " +
                    "AND TIMESTAMPDIFF(HOUR, CURRENT_TIMESTAMP, ff.end_date) <= 24 " +
                    "AND TIMESTAMPDIFF(HOUR, CURRENT_TIMESTAMP, ff.end_date) > 0 " +
                    "AND fr.response_id IS NULL " +
                    "AND NOT EXISTS (SELECT 1 FROM student_notifications sn " +
                    "    WHERE sn.student_id = se.student_id " +
                    "    AND sn.related_id = ff.form_id " +
                    "    AND sn.notification_type = 'deadline')";
        
        jdbcTemplate.update(sql);
    }
}