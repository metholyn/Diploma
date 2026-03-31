package com.library.controller;

import com.library.entity.BorrowRecord;
import com.library.payload.request.BorrowRequest;
import com.library.security.services.UserDetailsImpl;
import com.library.service.BorrowService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/borrow")
public class BorrowController {

    @Autowired
    private BorrowService borrowService;

    @PostMapping("/issue")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN')")
    public ResponseEntity<BorrowRecord> issueBook(
            @Valid @RequestBody BorrowRequest borrowRequest,
            Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(borrowService.issueBook(borrowRequest, userDetails.getUsername()));
    }

    @PostMapping("/return/{recordId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN')")
    public ResponseEntity<BorrowRecord> returnBook(
            @PathVariable("recordId") Long recordId,
            Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(borrowService.returnBook(recordId, userDetails.getUsername()));
    }

    @GetMapping("/active")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN')")
    public List<BorrowRecord> getActiveBorrows() {
        return borrowService.getActiveBorrows();
    }

    @GetMapping("/card/{userCardId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN') or hasRole('READER')")
    public List<BorrowRecord> getBorrowsByCard(@PathVariable("userCardId") Long userCardId) {
        return borrowService.getBorrowsByCard(userCardId);
    }
}

