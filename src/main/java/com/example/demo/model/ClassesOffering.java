package com.example.demo.model;

import java.security.Timestamp;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "class_offerings")
@Data 
@NoArgsConstructor 
@AllArgsConstructor
public class ClassesOffering {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer offeringId;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    @ManyToOne
    @JoinColumn(name = "faculty_id")
    private Faculty faculty;

    @ManyToOne
    @JoinColumn(name = "term_id")
    private AcademicTerm term;

    private String section;
    private Integer maxStudents;
    private Timestamp createdAt;
}
