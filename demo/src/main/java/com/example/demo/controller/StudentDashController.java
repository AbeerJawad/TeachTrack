package com.example.demo.controller;

import com.example.demo.model.Evaluation;
import com.example.demo.model.Student;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.EvaluationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/dashboard/student")
public class StudentDashController {
    
    private final UserRepository userRepository;
    private final EvaluationService evaluationService;
    
    public StudentDashController(UserRepository userRepository, EvaluationService evaluationService) {
        this.userRepository = userRepository;
        this.evaluationService = evaluationService;
    }
    
    @GetMapping("/{email}")
    public ResponseEntity<Map<String, Object>> getStudentDashboard(@PathVariable String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        
        if (userOptional.isPresent() && userOptional.get() instanceof Student) {
            Student student = (Student) userOptional.get();
            
            // Create dashboard data
            Map<String, Object> dashboardData = new HashMap<>();
            dashboardData.put("studentId", student.getStudentId());
            dashboardData.put("fullName", student.getFullName());
            dashboardData.put("email", student.getEmail());
            dashboardData.put("username", student.getUsername());
            
            // Get evaluation statistics
            Map<String, Object> stats = evaluationService.getEvaluationStats(student);
            dashboardData.put("stats", stats);
            
            return ResponseEntity.ok(dashboardData);
        }
        
        return ResponseEntity.status(403).body(Map.of("error", "Unauthorized access or student not found"));
    }
    
    @GetMapping("/{email}/evaluations")
    public ResponseEntity<Map<String, Object>> getStudentEvaluations(@PathVariable String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        
        if (userOptional.isPresent() && userOptional.get() instanceof Student) {
            Student student = (Student) userOptional.get();
            
            // Get evaluations
            List<Evaluation> pendingEvaluations = evaluationService.getPendingEvaluations(student);
            List<Evaluation> completedEvaluations = evaluationService.getCompletedEvaluations(student);
            
            // Convert to client-friendly format
            List<Map<String, Object>> pendingList = pendingEvaluations.stream()
                .map(this::convertEvaluationToMap)
                .collect(Collectors.toList());
                
            List<Map<String, Object>> completedList = completedEvaluations.stream()
                .map(this::convertEvaluationToMap)
                .collect(Collectors.toList());
            
            Map<String, Object> result = new HashMap<>();
            result.put("pending", pendingList);
            result.put("completed", completedList);
            
            return ResponseEntity.ok(result);
        }
        
        return ResponseEntity.status(403).body(Map.of("error", "Unauthorized access or student not found"));
    }
    
    @PostMapping("/evaluation/{id}/submit")
    public ResponseEntity<Map<String, Object>> submitFeedback(
            @PathVariable Long id,
            @RequestBody Map<String, String> feedback) {
        
        Evaluation updatedEvaluation = evaluationService.submitFeedback(id, feedback.get("feedback"));
        
        if (updatedEvaluation != null) {
            return ResponseEntity.ok(Map.of(
                "message", "Feedback submitted successfully",
                "evaluationId", updatedEvaluation.getId(),
                "submissionDate", updatedEvaluation.getSubmissionDate().toString()
            ));
        }
        
        return ResponseEntity.status(404).body(Map.of("error", "Evaluation not found"));
    }
    
    private Map<String, Object> convertEvaluationToMap(Evaluation evaluation) {
        Map<String, Object> evalMap = new HashMap<>();
        evalMap.put("id", evaluation.getId());
        evalMap.put("facultyName", evaluation.getFacultyName());
        evalMap.put("courseName", evaluation.getCourseName());
        evalMap.put("department", evaluation.getDepartment());
        evalMap.put("dueDate", evaluation.getDueDate().toString());
        evalMap.put("completed", evaluation.isCompleted());
        
        if (evaluation.isCompleted()) {
            evalMap.put("submissionDate", evaluation.getSubmissionDate().toString());
        }
        
        return evalMap;
    }
}