package com.example.demo.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.service.NotificationService;

@RestController
@RequestMapping("/api/students")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;
    
    // Get notifications for a student with pagination and filtering
    @GetMapping("/{userId}/notifications")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getStudentNotifications(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "all") String type,
            @RequestParam(defaultValue = "newest") String sort) {

        System.out.println("Fetching notifications for student with userId: " + userId);
        System.out.println("Page: " + page + ", Size: " + size);
        System.out.println("Search: " + search + ", Type: " + type + ", Sort: " + sort);

        Map<String, Object> notifications = notificationService.getNotificationsByStudentUserId(
            userId, page, size, search, type, sort);

        System.out.println("Notifications retrieved: " + notifications.get("totalItems"));
        return ResponseEntity.ok(notifications);
    }
    
    // Get notification detail
    @GetMapping("/{userId}/notifications/{notificationId}")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getNotificationDetail(
            @PathVariable Long userId,
            @PathVariable Long notificationId) {
        
        System.out.println("Fetching notification detail for notificationId: " + notificationId);
        
        Map<String, Object> notification = notificationService.getNotificationById(userId, notificationId);
        
        System.out.println("Notification detail retrieved");
        return ResponseEntity.ok(notification);
    }
    
    // Mark notification as read
    @PostMapping("/{userId}/notifications/{notificationId}/read")
    public ResponseEntity<Map<String, Object>> markNotificationAsRead(
            @PathVariable Long userId,
            @PathVariable Long notificationId) {
        
        System.out.println("Marking notification as read: " + notificationId);
        
        Map<String, Object> result = notificationService.markNotificationAsRead(userId, notificationId);
        
        System.out.println("Notification marked as read: " + result);
        return ResponseEntity.ok(result);
    }
    
    // Mark all notifications as read
    @PostMapping("/{userId}/notifications/read-all")
    public ResponseEntity<Map<String, Object>> markAllNotificationsAsRead(
            @PathVariable Long userId) {
        
        System.out.println("Marking all notifications as read for userId: " + userId);
        
        Map<String, Object> result = notificationService.markAllNotificationsAsRead(userId);
        
        System.out.println("All notifications marked as read: " + result);
        return ResponseEntity.ok(result);
    }
}