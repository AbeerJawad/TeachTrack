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
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.service.FeedbackService;

@RestController
@RequestMapping("/api/students")
public class FeedbackController {
    @Autowired
    private FeedbackService feedbackService;
    
    @PostMapping("/{userId}/submit-feedback")
    public ResponseEntity<Map<String, Object>> submitFeedback(
            @PathVariable Long userId,
            @RequestBody Map<String, Object> feedbackData) {
        
        System.out.println("Submitting feedback for userId: " + userId);
        System.out.println("Form data: " + feedbackData);
        
        // Process and save feedback
        Map<String, Object> result = feedbackService.submitFeedback(userId, feedbackData);
        
        System.out.println("Feedback submission result: " + result);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{userId}/feedback-detail/{feedbackId}")
    public ResponseEntity<Map<String, Object>> getSubmittedFeedback(
            @PathVariable Long userId,
            @PathVariable Long feedbackId) {
        
        System.out.println("Fetching submitted feedback with ID: " + feedbackId + " for student with userId: " + userId);
        
        Map<String, Object> submittedFeedback = feedbackService.getSubmittedFeedbackById(userId, feedbackId);
        
        System.out.println("Submitted feedback retrieved: " + submittedFeedback);
        return ResponseEntity.ok(submittedFeedback);
    }

    @GetMapping("/{userId}/feedback-by-course")
    public ResponseEntity<Map<String, Object>> getSubmittedFeedbackByCourse(
            @PathVariable Long userId,
            @RequestParam Long courseId) {
        
        System.out.println("Fetching submitted feedback for course: " + courseId + " by student with userId: " + userId);
        
        Map<String, Object> submittedFeedback = feedbackService.getSubmittedFeedbackByCourseId(userId, courseId);
        
        System.out.println("Submitted feedback for course retrieved: " + submittedFeedback);
        return ResponseEntity.ok(submittedFeedback);
    }
}