package com.example.demo.repository;

import com.example.demo.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    
    @Query("SELECT f FROM Feedback f WHERE f.facultyId = :facultyId")
    List<Feedback> findAllByFacultyId(@Param("facultyId") String facultyId);
    
    // fixed for course dropdown
    List<Feedback> findByFacultyIdAndCourseId(String facultyId, Long courseId);

    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.facultyId = :facultyId")
    Long countByFacultyId(@Param("facultyId") String facultyId);

    Object countByFacultyIdAndRatingGreaterThan(String facultyId, int i);

    Object countByFacultyIdAndRatingLessThan(String facultyId, int i);

    //List<Feedback> findFeedbackWithCoursesByFacultyId(String facultyId);
    @Query("SELECT f FROM Feedback f JOIN FETCH Course c ON f.courseId = c.id WHERE f.facultyId = :facultyId")
    List<Feedback> findFeedbackWithCoursesByFacultyId(@Param("facultyId") String facultyId);

    @Query("SELECT f FROM Feedback f JOIN Course c ON f.courseId = c.id WHERE f.facultyId = :facultyId")
    List<Feedback> findByFacultyIdWithCourses(@Param("facultyId") String facultyId);


    //for student dash
    List<Feedback> findByStudentId(String studentId);
    List<Feedback> findByCourseId(Long courseId);
    List<Feedback> findByFacultyId(String facultyId);
    Feedback findByStudentIdAndCourseId(String studentId, Long courseId);
}