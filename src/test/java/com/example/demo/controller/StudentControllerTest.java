package com.example.demo.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.example.demo.service.StudentService;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(StudentController.class)
public class StudentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private StudentService studentService;

    @Autowired
    private ObjectMapper objectMapper;

    private Long userId;
    private List<Map<String, Object>> mockCourses;
    private Map<String, Object> mockStats;
    private Map<String, Object> mockFeedbackForms;
    private Map<String, Object> mockSubmittedFeedback;
    private List<Map<String, Object>> mockFaculty;
    private Map<String, Object> mockFacultyDetails;
    private Map<String, Object> mockProfileData;

    @BeforeEach
    void setUp() {
        userId = 1L;
        
        // Setup mock courses
        mockCourses = new ArrayList<>();
        Map<String, Object> course1 = new HashMap<>();
        course1.put("id", 1L);
        course1.put("code", "CS101");
        course1.put("title", "Introduction to Programming");
        course1.put("facultyName", "Dr. Jane Smith");
        mockCourses.add(course1);
        
        Map<String, Object> course2 = new HashMap<>();
        course2.put("id", 2L);
        course2.put("code", "CS201");
        course2.put("title", "Data Structures");
        course2.put("facultyName", "Dr. John Doe");
        mockCourses.add(course2);
        
        // Setup mock stats
        mockStats = new HashMap<>();
        mockStats.put("enrolledCourses", 5);
        mockStats.put("completedFeedbacks", 3);
        mockStats.put("pendingFeedbacks", 2);
        
        // Setup mock feedback forms
        mockFeedbackForms = new HashMap<>();
        List<Map<String, Object>> forms = new ArrayList<>();
        Map<String, Object> form = new HashMap<>();
        form.put("id", 1L);
        form.put("courseCode", "CS101");
        form.put("courseTitle", "Introduction to Programming");
        form.put("facultyName", "Dr. Jane Smith");
        form.put("dueDate", "2025-05-15");
        forms.add(form);
        mockFeedbackForms.put("content", forms);
        mockFeedbackForms.put("totalItems", 1);
        mockFeedbackForms.put("totalPages", 1);
        mockFeedbackForms.put("currentPage", 0);
        
        // Setup mock submitted feedback
        mockSubmittedFeedback = new HashMap<>();
        List<Map<String, Object>> feedback = new ArrayList<>();
        Map<String, Object> feedbackItem = new HashMap<>();
        feedbackItem.put("id", 1L);
        feedbackItem.put("courseCode", "CS101");
        feedbackItem.put("courseTitle", "Introduction to Programming");
        feedbackItem.put("facultyName", "Dr. Jane Smith");
        feedbackItem.put("submittedDate", "2025-04-20");
        feedback.add(feedbackItem);
        mockSubmittedFeedback.put("content", feedback);
        mockSubmittedFeedback.put("totalItems", 1);
        mockSubmittedFeedback.put("totalPages", 1);
        mockSubmittedFeedback.put("currentPage", 0);
        
        // Setup mock faculty
        mockFaculty = new ArrayList<>();
        Map<String, Object> faculty1 = new HashMap<>();
        faculty1.put("id", 1L);
        faculty1.put("name", "Dr. Jane Smith");
        faculty1.put("department", "Computer Science");
        faculty1.put("rating", 4.5);
        mockFaculty.add(faculty1);
        
        // Setup mock faculty details
        mockFacultyDetails = new HashMap<>();
        mockFacultyDetails.put("id", 1L);
        mockFacultyDetails.put("name", "Dr. Jane Smith");
        mockFacultyDetails.put("department", "Computer Science");
        mockFacultyDetails.put("email", "jane.smith@university.edu");
        mockFacultyDetails.put("bio", "Professor of Computer Science specializing in AI");
        mockFacultyDetails.put("rating", 4.5);
        mockFacultyDetails.put("reviewCount", 25);
        
        // Setup mock profile data
        mockProfileData = new HashMap<>();
        mockProfileData.put("id", 1L);
        mockProfileData.put("name", "John Student");
        mockProfileData.put("email", "john.student@university.edu");
        mockProfileData.put("department", "Computer Science");
        mockProfileData.put("year", 3);
        
        // Configure mock service responses
        when(studentService.getCoursesByStudentUserId(anyLong(), anyString(), anyString()))
                .thenReturn(mockCourses);
        
        when(studentService.getStudentStatsByUserId(anyLong()))
                .thenReturn(mockStats);
        
        when(studentService.getFeedbackFormsByStudentUserId(anyLong(), anyInt(), anyInt()))
                .thenReturn(mockFeedbackForms);
        
        when(studentService.getSubmittedFeedbackByStudentUserId(anyLong(), anyInt(), anyInt()))
                .thenReturn(mockSubmittedFeedback);
        
        when(studentService.getAllFaculty(anyString()))
                .thenReturn(mockFaculty);
        
        Map<String, Object> facultyStats = new HashMap<>();
        facultyStats.put("totalFaculty", 25);
        facultyStats.put("departmentCount", 5);
        facultyStats.put("highestRated", "Dr. Jane Smith");
        when(studentService.getFacultyStats())
                .thenReturn(facultyStats);
        
        when(studentService.searchFaculty(anyString()))
                .thenReturn(mockFaculty);
        
        when(studentService.getFacultyById(anyLong()))
                .thenReturn(mockFacultyDetails);
        
        Map<String, Object> feedbackForm = new HashMap<>();
        feedbackForm.put("id", 1L);
        feedbackForm.put("courseId", 1L);
        feedbackForm.put("courseCode", "CS101");
        feedbackForm.put("facultyId", 1L);
        feedbackForm.put("facultyName", "Dr. Jane Smith");
        feedbackForm.put("questions", new ArrayList<>());
        when(studentService.getFeedbackFormById(anyLong(), anyLong()))
                .thenReturn(feedbackForm);
        
        when(studentService.getStudentProfileByUserId(anyLong()))
                .thenReturn(mockProfileData);
        
        when(studentService.updateStudentProfile(anyLong(), any()))
                .thenReturn(mockProfileData);
    }
    
    @Test
    void testGetStudentCoursesWithFilters() throws Exception {
        mockMvc.perform(get("/api/students/{userId}/courses", userId)
                .param("search", "programming")
                .param("courseCode", "CS101"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetStudentStats() throws Exception {
        mockMvc.perform(get("/api/students/{userId}/stats", userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.enrolledCourses").value(5))
                .andExpect(jsonPath("$.completedFeedbacks").value(3))
                .andExpect(jsonPath("$.pendingFeedbacks").value(2));
    }

    @Test
    void testGetStudentFeedbackForms() throws Exception {
        mockMvc.perform(get("/api/students/{userId}/feedback-forms", userId)
                .param("page", "0")
                .param("size", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalItems").value(1))
                .andExpect(jsonPath("$.content[0].id").value(1))
                .andExpect(jsonPath("$.content[0].courseCode").value("CS101"));
    }

    @Test
    void testGetSubmittedFeedback() throws Exception {
        mockMvc.perform(get("/api/students/{userId}/submitted-feedback", userId)
                .param("page", "0")
                .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalItems").value(1))
                .andExpect(jsonPath("$.content[0].id").value(1))
                .andExpect(jsonPath("$.content[0].courseCode").value("CS101"));
    }

    
    @Test
    void testGetAllFacultyWithDepartmentFilter() throws Exception {
        mockMvc.perform(get("/api/students/faculty")
                .param("department", "Computer Science"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetFacultyStats() throws Exception {
        mockMvc.perform(get("/api/students/faculty/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalFaculty").value(25))
                .andExpect(jsonPath("$.departmentCount").value(5))
                .andExpect(jsonPath("$.highestRated").value("Dr. Jane Smith"));
    }

    @Test
    void testSearchFaculty() throws Exception {
        mockMvc.perform(get("/api/students/faculty/search")
                .param("query", "Smith"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Dr. Jane Smith"));
    }

    @Test
    void testGetFacultyById() throws Exception {
        Long facultyId = 1L;
        
        mockMvc.perform(get("/api/students/faculty/{facultyId}", facultyId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Dr. Jane Smith"))
                .andExpect(jsonPath("$.department").value("Computer Science"))
                .andExpect(jsonPath("$.rating").value(4.5));
    }

    @Test
    void testGetFeedbackForm() throws Exception {
        Long formId = 1L;
        
        mockMvc.perform(get("/api/students/{userId}/feedback-form/{formId}", userId, formId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.courseCode").value("CS101"))
                .andExpect(jsonPath("$.facultyName").value("Dr. Jane Smith"));
    }

    @Test
    void testGetStudentProfile() throws Exception {
        mockMvc.perform(get("/api/students/{userId}/profile", userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("John Student"))
                .andExpect(jsonPath("$.email").value("john.student@university.edu"));
    }

    @Test
    void testUpdateStudentProfile() throws Exception {
        Map<String, Object> updatedProfile = new HashMap<>();
        updatedProfile.put("name", "John Updated Student");
        updatedProfile.put("email", "john.updated@university.edu");
        
        // Override the mock response for this specific case
        Map<String, Object> updatedData = new HashMap<>(mockProfileData);
        updatedData.put("name", "John Updated Student");
        updatedData.put("email", "john.updated@university.edu");
        when(studentService.updateStudentProfile(eq(userId), any())).thenReturn(updatedData);
        
        mockMvc.perform(put("/api/students/{userId}/profile", userId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedProfile)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("John Updated Student"))
                .andExpect(jsonPath("$.email").value("john.updated@university.edu"));
    }
}