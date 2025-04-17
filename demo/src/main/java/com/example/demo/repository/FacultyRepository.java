package com.example.demo.repository;

import com.example.demo.model.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface FacultyRepository extends JpaRepository<Faculty, Long> {
    Faculty findByFacultyId(String facultyId);

    @Query("SELECT u.fullName FROM User u WHERE u.dtype = 'FACULTY' AND u.facultyId = :facultyId")
    String findNameByFacultyId(@Param("facultyId") String facultyId);
}
