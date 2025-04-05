package com.example.demo.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Column;

@Entity
@DiscriminatorValue("STUDENT") 
public class Student extends User {

    @Column(unique = true)
    private String studentId;

    public Student() {
        super(); 
    }

    public String getStudentId() { return studentId; }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }
}
