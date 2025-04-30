package com.example.demo.controller;

import com.example.demo.service.FeedbackService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.HashMap;
import java.util.Map;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(FeedbackController.class)
public class FeedbackControllerTest {

    @MockBean
    private FeedbackService feedbackService;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @BeforeEach
    public void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Test
    public void submitFeedback_shouldReturnSuccessResponse() throws Exception {
        // Arrange
        Long userId = 1L;
        Map<String, Object> feedbackData = new HashMap<>();
        feedbackData.put("courseId", 101L);
        feedbackData.put("facultyId", 201L);
        feedbackData.put("rating", 5);
        feedbackData.put("comment", "Excellent teaching");
        feedbackData.put("questionResponses", Map.of(
                "1", 5,
                "2", 4,
                "3", "The course material was very helpful"
        ));

        Map<String, Object> result = new HashMap<>();
        result.put("id", 1L);
        result.put("success", true);
        result.put("message", "Feedback submitted successfully");

        when(feedbackService.submitFeedback(eq(userId), any(Map.class))).thenReturn(result);

        // Act & Assert
        mockMvc.perform(post("/api/students/{userId}/submit-feedback", userId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(feedbackData)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Feedback submitted successfully"));
    }

    @Test
    public void getSubmittedFeedback_shouldReturnFeedbackDetails() throws Exception {
        // Arrange
        Long userId = 1L;
        Long feedbackId = 101L;

        Map<String, Object> submittedFeedback = new HashMap<>();
        submittedFeedback.put("id", feedbackId);
        submittedFeedback.put("courseId", 201L);
        submittedFeedback.put("courseName", "Introduction to Programming");
        submittedFeedback.put("facultyId", 301L);
        submittedFeedback.put("facultyName", "Dr. Smith");
        submittedFeedback.put("rating", 5);
        submittedFeedback.put("comment", "Excellent teaching");
        submittedFeedback.put("submittedDate", "2024-04-15");
        submittedFeedback.put("questionResponses", Map.of(
                "1", 5,
                "2", 4,
                "3", "The course material was very helpful"
        ));

        when(feedbackService.getSubmittedFeedbackById(userId, feedbackId)).thenReturn(submittedFeedback);

        // Act & Assert
        mockMvc.perform(get("/api/students/{userId}/feedback-detail/{feedbackId}", userId, feedbackId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(feedbackId))
                .andExpect(jsonPath("$.courseName").value("Introduction to Programming"))
                .andExpect(jsonPath("$.facultyName").value("Dr. Smith"))
                .andExpect(jsonPath("$.rating").value(5))
                .andExpect(jsonPath("$.comment").value("Excellent teaching"));
    }

    @Test
    public void getSubmittedFeedbackByCourse_shouldReturnFeedbackForCourse() throws Exception {
        // Arrange
        Long userId = 1L;
        Long courseId = 101L;

        Map<String, Object> submittedFeedback = new HashMap<>();
        submittedFeedback.put("id", 1L);
        submittedFeedback.put("courseId", courseId);
        submittedFeedback.put("courseName", "Introduction to Programming");
        submittedFeedback.put("facultyId", 301L);
        submittedFeedback.put("facultyName", "Dr. Smith");
        submittedFeedback.put("rating", 4);
        submittedFeedback.put("comment", "Good course structure");
        submittedFeedback.put("submittedDate", "2024-04-10");

        when(feedbackService.getSubmittedFeedbackByCourseId(userId, courseId)).thenReturn(submittedFeedback);

        // Act & Assert
        mockMvc.perform(get("/api/students/{userId}/feedback-by-course", userId)
                .param("courseId", String.valueOf(courseId)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.courseId").value(courseId))
                .andExpect(jsonPath("$.courseName").value("Introduction to Programming"))
                .andExpect(jsonPath("$.rating").value(4))
                .andExpect(jsonPath("$.comment").value("Good course structure"));
    }

    @Test
    public void submitFeedback_withInvalidData_shouldHandleError() throws Exception {
        // Arrange
        Long userId = 1L;
        Map<String, Object> feedbackData = new HashMap<>();
        // Missing required fields
        feedbackData.put("comment", "This feedback is missing required fields");

        Map<String, Object> errorResult = new HashMap<>();
        errorResult.put("success", false);
        errorResult.put("message", "Invalid feedback data: Missing required fields");

        when(feedbackService.submitFeedback(eq(userId), any(Map.class))).thenReturn(errorResult);

        // Act & Assert
        mockMvc.perform(post("/api/students/{userId}/submit-feedback", userId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(feedbackData)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Invalid feedback data: Missing required fields"));
    }

    @Test
    public void getSubmittedFeedback_nonExistentFeedback_shouldHandleError() throws Exception {
        // Arrange
        Long userId = 1L;
        Long nonExistentFeedbackId = 999L;

        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", "Feedback not found");
        errorResponse.put("feedbackId", nonExistentFeedbackId);

        when(feedbackService.getSubmittedFeedbackById(userId, nonExistentFeedbackId)).thenReturn(errorResponse);

        // Act & Assert
        mockMvc.perform(get("/api/students/{userId}/feedback-detail/{feedbackId}", userId, nonExistentFeedbackId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.error").value("Feedback not found"))
                .andExpect(jsonPath("$.feedbackId").value(nonExistentFeedbackId));
    }
}