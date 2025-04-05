package com.example.demo.service;

import com.example.demo.model.*;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public String registerUser(User user) {
        if (!(user instanceof Student || user instanceof Faculty || user instanceof Admin)) {
            return "Error: Invalid user type provided.";
        }

        // Save user first to generate the ID
        User savedUser = userRepository.save(user);

        // Assign a custom ID 
        if (savedUser instanceof Student) {
            ((Student) savedUser).setStudentId("STU-" + savedUser.getId());
            userRepository.save((Student) savedUser); // Save Student
        } else if (savedUser instanceof Faculty) {
            ((Faculty) savedUser).setFacultyId("FAC-" + savedUser.getId());
            userRepository.save((Faculty) savedUser); // Save Faculty
        } else if (savedUser instanceof Admin) {
            ((Admin) savedUser).setAdminId("ADM-" + savedUser.getId());
            userRepository.save((Admin) savedUser); // Save Admin
        }

        return "User registered successfully!";
    }
}
