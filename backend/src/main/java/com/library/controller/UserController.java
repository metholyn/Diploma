package com.library.controller;

import com.library.entity.User;
import com.library.entity.UserCard;
import com.library.repository.UserCardRepository;
import com.library.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserCardRepository userCardRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN')")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping("/{userId}/card")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN')")
    public ResponseEntity<?> createUserCard(@PathVariable("userId") Long userId) {
        Optional<User> userData = userRepository.findById(userId);

        if (!userData.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        User user = userData.get();
        if (userCardRepository.findByUserId(userId).isPresent()) {
            return ResponseEntity.badRequest().body("User already has a card");
        }

        String cardNumber = "LD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        UserCard card = new UserCard(user, cardNumber, LocalDate.now());
        userCardRepository.save(card);

        return ResponseEntity.ok(card);
    }

    @GetMapping("/{userId}/card")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN') or authentication.principal.id == #userId")
    public ResponseEntity<UserCard> getUserCard(@PathVariable("userId") Long userId) {
        Optional<UserCard> cardData = userCardRepository.findByUserId(userId);
        return cardData.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
