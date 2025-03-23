package com.example.demo.repository;

import com.example.demo.model.Evaluation;
import com.example.demo.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    
    List<Evaluation> findByStudentAndCompletedOrderByDueDateAsc(Student student, boolean completed);
    
    @Query("SELECT COUNT(e) FROM Evaluation e WHERE e.student = ?1 AND e.completed = false")
    long countPendingEvaluationsByStudent(Student student);
    
    @Query("SELECT COUNT(e) FROM Evaluation e WHERE e.student = ?1 AND e.completed = true")
    long countCompletedEvaluationsByStudent(Student student);
    
    @Query("SELECT MIN(e.dueDate) FROM Evaluation e WHERE e.student = ?1 AND e.completed = false")
    LocalDateTime findNextDueDateForStudent(Student student);
}