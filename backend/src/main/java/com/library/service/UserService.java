package com.library.service;

import com.library.entity.User;
import com.library.entity.UserCard;
import com.library.repository.UserCardRepository;
import com.library.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserCardRepository userCardRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getCurrentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("User not found"));
    }

    public UserCard createUserCard(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found with id: " + userId));
        if (userCardRepository.findByUserId(userId).isPresent()) {
            throw new IllegalArgumentException("User already has a library card");
        }
        String cardNumber = "LD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        UserCard card = new UserCard(user, cardNumber, LocalDate.now());
        return userCardRepository.save(card);
    }

    public UserCard getUserCard(Long userId) {
        return userCardRepository.findByUserId(userId)
                .orElseThrow(() -> new NoSuchElementException("Library card not found for user id: " + userId));
    }

    public User setUserEnabled(Long userId, boolean enabled) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found with id: " + userId));
        user.setEnabled(enabled);
        return userRepository.save(user);
    }
}
