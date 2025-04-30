package com.example.demo.model;

import java.security.Timestamp;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "faculty_statistics")
public class FacultyStatistics {
    @Id
    @OneToOne
    @JoinColumn(name = "faculty_id")
    private Faculty faculty;

    private float avgRating;
    private int totalFeedbacks;
    private Timestamp lastFeedbackDate;
}
