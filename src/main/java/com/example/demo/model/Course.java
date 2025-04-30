package com.example.demo.model;

import java.security.Timestamp;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "courses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long courseId;

    @Column(nullable = false, unique = true, length = 20)
    private String courseCode;

    @Column(length = 100)
    private String courseTitle;

    @ManyToOne
    @JoinColumn(name = "department_id", foreignKey = @ForeignKey(name = "fk_course_department"))
    private Department department;

    private Integer semester;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CourseType courseType;

    private Integer creditHours;

    public enum CourseType {
        Theory, Lab
    }
}
