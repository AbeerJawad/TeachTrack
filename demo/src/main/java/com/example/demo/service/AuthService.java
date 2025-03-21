package com.example.demo.service;

import com.example.demo.dto.LoginRequest;
import com.example.demo.model.Admin;
import com.example.demo.model.Faculty;
import com.example.demo.model.Student;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {
    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Map<String, String> authenticate(LoginRequest request) {
    Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
    
    if (userOptional.isPresent()) {
        User user = userOptional.get();
        
        if (user.getPasswordHash().equals(request.getPassword())) {
            // Create response data
            Map<String, String> responseData = new HashMap<>();
            responseData.put("dtype", user.getDtype());
            responseData.put("email", user.getEmail());
            responseData.put("fullName", user.getFullName());
            
            // Add role-specific IDs if available
            if (user instanceof Student) {
                responseData.put("studentId", ((Student) user).getStudentId());
            } else if (user instanceof Faculty) {
                responseData.put("facultyId", ((Faculty) user).getFacultyId());
            } else if (user instanceof Admin) {
                responseData.put("adminId", ((Admin) user).getAdminId());
            }
            
            return responseData;
        } else {
            System.out.println("Password mismatch for user: " + request.getEmail());
        }
    }
    
    return null;
}
    
}
