package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "feedback_questions")
public class FeedbackQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long questionId;

    @ManyToOne
    @JoinColumn(name = "form_id")
    private FeedbackForm form;

    private String questionText;

    @Enumerated(EnumType.STRING)
    private QuestionType questionType;

    private boolean isRequired;

    public enum QuestionType {
        RATING, TEXT, YES_NO, SCALE_1_5, SCALE_1_10
    }
}
