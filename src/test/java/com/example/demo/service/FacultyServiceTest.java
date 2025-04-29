package com.example.demo.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;

@ExtendWith(MockitoExtension.class)
public class FacultyServiceTest {

    @Mock
    private JdbcTemplate jdbcTemplate;

    @InjectMocks
    private FacultyService facultyService;

    private final Long testUserId = 1L;
    private final Long testFacultyId = 101L;
    private final Long testCourseId = 201L;
    private final Long testResponseId = 301L;

    @BeforeEach
    public void setup() {
        // Mock facultyId lookup
        when(jdbcTemplate.queryForObject(
            contains("SELECT faculty_id FROM faculty WHERE user_id = ?"), 
            eq(Long.class), 
            eq(testUserId)
        )).thenReturn(testFacultyId);
    }

    @Test
    public void getCoursesByFacultyUserId_shouldReturnCoursesList() {
        // Arrange
        List<Map<String, Object>> expectedCourses = new ArrayList<>();
        Map<String, Object> course1 = new HashMap<>();
        course1.put("course_id", 201L);
        course1.put("course_code", "CS101");
        course1.put("course_title", "Introduction to Programming");
        
        Map<String, Object> course2 = new HashMap<>();
        course2.put("course_id", 202L);
        course2.put("course_code", "CS201");
        course2.put("course_title", "Data Structures");
        
        expectedCourses.add(course1);
        expectedCourses.add(course2);
        
        when(jdbcTemplate.queryForList(
            contains("SELECT DISTINCT c.course_id, c.course_code, c.course_title"),
            eq(testUserId)
        )).thenReturn(expectedCourses);

        // Act
        List<Map<String, Object>> result = facultyService.getCoursesByFacultyUserId(testUserId);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("CS101", result.get(0).get("course_code"));
        assertEquals("Data Structures", result.get(1).get("course_title"));
        
        // Verify
        verify(jdbcTemplate).queryForList(anyString(), eq(testUserId));
    }

    @Test
    public void getFeedbackByFacultyUserId_shouldReturnPaginatedFeedback() {
        // Arrange
        List<Map<String, Object>> expectedFeedback = new ArrayList<>();
        Map<String, Object> feedback1 = new HashMap<>();
        feedback1.put("response_id", 301L);
        feedback1.put("course_code", "CS101");
        feedback1.put("course_title", "Introduction to Programming");
        feedback1.put("avg_rating", 4.5);
        feedback1.put("comments", "Great course!");
        feedback1.put("submitted_at", Timestamp.from(Instant.now()));
        feedback1.put("section", "A");
        feedback1.put("term_name", "Spring 2024");
        feedback1.put("is_anonymous", true);
        feedback1.put("sentiment", "POSITIVE");
        feedback1.put("has_reply", false);
        
        expectedFeedback.add(feedback1);
        
        when(jdbcTemplate.queryForList(
            anyString(), 
            any(Object[].class)
        )).thenReturn(expectedFeedback);
        
        when(jdbcTemplate.queryForObject(
            anyString(),
            eq(Integer.class),
            any(Object[].class)
        )).thenReturn(1);

        // Act
        Map<String, Object> result = facultyService.getFeedbackByFacultyUserId(testUserId, testCourseId, 0, 10);

        // Assert
        assertNotNull(result);
        assertEquals(1, ((List<?>) result.get("content")).size());
        assertEquals(1, result.get("totalItems"));
        assertEquals(1, result.get("totalPages"));
        assertEquals(0, result.get("currentPage"));
        
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> content = (List<Map<String, Object>>) result.get("content");
        assertEquals(301L, content.get(0).get("response_id"));
        assertEquals("CS101", content.get(0).get("course_code"));
        assertEquals(4.5, content.get(0).get("avg_rating"));
        
        // Verify
        verify(jdbcTemplate).queryForObject(contains("SELECT faculty_id FROM faculty"), eq(Long.class), eq(testUserId));
        verify(jdbcTemplate).queryForList(anyString(), any(Object[].class));
        verify(jdbcTemplate).queryForObject(contains("SELECT COUNT(*)"), eq(Integer.class), any(Object[].class));
    }

