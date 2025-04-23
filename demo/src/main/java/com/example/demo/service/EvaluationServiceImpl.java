package com.example.demo.service;

import com.example.demo.model.Course;
import com.example.demo.model.Feedback;
import com.example.demo.model.Faculty;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.EvaluationRepository;
import com.example.demo.repository.FacultyRepository;
import com.example.demo.repository.FeedbackRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Collections;
import java.util.Optional;

@Service
public class EvaluationServiceImpl implements EvaluationService {
    
    private final EvaluationRepository evaluationRepository;
    private final CourseRepository courseRepository;
    private final FacultyRepository facultyRepository;
    private final FeedbackRepository feedbackRepository;

    
    public EvaluationServiceImpl(
        EvaluationRepository evaluationRepository, 
        CourseRepository courseRepository,
        FacultyRepository facultyRepository, FeedbackRepository feedbackRepository) {
        this.evaluationRepository = evaluationRepository;
        this.courseRepository = courseRepository;
        this.facultyRepository = facultyRepository;
        this.feedbackRepository=feedbackRepository;
    }
    
    @Override
    public List<Feedback> getEvaluationsByFaculty(String facultyId) {
        return evaluationRepository.findByFacultyId(facultyId);
    }
    
    @Override
    public double getAverageRating(String facultyId) {
        List<Feedback> evaluations = evaluationRepository.findByFacultyId(facultyId);
        if (evaluations.isEmpty()) {
            return 0.0;
        }
        
        return evaluations.stream()
            .mapToInt(Feedback::getRating)
            .average()
            .orElse(0.0);
    }
    
    @Override
    public List<Course> getCoursesByFaculty(String facultyId) {
        System.out.println("Service: Finding courses for faculty ID: " + facultyId);
        
        Faculty faculty = facultyRepository.findByFacultyId(facultyId);
        if (faculty == null) {
            System.out.println("Service: No faculty found with ID: " + facultyId);
            return Collections.emptyList();
        }
        
        List<Course> courses = courseRepository.findCoursesByFacultyId(facultyId);
        System.out.println("Service: Found " + courses.size() + " courses");
        
        return courses;
    }
    
    @Override
    public List<Feedback> getEvaluationsByFacultyAndCourse(String facultyId, String courseCode) {
        Course course = courseRepository.findByCourseCode(courseCode);
        if (course != null) {
            return evaluationRepository.findByFacultyIdAndCourseId(facultyId, course.getId());
        }
        return Collections.emptyList();
    }

    @Override
    public Object getPositiveFeedbackCount(String facultyId) {
        return feedbackRepository.countByFacultyIdAndRatingGreaterThan(facultyId, 3);      
    }

    @Override
    public Object getNegativeFeedbackCount(String facultyId) {
        return feedbackRepository.countByFacultyIdAndRatingLessThan(facultyId, 3);
    }

    @Override
    public List<Feedback> getFacultyFeedbackWithCourses(String facultyId) {
        List<Feedback> feedbackList = feedbackRepository.findByFacultyIdWithCourses(facultyId);
        
        // Populate course information for each feedback
        for (Feedback feedback : feedbackList) {
            Long courseId = feedback.getCourseId();
            Course course = courseRepository.findById(courseId).orElse(null);
            if (course != null) {
                feedback.setCourseCode(course.getCourseCode());
                feedback.setCourseName(course.getCourseName());
            }
        }
        
        return feedbackList;
    }

    //new
    @Override
    public Optional<Feedback> getFeedbackById(Long feedbackId) {
        return feedbackRepository.findById(feedbackId);
    }
    
    @Override
    public List<Feedback> getFeedbackByCourseId(Long courseId) {
        // This would require a new method in your repository
        // For now, we'll filter all feedback to find matching course IDs
        return feedbackRepository.findAll().stream()
            .filter(feedback -> feedback.getCourseId().equals(courseId))
            .collect(Collectors.toList());
    }
    
    @Override
    public List<Feedback> getSimilarFeedback(Long feedbackId, Long courseId) {
        // Get feedback with the same course ID but excluding the current feedback
        return feedbackRepository.findAll().stream()
            .filter(feedback -> feedback.getCourseId().equals(courseId) && !feedback.getId().equals(feedbackId))
            .limit(5) // Limit to 5 similar feedback items
            .collect(Collectors.toList());
    }
    
    @Override
    public Long getTotalFeedbackCount(String facultyId) {
        return feedbackRepository.countByFacultyId(facultyId);
    }

}