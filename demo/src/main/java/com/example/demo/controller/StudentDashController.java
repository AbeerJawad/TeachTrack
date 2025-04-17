package com.example.demo.controller;

import com.example.demo.model.Student;
import com.example.demo.model.Course;
import com.example.demo.model.Feedback;
import com.example.demo.repository.StudentRepository;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.FeedbackRepository;
import com.example.demo.repository.StudentCourseRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin(origins = "*") // For development; restrict in production
public class StudentDashController {

    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private FeedbackRepository feedbackRepository;
    
    @Autowired
    private StudentCourseRepository studentCourseRepository;

    /**
     * Get student dashboard information
     */
    @GetMapping("/student/{email}")
    public ResponseEntity<?> getStudentDashboard(@PathVariable String email) {
        try {
            // Find student by email
            Student student = studentRepository.findById(email);
            
            if (student == null) {
                return ResponseEntity.notFound().build();
            }
            
            // Create response map
            Map<String, Object> response = new HashMap<>();
            response.put("fullName", student.getFullName());
            response.put("studentId", student.getStudentId());
            response.put("email", student.getEmail());
            
            // Get statistics for the dashboard
            Map<String, Object> stats = getStudentStats(student.getStudentId());
            response.put("stats", stats);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error fetching student dashboard: " + e.getMessage());
        }
    }
    
    @GetMapping("/student/{email}/evaluations")
    public ResponseEntity<?> getStudentEvaluations(@PathVariable String email) {
        try {
            // Find student by email
            Student student = studentRepository.findById(email);
            
            if (student == null) {
                return ResponseEntity.notFound().build();
            }
            
            String studentId = student.getStudentId();
            
            // Get all courses this student is enrolled in
            List<Course> enrolledCourses = studentCourseRepository.findCoursesByStudentId(studentId);
            
            // Get all feedbacks submitted by this student
            List<Feedback> completedFeedbacks = feedbackRepository.findByStudentId(studentId);
            
            // Create lists for pending and completed evaluations
            List<Map<String, Object>> pendingEvals = new ArrayList<>();
            List<Map<String, Object>> completedEvals = new ArrayList<>();
            
            // Process all enrolled courses
            for (Course course : enrolledCourses) {
                // Check if feedback is already given for this course
                boolean isCompleted = completedFeedbacks.stream()
                    .anyMatch(feedback -> feedback.getCourseId().equals(course.getId()));
                
                Map<String, Object> evalData = new HashMap<>();
                evalData.put("id", course.getId());
                evalData.put("courseName", course.getCourseName());
                evalData.put("courseCode", course.getCourseCode());
                evalData.put("facultyName", courseRepository.findFacultyNameByCourseId(course.getId()));
                evalData.put("facultyId", course.getFaculty());
                evalData.put("department", course.getDepartment());
                
                if (isCompleted) {
                    // This course has been evaluated
                    Feedback feedback = completedFeedbacks.stream()
                        .filter(f -> f.getCourseId().equals(course.getId()))
                        .findFirst().orElse(null);
                    
                    if (feedback != null) {
                        evalData.put("submissionDate", feedback.getCreatedAt());
                        evalData.put("rating", feedback.getRating());
                        completedEvals.add(evalData);
                    }
                } else {
                    // This course needs evaluation
                    // Set deadline to one month from now (just as an example)
                    evalData.put("dueDate", LocalDate.now().plusMonths(1));
                    pendingEvals.add(evalData);
                }
            }
            
            // Create response with both pending and completed evaluations
            Map<String, Object> response = new HashMap<>();
            response.put("pending", pendingEvals);
            response.put("completed", completedEvals);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error fetching evaluations: " + e.getMessage());
        }
    }
    
    /**
     * Submit feedback for a course
     */
    @PostMapping("/student/feedback")
    public ResponseEntity<?> submitFeedback(@RequestBody Feedback feedback) {
        try {
            // Validate the feedback
            if (feedback.getStudentId() == null || feedback.getFacultyId() == null || 
                feedback.getCourseId() == null || feedback.getRating() == null) {
                return ResponseEntity.badRequest().body("Missing required fields");
            }
            
            // Save the feedback
            feedbackRepository.save(feedback);
            
            return ResponseEntity.ok().body("Feedback submitted successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error submitting feedback: " + e.getMessage());
        }
    }
    
    /**
     * Get student statistics (completed evaluations, pending evaluations, next due date)
     */
    private Map<String, Object> getStudentStats(String studentId) {
        Map<String, Object> stats = new HashMap<>();
        
        // Get enrolled courses
        List<Course> enrolledCourses = studentCourseRepository.findCoursesByStudentId(studentId);
        
        // Get completed feedbacks
        List<Feedback> completedFeedbacks = feedbackRepository.findByStudentId(studentId);
        
        // Count completed evaluations
        int completedEvals = completedFeedbacks.size();
        
        // Count pending evaluations
        int pendingEvals = enrolledCourses.size() - completedEvals;
        
        // Set next due date (example: setting to one month from now)
        String nextDueDate = pendingEvals > 0 ? LocalDate.now().plusMonths(1).toString() : "No upcoming deadlines";
        
        stats.put("pendingEvaluations", pendingEvals);
        stats.put("completedEvaluations", completedEvals);
        stats.put("nextDueDate", nextDueDate);
        
        return stats;
    }
}