    @Test
    public void getFeedbackStatsByFacultyUserId_shouldReturnStats() {
        // Arrange
        when(jdbcTemplate.queryForObject(
            contains("SELECT COUNT(*)"),
            eq(Integer.class),
            any(Object[].class)
        )).thenReturn(10);
        
        when(jdbcTemplate.queryForObject(
            contains("SELECT COUNT(DISTINCT fr.response_id)") + contains("AND fa.rating_value >= 4"),
            eq(Integer.class),
            any(Object[].class)
        )).thenReturn(7);
        
        when(jdbcTemplate.queryForObject(
            contains("SELECT COUNT(DISTINCT fr.response_id)") + contains("AND fa.rating_value < 3"),
            eq(Integer.class),
            any(Object[].class)
        )).thenReturn(2);
        
        when(jdbcTemplate.queryForObject(
            contains("SELECT AVG(fa.rating_value)"),
            eq(Double.class),
            any(Object[].class)
        )).thenReturn(4.2);
        
        when(jdbcTemplate.queryForObject(
            contains("SELECT MAX(fr.submitted_at)"),
            eq(Timestamp.class),
            any(Object[].class)
        )).thenReturn(Timestamp.from(Instant.now()));

        // Act
        Map<String, Object> result = facultyService.getFeedbackStatsByFacultyUserId(testUserId, testCourseId);

        // Assert
        assertNotNull(result);
        assertEquals(10, result.get("totalFeedback"));
        assertEquals(7, result.get("positiveFeedback"));
        assertEquals(2, result.get("negativeFeedback"));
        assertEquals(4.2, result.get("averageRating"));
        assertNotNull(result.get("lastFeedbackDate"));
        
        // Verify
        verify(jdbcTemplate).queryForObject(contains("SELECT faculty_id FROM faculty"), eq(Long.class), eq(testUserId));
        verify(jdbcTemplate).queryForObject(contains("SELECT COUNT(*)"), eq(Integer.class), any(Object[].class));
        verify(jdbcTemplate).queryForObject(contains("SELECT COUNT(DISTINCT fr.response_id)") + contains("AND fa.rating_value >= 4"), eq(Integer.class), any(Object[].class));
        verify(jdbcTemplate).queryForObject(contains("SELECT COUNT(DISTINCT fr.response_id)") + contains("AND fa.rating_value < 3"), eq(Integer.class), any(Object[].class));
        verify(jdbcTemplate).queryForObject(contains("SELECT AVG(fa.rating_value)"), eq(Double.class), any(Object[].class));
        verify(jdbcTemplate).queryForObject(contains("SELECT MAX(fr.submitted_at)"), eq(Timestamp.class), any(Object[].class));
    }

