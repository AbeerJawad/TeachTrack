package com.example.demo.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Column;

@Entity
@DiscriminatorValue("FACULTY") // Ensures dtype = "FACULTY" in DB
public class Faculty extends User {

    @Column(unique = true)
    private String facultyId;

    public Faculty() {
        super(); 
    }

    public String getFacultyId() { return facultyId; }

    public void setFacultyId(String facultyId) {
        if (facultyId == null || facultyId.isEmpty()) {
            this.facultyId = "FAC-" + System.currentTimeMillis(); // Assign faculty ID
        } else {
            this.facultyId = facultyId;
        }
    }
}
