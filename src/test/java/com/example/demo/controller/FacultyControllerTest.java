package com.example.demo.controller;

import com.example.demo.service.FacultyService;
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

import java.util.*;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(FacultyController.class)
public class FacultyControllerTest {

    @MockBean
    private FacultyService facultyService;

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
    public void getFacultyCourses_shouldReturnCoursesList() throws Exception {
        // Arrange
        Long facultyId = 1L;
        List<Map<String, Object>> courses = new ArrayList<>();
        Map<String, Object> course1 = new HashMap<>();
        course1.put("id", 1L);
        course1.put("courseCode", "CS101");
        course1.put("courseName", "Introduction to Programming");
        courses.add(course1);

        when(facultyService.getCoursesByFacultyUserId(facultyId)).thenReturn(courses);

        // Act & Assert
        mockMvc.perform(get("/api/faculty/{userId}/courses", facultyId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].courseCode").value("CS101"))
                .andExpect(jsonPath("$[0].courseName").value("Introduction to Programming"));
    }

    @Test
    public void getFacultyFeedback_shouldReturnFeedbackData() throws Exception {
        // Arrange
        Long facultyId = 1L;
        Long courseId = 2L;
        int page = 0;
        int size = 10;

        Map<String, Object> feedbackData = new HashMap<>();
        List<Map<String, Object>> content = new ArrayList<>();
        Map<String, Object> feedback1 = new HashMap<>();
        feedback1.put("id", 1L);
        feedback1.put("rating", 4);
        feedback1.put("comment", "Great teaching style");
        content.add(feedback1);

        feedbackData.put("content", content);
        feedbackData.put("totalItems", 1);
        feedbackData.put("totalPages", 1);
        feedbackData.put("currentPage", 0);

        when(facultyService.getFeedbackByFacultyUserId(eq(facultyId), eq(courseId), eq(page), eq(size)))
                .thenReturn(feedbackData);

        // Act & Assert
        mockMvc.perform(get("/api/faculty/{userId}/feedback", facultyId)
                .param("courseId", String.valueOf(courseId))
                .param("page", String.valueOf(page))
                .param("size", String.valueOf(size)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalItems").value(1))
                .andExpect(jsonPath("$.content[0].id").value(1))
                .andExpect(jsonPath("$.content[0].rating").value(4))
                .andExpect(jsonPath("$.content[0].comment").value("Great teaching style"));
    }

    @Test
    public void getFeedbackStats_shouldReturnStatisticsData() throws Exception {
        // Arrange
        Long facultyId = 1L;
        Long courseId = 2L;

        Map<String, Object> stats = new HashMap<>();
        stats.put("averageRating", 4.5);
        stats.put("totalFeedback", 10);
        stats.put("ratingDistribution", Map.of(
                "5", 5,
                "4", 3,
                "3", 2,
                "2", 0,
                "1", 0
        ));

        when(facultyService.getFeedbackStatsByFacultyUserId(eq(facultyId), eq(courseId))).thenReturn(stats);

        // Act & Assert
        mockMvc.perform(get("/api/faculty/{userId}/feedback/stats", facultyId)
                .param("courseId", String.valueOf(courseId)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.averageRating").value(4.5))
                .andExpect(jsonPath("$.totalFeedback").value(10))
                .andExpect(jsonPath("$.ratingDistribution.5").value(5));
    }

    @Test
    public void getFeedbackDetail_shouldReturnDetailedFeedback() throws Exception {
        // Arrange
        Long responseId = 1L;

        Map<String, Object> feedbackDetail = new HashMap<>();
        feedbackDetail.put("id", responseId);
        feedbackDetail.put("courseCode", "CS101");
        feedbackDetail.put("courseName", "Introduction to Programming");
        feedbackDetail.put("rating", 5);
        feedbackDetail.put("comment", "Excellent teaching method");
        feedbackDetail.put("submittedDate", "2024-04-15");

        when(facultyService.getFeedbackDetailById(responseId)).thenReturn(feedbackDetail);

        // Act & Assert
        mockMvc.perform(get("/api/faculty/feedback/{responseId}", responseId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(responseId))
                .andExpect(jsonPath("$.courseCode").value("CS101"))
                .andExpect(jsonPath("$.rating").value(5))
                .andExpect(jsonPath("$.comment").value("Excellent teaching method"));
    }

    @Test
    public void replyToFeedback_shouldReturnSuccessResponse() throws Exception {
        // Arrange
        Map<String, Object> replyData = new HashMap<>();
        replyData.put("responseId", 1L);
        replyData.put("facultyId", 2L);
        replyData.put("replyText", "Thank you for your feedback!");

        Map<String, Object> response = new HashMap<>();
        response.put("id", 1L);
        response.put("responseId", 1L);
        response.put("facultyId", 2L);
        response.put("replyText", "Thank you for your feedback!");
        response.put("replyDate", "2024-04-16");

        when(facultyService.saveFacultyReply(any(Map.class))).thenReturn(response);

        // Act & Assert
        mockMvc.perform(post("/api/faculty/feedback/reply")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(replyData)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.responseId").value(1))
                .andExpect(jsonPath("$.replyText").value("Thank you for your feedback!"));
    }

    @Test
    public void getFeedbackReplies_shouldReturnListOfReplies() throws Exception {
        // Arrange
        Long responseId = 1L;

        List<Map<String, Object>> replies = new ArrayList<>();
        Map<String, Object> reply = new HashMap<>();
        reply.put("id", 1L);
        reply.put("facultyName", "Dr. Smith");
        reply.put("replyText", "Thank you for your feedback!");
        reply.put("replyDate", "2024-04-16");
        replies.add(reply);

        when(facultyService.getFeedbackReplies(responseId)).thenReturn(replies);

        // Act & Assert
        mockMvc.perform(get("/api/faculty/feedback/{responseId}/replies", responseId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].facultyName").value("Dr. Smith"))
                .andExpect(jsonPath("$[0].replyText").value("Thank you for your feedback!"));
    }

    @Test
    public void getFacultyRating_shouldReturnRatingData() throws Exception {
        // Arrange
        Long facultyId = 1L;
        Long courseId = 2L;
        Long termId = 3L;

        Map<String, Object> ratingData = new HashMap<>();
        ratingData.put("overallRating", 4.7);
        ratingData.put("categoryRatings", Map.of(
                "Content", 4.8,
                "Delivery", 4.6,
                "Engagement", 4.7
        ));

        when(facultyService.getFacultyRating(eq(facultyId), eq(courseId), eq(termId))).thenReturn(ratingData);

        // Act & Assert
        mockMvc.perform(get("/api/faculty/{userId}/rating", facultyId)
                .param("courseId", String.valueOf(courseId))
                .param("termId", String.valueOf(termId)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.overallRating").value(4.7))
                .andExpect(jsonPath("$.categoryRatings.Content").value(4.8))
                .andExpect(jsonPath("$.categoryRatings.Delivery").value(4.6));
    }
}