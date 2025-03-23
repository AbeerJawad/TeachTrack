package com.example.demo.service;

import com.example.demo.model.Evaluation;
import com.example.demo.model.Student;
import com.example.demo.repository.EvaluationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class EvaluationService {

    private final EvaluationRepository evaluationRepository;
    
    public EvaluationService(EvaluationRepository evaluationRepository) {
        this.evaluationRepository = evaluationRepository;
    }
    
    public List<Evaluation> getPendingEvaluations(Student student) {
        return evaluationRepository.findByStudentAndCompletedOrderByDueDateAsc(student, false);
    }
    
    public List<Evaluation> getCompletedEvaluations(Student student) {
        return evaluationRepository.findByStudentAndCompletedOrderByDueDateAsc(student, true);
    }
    
    public Map<String, Object> getEvaluationStats(Student student) {
        Map<String, Object> stats = new HashMap<>();
        
        // Get counts
        long pendingCount = evaluationRepository.countPendingEvaluationsByStudent(student);
        long completedCount = evaluationRepository.countCompletedEvaluationsByStudent(student);
        
        // Get next due date
        LocalDateTime nextDueDate = evaluationRepository.findNextDueDateForStudent(student);
        String formattedDueDate = nextDueDate != null ? 
                nextDueDate.format(DateTimeFormatter.ofPattern("MMMM d, yyyy")) : 
                "No upcoming deadlines";
        
        stats.put("pendingEvaluations", pendingCount);
        stats.put("completedEvaluations", completedCount);
        stats.put("nextDueDate", formattedDueDate);
        
        return stats;
    }
    
    public Evaluation submitFeedback(Long evaluationId, String feedback) {
        Optional<Evaluation> evaluationOpt = evaluationRepository.findById(evaluationId);
        
        if (evaluationOpt.isPresent()) {
            Evaluation evaluation = evaluationOpt.get();
            evaluation.setFeedback(feedback);
            evaluation.setCompleted(true);
            evaluation.setSubmissionDate(LocalDateTime.now());
            return evaluationRepository.save(evaluation);
        }
        
        return null;
    }
}