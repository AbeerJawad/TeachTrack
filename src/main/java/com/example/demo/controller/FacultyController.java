package com.example.demo.controller;

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

import com.example.demo.service.FacultyService;

@RestController
@RequestMapping("api/faculty")
public class FacultyController {
    
    @Autowired
    private FacultyService facultyService;
    
    //Get courses taught by a faculty member
    @GetMapping("/{userId}/courses")
    public ResponseEntity<List<Map<String, Object>>> getFacultyCourses(@PathVariable Long userId) {
        List<Map<String, Object>> courses = facultyService.getCoursesByFacultyUserId(userId);
        return ResponseEntity.ok(courses);
    }
    
    //Get feedback for a faculty member with optional filtering
    @GetMapping("/{userId}/feedback")
    public ResponseEntity<Map<String, Object>> getFacultyFeedback(
            @PathVariable Long userId,
            @RequestParam(required = false) Long courseId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Map<String, Object> feedbackData = facultyService.getFeedbackByFacultyUserId(userId, courseId, page, size);
        return ResponseEntity.ok(feedbackData);
    }
    
    //Get feedback statistics for a faculty member
    @GetMapping("/{userId}/feedback/stats")
    public ResponseEntity<Map<String, Object>> getFeedbackStats(
            @PathVariable Long userId,
            @RequestParam(required = false) Long courseId) {
        
        Map<String, Object> stats = facultyService.getFeedbackStatsByFacultyUserId(userId, courseId);
        return ResponseEntity.ok(stats);
    }
    
    //Get detailed feedback by ID
    @GetMapping("/feedback/{responseId}")
    public ResponseEntity<Map<String, Object>> getFeedbackDetail(@PathVariable Long responseId) {
        Map<String, Object> feedbackDetail = facultyService.getFeedbackDetailById(responseId);
        return ResponseEntity.ok(feedbackDetail);
    }
    
    //Submit a reply to feedback
    @PostMapping("/feedback/reply")
    public ResponseEntity<Map<String, Object>> replyToFeedback(@RequestBody Map<String, Object> replyData) {
        Map<String, Object> response = facultyService.saveFacultyReply(replyData);
        return ResponseEntity.ok(response);
    }
    
    //Get faculty feedback replies
    @GetMapping("/feedback/{responseId}/replies")
    public ResponseEntity<List<Map<String, Object>>> getFeedbackReplies(@PathVariable Long responseId) {
        List<Map<String, Object>> replies = facultyService.getFeedbackReplies(responseId);
        return ResponseEntity.ok(replies);
    }
    
    //Get average rating for a faculty member
    @GetMapping("/{userId}/rating")
    public ResponseEntity<Map<String, Object>> getFacultyRating(
            @PathVariable Long userId,
            @RequestParam(required = false) Long courseId,
            @RequestParam(required = false) Long termId) {
        
        Map<String, Object> ratingData = facultyService.getFacultyRating(userId, courseId, termId);
        return ResponseEntity.ok(ratingData);
    }
}