    @Test
    public void getFeedbackDetailById_shouldReturnDetailedFeedback() {
        // Arrange
        Map<String, Object> feedbackDetails = new HashMap<>();
        feedbackDetails.put("response_id", testResponseId);
        feedbackDetails.put("faculty_id", testFacultyId);
        feedbackDetails.put("student_id", 401L);
        feedbackDetails.put("is_anonymous", true);
        feedbackDetails.put("submitted_at", Timestamp.from(Instant.now()));
        feedbackDetails.put("course_id", testCourseId);
        feedbackDetails.put("course_code", "CS101");
        feedbackDetails.put("course_title", "Introduction to Programming");
        feedbackDetails.put("section", "A");
        feedbackDetails.put("term_id", 501L);
        feedbackDetails.put("term_name", "Spring 2024");
        feedbackDetails.put("average_rating", 4.5);
        
        when(jdbcTemplate.queryForMap(
            contains("SELECT fr.response_id, fr.faculty_id"),
            eq(testResponseId)
        )).thenReturn(feedbackDetails);
        
        List<Map<String, Object>> answers = new ArrayList<>();
        Map<String, Object> answer1 = new HashMap<>();
        answer1.put("answer_id", 601L);
        answer1.put("question_id", 701L);
        answer1.put("question_text", "How would you rate this course?");
        answer1.put("question_type", "scale");
        answer1.put("answer_text", null);
        answer1.put("rating_value", 5);
        
        Map<String, Object> answer2 = new HashMap<>();
        answer2.put("answer_id", 602L);
        answer2.put("question_id", 702L);
        answer2.put("question_text", "What did you like about this course?");
        answer2.put("question_type", "text");
        answer2.put("answer_text", "Great course content and instructor!");
        answer2.put("rating_value", null);
        
        answers.add(answer1);
        answers.add(answer2);
        
        when(jdbcTemplate.queryForList(
            contains("SELECT fa.answer_id, fa.question_id"),
            eq(testResponseId)
        )).thenReturn(answers);
        
        List<Map<String, Object>> replies = new ArrayList<>();
        Map<String, Object> reply = new HashMap<>();
        reply.put("reply_id", 801L);
        reply.put("faculty_id", testFacultyId);
        reply.put("reply_text", "Thank you for your feedback!");
        reply.put("replied_at", Timestamp.from(Instant.now()));
        replies.add(reply);
        
        when(jdbcTemplate.queryForList(
            contains("SELECT ffr.reply_id, ffr.faculty_id"),
            eq(testResponseId)
        )).thenReturn(replies);

        // Act
        Map<String, Object> result = facultyService.getFeedbackDetailById(testResponseId);

        // Assert
        assertNotNull(result);
        assertEquals(testResponseId, result.get("response_id"));
        assertEquals("CS101", result.get("course_code"));
        assertEquals(4.5, result.get("average_rating"));
        assertEquals("POSITIVE", result.get("sentiment"));
        assertEquals("Great course content and instructor!", result.get("commentPreview"));
        
        assertNotNull(result.get("answers"));
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> resultAnswers = (List<Map<String, Object>>) result.get("answers");
        assertEquals(2, resultAnswers.size());
        
        assertNotNull(result.get("facultyReply"));
        @SuppressWarnings("unchecked")
        Map<String, Object> resultReply = (Map<String, Object>) result.get("facultyReply");
        assertEquals("Thank you for your feedback!", resultReply.get("reply_text"));
        
        assertNotNull(result.get("keyPoints"));
        assertNotNull(result.get("actionItems"));
        
        // Verify
        verify(jdbcTemplate).queryForMap(anyString(), eq(testResponseId));
        verify(jdbcTemplate).queryForList(contains("SELECT fa.answer_id"), eq(testResponseId));
        verify(jdbcTemplate).queryForList(contains("SELECT ffr.reply_id"), eq(testResponseId));
    }

    @Test
    public void saveFacultyReply_shouldCreateNewReply() {
        // Arrange
        Map<String, Object> replyData = new HashMap<>();
        replyData.put("responseId", 301);
        replyData.put("facultyId", 101);
        replyData.put("replyText", "Thank you for your feedback!");
        
        when(jdbcTemplate.queryForObject(
            contains("SELECT COUNT(*)"),
            eq(Integer.class),
            eq(testResponseId),
            eq(testFacultyId)
        )).thenReturn(0); // No existing reply
        
        Map<String, Object> savedReply = new HashMap<>();
        savedReply.put("reply_id", 801L);
        savedReply.put("faculty_id", testFacultyId);
        savedReply.put("reply_text", "Thank you for your feedback!");
        savedReply.put("replied_at", Timestamp.from(Instant.now()));
        
        when(jdbcTemplate.queryForMap(
            contains("SELECT reply_id, faculty_id"),
            eq(testResponseId),
            eq(testFacultyId)
        )).thenReturn(savedReply);

        // Act
        Map<String, Object> result = facultyService.saveFacultyReply(replyData);

        // Assert
        assertNotNull(result);
        assertEquals(801L, result.get("reply_id"));
        assertEquals(testFacultyId, result.get("faculty_id"));
        assertEquals("Thank you for your feedback!", result.get("reply_text"));
        
        // Verify
        verify(jdbcTemplate).queryForObject(contains("SELECT COUNT(*)"), eq(Integer.class), anyLong(), anyLong());
        verify(jdbcTemplate).update(contains("INSERT INTO faculty_feedback_replies"), anyLong(), anyLong(), anyString());
        verify(jdbcTemplate).queryForMap(anyString(), anyLong(), anyLong());
    }

