package com.example.demo.service;

import com.example.demo.model.Course;
import com.example.demo.model.Feedback;

import java.util.List;
import java.util.Optional;

public interface EvaluationService {
    List<Feedback> getEvaluationsByFaculty(String facultyId);
    double getAverageRating(String facultyId);
    List<Course> getCoursesByFaculty(String facultyId);
    List<Feedback> getEvaluationsByFacultyAndCourse(String facultyId, String courseCode);
    Object getPositiveFeedbackCount(String facultyId);
    Object getNegativeFeedbackCount(String facultyId);

    List<Feedback> getFacultyFeedbackWithCourses(String facultyId);

    //new
    Optional<Feedback> getFeedbackById(Long feedbackId);
    List<Feedback> getFeedbackByCourseId(Long courseId);
    List<Feedback> getSimilarFeedback(Long feedbackId, Long courseId);
    Long getTotalFeedbackCount(String facultyId);
}