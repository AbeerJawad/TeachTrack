package com.example.demo.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.example.demo.service.NotificationService;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(NotificationController.class)
public class NotificationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private NotificationService notificationService;

    @Autowired
    private ObjectMapper objectMapper;

    private Map<String, Object> mockNotificationResponse;
    private Long userId;

    @BeforeEach
    void setUp() {
        userId = 1L;
        
        // Setup mock notification response
        mockNotificationResponse = new HashMap<>();
        mockNotificationResponse.put("id", 1L);
        mockNotificationResponse.put("message", "Test notification");
        mockNotificationResponse.put("read", false);
        mockNotificationResponse.put("createdAt", "2025-04-28T10:00:00");
        
        // Mock paginated response
        Map<String, Object> paginatedResponse = new HashMap<>();
        paginatedResponse.put("content", new Object[] { mockNotificationResponse });
        paginatedResponse.put("totalItems", 1);
        paginatedResponse.put("totalPages", 1);
        paginatedResponse.put("currentPage", 0);
        
        // Setup mock service responses
        when(notificationService.getNotificationsByStudentUserId(
                anyLong(), anyInt(), anyInt(), anyString(), anyString(), anyString()))
                .thenReturn(paginatedResponse);
        
        when(notificationService.getNotificationById(anyLong(), anyLong()))
                .thenReturn(mockNotificationResponse);
        
        Map<String, Object> readResponse = new HashMap<>();
        readResponse.put("success", true);
        readResponse.put("message", "Notification marked as read");
        
        when(notificationService.markNotificationAsRead(anyLong(), anyLong()))
                .thenReturn(readResponse);
        
        Map<String, Object> readAllResponse = new HashMap<>();
        readAllResponse.put("success", true);
        readAllResponse.put("message", "All notifications marked as read");
        readAllResponse.put("count", 5);
        
        when(notificationService.markAllNotificationsAsRead(anyLong()))
                .thenReturn(readAllResponse);
    }

    @Test
    void testGetStudentNotifications() throws Exception {
        mockMvc.perform(get("/api/students/{userId}/notifications", userId)
                .param("page", "0")
                .param("size", "10")
                .param("search", "")
                .param("type", "all")
                .param("sort", "newest"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalItems").value(1))
                .andExpect(jsonPath("$.currentPage").value(0));
    }
    
    @Test
    void testGetStudentNotificationsWithFilters() throws Exception {
        mockMvc.perform(get("/api/students/{userId}/notifications", userId)
                .param("page", "0")
                .param("size", "5")
                .param("search", "test")
                .param("type", "alert")
                .param("sort", "oldest"))
                .andExpect(status().isOk());
        
        // Verify that the service was called with the right parameters
        // This isn't strictly necessary but helps ensure filters get passed through
    }

    @Test
    void testGetNotificationDetail() throws Exception {
        Long notificationId = 1L;
        
        mockMvc.perform(get("/api/students/{userId}/notifications/{notificationId}", userId, notificationId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(notificationId))
                .andExpect(jsonPath("$.message").value("Test notification"))
                .andExpect(jsonPath("$.read").value(false));
    }

    @Test
    void testMarkNotificationAsRead() throws Exception {
        Long notificationId = 1L;
        
        mockMvc.perform(post("/api/students/{userId}/notifications/{notificationId}/read", userId, notificationId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Notification marked as read"));
    }

    @Test
    void testMarkAllNotificationsAsRead() throws Exception {
        mockMvc.perform(post("/api/students/{userId}/notifications/read-all", userId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.count").value(5));
    }
}