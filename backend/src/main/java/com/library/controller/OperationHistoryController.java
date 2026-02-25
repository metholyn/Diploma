package com.library.controller;

import com.library.entity.OperationHistory;
import com.library.repository.OperationHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/history")
public class OperationHistoryController {

    @Autowired
    OperationHistoryRepository operationHistoryRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<OperationHistory> getAllHistory() {
        return operationHistoryRepository.findAll();
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or authentication.principal.id == #userId")
    public List<OperationHistory> getUserHistory(@PathVariable("userId") Long userId) {
        return operationHistoryRepository.findByUserIdOrderByTimestampDesc(userId);
    }
}
