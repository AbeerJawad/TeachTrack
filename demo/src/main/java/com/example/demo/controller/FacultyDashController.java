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
    
    @GetMapping("/feedback/{facultyId}")
    public ResponseEntity<?> getFacultyFeedback(@PathVariable String facultyId) {
        // Enhanced debug logging
        System.out.println("\n=== Faculty Feedback Request ===");
        System.out.println("Incoming facultyId: '" + facultyId + "'");
        System.out.println("Trimmed facultyId: '" + facultyId.trim() + "'");

        // Validation
        if (facultyId == null || facultyId.trim().isEmpty()) {
            System.out.println("Validation failed: Faculty ID is null or empty");
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Faculty ID is required",
                "receivedId", facultyId
            ));
        }

        // Query the database
        System.out.println("Querying database for facultyId: " + facultyId);
        Optional<User> userOptional = userRepository.findByFacultyId(facultyId.trim());

        if (userOptional.isEmpty()) {
            System.out.println("Database query: No user found with facultyId: " + facultyId);
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Invalid faculty ID",
                "details", "No user found with this ID",
                "receivedId", facultyId
            ));
        }

        User user = userOptional.get();
        if (!(user instanceof Faculty)) {
            System.out.println("Type mismatch: User with ID " + facultyId + " is not a Faculty");
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Invalid faculty ID",
                "details", "User exists but is not a Faculty member",
                "userType", user.getDtype()
            ));
        }

        // Success case
        Faculty faculty = (Faculty) user;
        System.out.println("Successfully retrieved faculty member: " + faculty.getFullName());

        // Prepare response with actual data
        Map<String, Object> response = new HashMap<>();
        response.put("facultyId", faculty.getFacultyId());
        response.put("fullName", faculty.getFullName());
        response.put("email", faculty.getEmail());
        
        // Include feedback data 
        List<Feedback> feedbackList = evaluationService.getEvaluationsByFaculty(facultyId);
        response.put("feedbackCount", feedbackList.size());
        response.put("averageRating", evaluationService.getAverageRating(facultyId));
        response.put("positiveFeedback", evaluationService.getPositiveFeedbackCount(facultyId));
        response.put("negativeFeedback", evaluationService.getNegativeFeedbackCount(facultyId));

        List<Feedback> feedbackList1 = evaluationService.getFacultyFeedbackWithCourses(facultyId); // new method
        response.put("feedbackCount", feedbackList1.size());
        response.put("feedbackList", feedbackList1);

        System.out.println("Returning response for facultyId: " + facultyId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/courses/{facultyId}")
    public ResponseEntity<?> getFacultyCourses(@PathVariable String facultyId) {
        System.out.println("Retrieving courses for faculty ID: " + facultyId);
        
        if (facultyId == null || facultyId.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Faculty ID is required"
            ));
        }
        
        List<Course> courses = evaluationService.getCoursesByFaculty(facultyId);
        System.out.println("Found " + courses.size() + " courses for faculty ID: " + facultyId);
        
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/feedback/{facultyId}/filter")
    public List<Feedback> getFilteredFeedback(@PathVariable String facultyId, @RequestParam String courseCode) {
        
        System.out.println("Received request to filter feedback for faculty: " + facultyId + " with course: " + courseCode);
        

        return new ArrayList<>();
    }
}