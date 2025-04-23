package com.example.demo.repository;

import com.example.demo.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EvaluationRepository extends JpaRepository<Feedback, Long> {
    // 12test Update methods to use String for facultyId
    List<Feedback> findByFacultyId(String facultyId);  // Updated to String
    List<Feedback> findByFacultyIdAndCourseId(String facultyId, Long courseId);  // Updated to String for facultyId
}