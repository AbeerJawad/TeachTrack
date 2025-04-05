package com.example.demo.repository;

import com.example.demo.model.Course;
import com.example.demo.model.Faculty;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByFacultyId(Long facultyId);
    Course findByCourseCode(String courseCode);

    @Query("SELECT c FROM Course c WHERE c.faculty.facultyId = :facultyId")
    List<Course> findCoursesByFacultyId(@Param("facultyId") String facultyId);
}