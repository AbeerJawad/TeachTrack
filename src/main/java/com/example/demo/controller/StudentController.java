package com.example.demo.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.ui.Model;

import com.example.demo.model.Course;
import com.example.demo.model.Student;
import com.example.demo.service.StudentService;
import com.example.demo.service.UserService;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentService studentService;
    
    // Get enrolled courses for a student
    @GetMapping("/{userId}/courses")
    @ResponseBody
    public ResponseEntity<List<Map<String, Object>>> getStudentCourses(
            @PathVariable Long userId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String courseCode) {

        System.out.println("Fetching courses for student with userId: " + userId);
        System.out.println("Search param: " + search);
        System.out.println("Course code param: " + courseCode);

        List<Map<String, Object>> courses = studentService.getCoursesByStudentUserId(userId, search, courseCode);

        System.out.println("Courses retrieved: " + courses.size());
        return ResponseEntity.ok(courses);
    }
    
    // Get student dashboard statistics
    @GetMapping("/{userId}/stats")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getStudentStats(@PathVariable Long userId) {
        System.out.println("Fetching dashboard stats for student with userId: " + userId);

        Map<String, Object> stats = studentService.getStudentStatsByUserId(userId);

        System.out.println("Stats retrieved: " + stats);
        return ResponseEntity.ok(stats);
    }
    
    // Get feedback forms available for the student
    @GetMapping("/{userId}/feedback-forms")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getStudentFeedbackForms(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        System.out.println("Fetching feedback forms for student with userId: " + userId);
        System.out.println("Page: " + page + ", Size: " + size);

        Map<String, Object> feedbackForms = studentService.getFeedbackFormsByStudentUserId(userId, page, size);

        System.out.println("Feedback forms retrieved: " + feedbackForms);
        return ResponseEntity.ok(feedbackForms);
    }
    
    // Get student's submitted feedback
    @GetMapping("/{userId}/submitted-feedback")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getSubmittedFeedback(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        System.out.println("Fetching submitted feedback for student with userId: " + userId);
        System.out.println("Page: " + page + ", Size: " + size);

        Map<String, Object> submittedFeedback = studentService.getSubmittedFeedbackByStudentUserId(userId, page, size);

        System.out.println("Submitted feedback retrieved: " + submittedFeedback);
        return ResponseEntity.ok(submittedFeedback);
    }
    
    // Get all faculty members
    @GetMapping("/faculty")
    @ResponseBody
    public ResponseEntity<List<Map<String, Object>>> getAllFaculty(
            @RequestParam(required = false) String department) {
        
        System.out.println("Fetching all faculty members");
        System.out.println("Department filter: " + department);
        
        List<Map<String, Object>> faculty = studentService.getAllFaculty(department);
        
        System.out.println("Faculty members retrieved: " + faculty.size());
        return ResponseEntity.ok(faculty);
    }
    
    // Get faculty statistics
    @GetMapping("/faculty/stats")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getFacultyStats() {
        System.out.println("Fetching faculty statistics");
        
        Map<String, Object> stats = studentService.getFacultyStats();
        
        System.out.println("Faculty stats retrieved: " + stats);
        return ResponseEntity.ok(stats);
    }
    
    // Search for faculty
    @GetMapping("/faculty/search")
    @ResponseBody
    public ResponseEntity<List<Map<String, Object>>> searchFaculty(
            @RequestParam String query) {
        
        System.out.println("Searching faculty with query: " + query);
        
        List<Map<String, Object>> faculty = studentService.searchFaculty(query);
        
        System.out.println("Faculty search results: " + faculty.size());
        return ResponseEntity.ok(faculty);
    }
    
    // Get specific faculty member details
    @GetMapping("/faculty/{facultyId}")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getFacultyById(
            @PathVariable Long facultyId) {
        
        System.out.println("Fetching faculty details for facultyId: " + facultyId);
        
        Map<String, Object> facultyDetails = studentService.getFacultyById(facultyId);
        
        System.out.println("Faculty details retrieved");
        return ResponseEntity.ok(facultyDetails);
    }

    @GetMapping("/{userId}/feedback-form/{formId}")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getFeedbackForm(
            @PathVariable Long userId,
            @PathVariable Long formId) {
        
        System.out.println("Fetching feedback form with ID: " + formId + " for student with userId: " + userId);
        
        Map<String, Object> feedbackForm = studentService.getFeedbackFormById(userId, formId);
        
        System.out.println("Feedback form retrieved: " + feedbackForm);
        return ResponseEntity.ok(feedbackForm);
    }

    // Get student's profile data
    @GetMapping("/{userId}/profile")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getStudentProfile(@PathVariable Long userId) {
        System.out.println("Fetching profile data for student with userId: " + userId);
        Map<String, Object> profileData = studentService.getStudentProfileByUserId(userId);
        System.out.println("Profile data retrieved: " + profileData);
        return ResponseEntity.ok(profileData);
    }

    // Update student's personal information
    @PutMapping("/{userId}/profile")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> updateStudentProfile(
            @PathVariable Long userId,
            @RequestBody Map<String, Object> updatedProfile) {

        System.out.println("Updating profile for student with userId: " + userId);
        System.out.println("Received update data: " + updatedProfile);

        Map<String, Object> updatedData = studentService.updateStudentProfile(userId, updatedProfile);

        System.out.println("Profile updated successfully: " + updatedData);
        return ResponseEntity.ok(updatedData);
    }
}