    @Test
    public void saveFacultyReply_shouldUpdateExistingReply() {
        // Arrange
        Map<String, Object> replyData = new HashMap<>();
        replyData.put("responseId", 301);
        replyData.put("facultyId", 101);
        replyData.put("replyText", "Updated reply text");
        
        when(jdbcTemplate.queryForObject(
            contains("SELECT COUNT(*)"),
            eq(Integer.class),
            eq(testResponseId),
            eq(testFacultyId)
        )).thenReturn(1); // Existing reply
        
        Map<String, Object> updatedReply = new HashMap<>();
        updatedReply.put("reply_id", 801L);
        updatedReply.put("faculty_id", testFacultyId);
        updatedReply.put("reply_text", "Updated reply text");
        updatedReply.put("replied_at", Timestamp.from(Instant.now()));
        
        when(jdbcTemplate.queryForMap(
            contains("SELECT reply_id, faculty_id"),
            eq(testResponseId),
            eq(testFacultyId)
        )).thenReturn(updatedReply);

        // Act
        Map<String, Object> result = facultyService.saveFacultyReply(replyData);

        // Assert
        assertNotNull(result);
        assertEquals("Updated reply text", result.get("reply_text"));
        
        // Verify
        verify(jdbcTemplate).queryForObject(contains("SELECT COUNT(*)"), eq(Integer.class), anyLong(), anyLong());
        verify(jdbcTemplate).update(contains("UPDATE faculty_feedback_replies"), anyString(), anyLong(), anyLong());
        verify(jdbcTemplate).queryForMap(anyString(), anyLong(), anyLong());
    }

    @Test
    public void getFeedbackReplies_shouldReturnListOfReplies() {
        // Arrange
        List<Map<String, Object>> expectedReplies = new ArrayList<>();
        Map<String, Object> reply = new HashMap<>();
        reply.put("reply_id", 801L);
        reply.put("faculty_id", testFacultyId);
        reply.put("reply_text", "Thank you for your feedback!");
        reply.put("replied_at", Timestamp.from(Instant.now()));
        reply.put("faculty_name", "John Doe");
        expectedReplies.add(reply);
        
        when(jdbcTemplate.queryForList(
            contains("SELECT ffr.reply_id, ffr.faculty_id"),
            eq(testResponseId)
        )).thenReturn(expectedReplies);

        // Act
        List<Map<String, Object>> result = facultyService.getFeedbackReplies(testResponseId);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(801L, result.get(0).get("reply_id"));
        assertEquals("Thank you for your feedback!", result.get(0).get("reply_text"));
        assertEquals("John Doe", result.get(0).get("faculty_name"));
        
        // Verify
        verify(jdbcTemplate).queryForList(anyString(), eq(testResponseId));
    }

    @Test
    public void getFacultyRating_shouldReturnRatingData() {
        // Arrange
        Map<String, Object> ratingData = new HashMap<>();
        ratingData.put("average_rating", 4.2);
        ratingData.put("total_responses", 15L);
        ratingData.put("last_feedback_date", Timestamp.from(Instant.now()));
        
        when(jdbcTemplate.queryForMap(
            anyString(),
            any(Object[].class)
        )).thenReturn(ratingData);
        
        Map<String, Object> distributionData = new HashMap<>();
        distributionData.put("rating_1", 0L);
        distributionData.put("rating_2", 1L);
        distributionData.put("rating_3", 2L);
        distributionData.put("rating_4", 5L);
        distributionData.put("rating_5", 7L);
        
        when(jdbcTemplate.queryForMap(
            contains("SUM(CASE WHEN fa.rating_value = 1"),
            any(Object[].class)
        )).thenReturn(distributionData);

        // Act
        Map<String, Object> result = facultyService.getFacultyRating(testUserId, testCourseId, 501L);

        // Assert
        assertNotNull(result);
        assertEquals(4.2, result.get("average_rating"));
        assertEquals(15L, result.get("total_responses"));
        assertNotNull(result.get("last_feedback_date"));
        
        assertNotNull(result.get("distribution"));
        @SuppressWarnings("unchecked")
        Map<String, Object> distribution = (Map<String, Object>) result.get("distribution");
        assertEquals(0L, distribution.get("rating_1"));
        assertEquals(7L, distribution.get("rating_5"));
        
        // Verify
        verify(jdbcTemplate).queryForObject(contains("SELECT faculty_id FROM faculty"), eq(Long.class), eq(testUserId));
        verify(jdbcTemplate).queryForMap(contains("SELECT AVG(fa.rating_value) AS average_rating"), any(Object[].class));
        verify(jdbcTemplate).queryForMap(contains("SUM(CASE WHEN fa.rating_value = 1"), any(Object[].class));
    }
}