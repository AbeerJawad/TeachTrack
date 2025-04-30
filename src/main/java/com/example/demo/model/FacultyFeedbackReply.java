package com.example.demo.model;

import java.security.Timestamp;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "faculty_feedback_replies")
public class FacultyFeedbackReply {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long replyId;

    @ManyToOne
    @JoinColumn(name = "response_id")
    private FeedbackResponse response;

    @ManyToOne
    @JoinColumn(name = "faculty_id")
    private Faculty faculty;

    private String replyText;
    private Timestamp repliedAt;
}
