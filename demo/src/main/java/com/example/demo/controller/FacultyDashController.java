package com.example.demo.controller;

import com.example.demo.model.Course;
import com.example.demo.model.Faculty;
import com.example.demo.model.User;
import com.example.demo.model.Feedback;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.EvaluationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/dashboard/faculty")
public class FacultyDashController {

    private final UserRepository userRepository;
    private final EvaluationService evaluationService;

    public FacultyDashController(UserRepository userRepository, EvaluationService evaluationService) {
        this.userRepository = userRepository;
        this.evaluationService = evaluationService;
    }
    
    @GetMapping("/feedback/{userId}")
    public ResponseEntity<?> getFacultyFeedback(@PathVariable Long userId) {
        // Enhanced debug logging
        System.out.println("\n=== Faculty Feedback Request ===");
        System.out.println("Incoming userId: '" + userId + "'");

        // Validation
        if (userId == null) {
            System.out.println("Validation failed: User ID is null");
            return ResponseEntity.badRequest().body(Map.of(
                "error", "User ID is required",
                "receivedId", userId
            ));
        }

        // Query the database
        System.out.println("Querying database for userId: " + userId);
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isEmpty()) {
            System.out.println("Database query: No user found with userId: " + userId);
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Invalid user ID",
                "details", "No user found with this ID",
                "receivedId", userId
            ));
        }

        User user = userOptional.get();
        if (!(user instanceof Faculty)) {
            System.out.println("Type mismatch: User with ID " + userId + " is not a Faculty");
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Invalid user ID",
                "details", "User exists but is not a Faculty member",
                "userType", user.getDtype()
            ));
        }

        // Success case
        Faculty faculty = (Faculty) user;
        System.out.println("Successfully retrieved faculty member: " + faculty.getFullName());

        // Get faculty ID for service calls
        String facultyId = faculty.getFacultyId();

        // Prepare response with actual data
        Map<String, Object> response = new HashMap<>();
        response.put("userId", userId);
        response.put("facultyId", facultyId);
        response.put("fullName", faculty.getFullName());
        response.put("email", faculty.getEmail());
        
        // Include feedback data 
        List<Feedback> feedbackList = evaluationService.getEvaluationsByFaculty(facultyId);
        response.put("feedbackCount", feedbackList.size());
        response.put("averageRating", evaluationService.getAverageRating(facultyId));
        response.put("positiveFeedback", evaluationService.getPositiveFeedbackCount(facultyId));
        response.put("negativeFeedback", evaluationService.getNegativeFeedbackCount(facultyId));

        List<Feedback> feedbackList1 = evaluationService.getFacultyFeedbackWithCourses(facultyId);
        response.put("feedbackCount", feedbackList1.size());
        response.put("feedbackList", feedbackList1);

        System.out.println("Returning response for userId: " + userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/courses/{userId}")
    public ResponseEntity<?> getFacultyCourses(@PathVariable Long userId) {
        System.out.println("Retrieving courses for user ID: " + userId);
        
        if (userId == null) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "User ID is required"
            ));
        }
        
        // First, get the faculty member by user ID
        Optional<User> userOptional = userRepository.findById(userId);
        
        if (userOptional.isEmpty() || !(userOptional.get() instanceof Faculty)) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Invalid user ID or user is not a faculty member"
            ));
        }
        
        Faculty faculty = (Faculty) userOptional.get();
        String facultyId = faculty.getFacultyId();
        
        List<Course> courses = evaluationService.getCoursesByFaculty(facultyId);
        System.out.println("Found " + courses.size() + " courses for faculty ID: " + facultyId);
        
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/feedback/{userId}/filter")
    public ResponseEntity<?> getFilteredFeedback(@PathVariable Long userId, @RequestParam String courseCode) {
        System.out.println("Received request to filter feedback for user: " + userId + " with course: " + courseCode);
        
        // First, get the faculty member by user ID
        Optional<User> userOptional = userRepository.findById(userId);
        
        if (userOptional.isEmpty() || !(userOptional.get() instanceof Faculty)) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Invalid user ID or user is not a faculty member"
            ));
        }
        
        Faculty faculty = (Faculty) userOptional.get();
        String facultyId = faculty.getFacultyId();
        
        // Now get evaluations filtered by course code
        List<Feedback> filteredFeedback = evaluationService.getEvaluationsByFacultyAndCourse(facultyId, courseCode);
        
        return ResponseEntity.ok(filteredFeedback);
    }
}