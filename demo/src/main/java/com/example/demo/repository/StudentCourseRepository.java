package com.example.demo.repository;

import com.example.demo.model.StudentCourse;
import com.example.demo.model.Student;
import com.example.demo.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StudentCourseRepository extends JpaRepository<StudentCourse, Long> {
    List<StudentCourse> findByStudent(Student student);
    List<StudentCourse> findByCourse(Course course);

    List<StudentCourse> findByStudentStudentId(String studentId);
    @Query("SELECT sc.course FROM StudentCourse sc WHERE sc.student.studentId = :studentId")
    List<Course> findCoursesByStudentId(@Param("studentId") String studentId);
}

