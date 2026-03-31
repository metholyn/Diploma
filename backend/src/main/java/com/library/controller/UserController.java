package com.library.controller;

import com.library.entity.User;
import com.library.entity.UserCard;
import com.library.security.services.UserDetailsImpl;
import com.library.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN')")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(userService.getCurrentUser(userDetails.getUsername()));
    }

    @PostMapping("/{userId}/card")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN')")
    public ResponseEntity<UserCard> createUserCard(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(userService.createUserCard(userId));
    }

    @GetMapping("/{userId}/card")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN') or authentication.principal.id == #userId")
    public ResponseEntity<UserCard> getUserCard(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(userService.getUserCard(userId));
    }

    @PatchMapping("/{userId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> setUserStatus(
            @PathVariable("userId") Long userId,
            @RequestParam boolean enabled) {
        return ResponseEntity.ok(userService.setUserEnabled(userId, enabled));
    }
}

