package com.example.demo.controller;

import com.example.demo.model.Feedback;
import com.example.demo.model.Student;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
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
    /* 
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
            //<String, Object> stats = evaluationService.getEvaluationStats(student);
            //dashboardData.put("stats", stats);
            
            return ResponseEntity.ok(dashboardData);
        }
        
        return ResponseEntity.status(403).body(Map.of("error", "Unauthorized access or student not found"));
    }
    */

}