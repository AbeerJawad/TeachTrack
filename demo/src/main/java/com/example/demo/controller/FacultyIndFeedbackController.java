package com.example.demo.controller;

import com.example.demo.model.Course;
import com.example.demo.model.Feedback;
import com.example.demo.model.User;
import com.example.demo.service.CourseService;
import com.example.demo.service.EvaluationService;
import com.example.demo.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Controller
@RequestMapping("/feedback")
public class FacultyIndFeedbackController {
    private final EvaluationService evaluationService;
    private final CourseService courseService;
    private final UserService userService;

    @Autowired
    public FacultyIndFeedbackController(EvaluationService evaluationService, CourseService courseService, UserService userService) {
        this.evaluationService = evaluationService;
        this.courseService = courseService;
        this.userService = userService;
    }

    @GetMapping("/view/{id}")
    public String viewIndividualFeedback(@PathVariable("id") Long feedbackId, Model model) {
        // This is for the server-side rendered version if needed
        return "FacultyViewIndFeedback";
    }

    @GetMapping("/api/individual/{id}")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getFeedbackDetails(@PathVariable("id") Long feedbackId) {
        Optional<Feedback> feedbackOpt = evaluationService.getFeedbackById(feedbackId);
        
        if (!feedbackOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        Feedback feedback = feedbackOpt.get();
        Course course = courseService.getCourseById(feedback.getCourseId());
        
        Map<String, Object> response = new HashMap<>();
        response.put("feedback", feedback);
        response.put("course", course);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/faculty/{facultyId}")
    @ResponseBody
    public ResponseEntity<List<Feedback>> getFacultyFeedback(@PathVariable("facultyId") String facultyId) {
        List<Feedback> feedbacks = evaluationService.getFacultyFeedbackWithCourses(facultyId);
        return ResponseEntity.ok(feedbacks);
    }
    
    @GetMapping("/api/faculty/{facultyId}/courses")
    @ResponseBody
    public ResponseEntity<List<Course>> getFacultyCourses(@PathVariable("facultyId") String facultyId) {
        List<Course> courses = evaluationService.getCoursesByFaculty(facultyId);
        return ResponseEntity.ok(courses);
    }
    
    @GetMapping("/api/faculty/{facultyId}/stats")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getFacultyStats(@PathVariable("facultyId") String facultyId) {
        Map<String, Object> stats = new HashMap<>();
        
        // Get feedback counts
        Long totalFeedback = evaluationService.getTotalFeedbackCount(facultyId);
        Object positiveFeedback = evaluationService.getPositiveFeedbackCount(facultyId);
        Object negativeFeedback = evaluationService.getNegativeFeedbackCount(facultyId);
        
        // Calculate average rating
        double averageRating = evaluationService.getAverageRating(facultyId);
        
        stats.put("totalFeedback", totalFeedback);
        stats.put("positiveFeedback", positiveFeedback);
        stats.put("negativeFeedback", negativeFeedback);
        stats.put("averageRating", averageRating);
        
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/api/course/{courseId}/stats")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getCourseStats(@PathVariable("courseId") Long courseId) {
        Map<String, Object> stats = new HashMap<>();
        
        Course course = courseService.getCourseById(courseId);
        if (course == null) {
            return ResponseEntity.notFound().build();
        }
        
        List<Feedback> feedbacks = evaluationService.getFeedbackByCourseId(courseId);
        
        long positiveCount = feedbacks.stream().filter(f -> f.getRating() > 3).count();
        long negativeCount = feedbacks.stream().filter(f -> f.getRating() <= 3).count();
        double avgRating = feedbacks.stream().mapToInt(Feedback::getRating).average().orElse(0.0);
        
        stats.put("courseName", course.getCourseName());
        stats.put("courseCode", course.getCourseCode());
        stats.put("totalFeedback", feedbacks.size());
        stats.put("positiveFeedback", positiveCount);
        stats.put("negativeFeedback", negativeCount);
        stats.put("averageRating", avgRating);
        
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/api/similar")
    @ResponseBody
    public ResponseEntity<List<Feedback>> getSimilarFeedback(
            @RequestParam("feedbackId") Long feedbackId, 
            @RequestParam("courseId") Long courseId) {
        
        // Get similar feedback based on same course or similar ratings
        List<Feedback> similarFeedback = evaluationService.getSimilarFeedback(feedbackId, courseId);
        return ResponseEntity.ok(similarFeedback);
    }
}
