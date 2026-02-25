package com.library.controller;

import com.library.entity.Book;
import com.library.entity.BorrowRecord;
import com.library.entity.UserCard;
import com.library.payload.request.BorrowRequest;
import com.library.repository.BookRepository;
import com.library.repository.BorrowRecordRepository;
import com.library.repository.UserCardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/borrow")
public class BorrowController {

    @Autowired
    BorrowRecordRepository borrowRecordRepository;

    @Autowired
    BookRepository bookRepository;

    @Autowired
    UserCardRepository userCardRepository;

    @PostMapping("/issue")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN')")
    public ResponseEntity<?> issueBook(@RequestBody BorrowRequest borrowRequest) {
        Optional<Book> bookData = bookRepository.findById(borrowRequest.getBookId());
        Optional<UserCard> cardData = userCardRepository.findById(borrowRequest.getUserCardId());

        if (!bookData.isPresent() || !cardData.isPresent()) {
            return ResponseEntity.badRequest().body("Book or User Card not found");
        }

        Book book = bookData.get();
        if (book.getAvailableCopies() <= 0) {
            return ResponseEntity.badRequest().body("No available copies for this book");
        }

        // Decrease available copies
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        LocalDate expectedReturn = LocalDate.now()
                .plusDays(borrowRequest.getDaysToBorrow() > 0 ? borrowRequest.getDaysToBorrow() : 14);

        BorrowRecord record = new BorrowRecord(book, cardData.get(), LocalDate.now(), expectedReturn,
                BorrowRecord.Status.BORROWED);
        borrowRecordRepository.save(record);

        return ResponseEntity.ok(record);
    }

    @PostMapping("/return/{recordId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN')")
    public ResponseEntity<?> returnBook(@PathVariable("recordId") Long recordId) {
        Optional<BorrowRecord> recordData = borrowRecordRepository.findById(recordId);

        if (!recordData.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        BorrowRecord record = recordData.get();
        if (record.getStatus() == BorrowRecord.Status.RETURNED) {
            return ResponseEntity.badRequest().body("Book is already returned");
        }

        record.setStatus(BorrowRecord.Status.RETURNED);
        record.setActualReturnDate(LocalDate.now());

        // Increase available copies
        Book book = record.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);

        borrowRecordRepository.save(record);

        return ResponseEntity.ok(record);
    }

    @GetMapping("/active")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN')")
    public List<BorrowRecord> getActiveBorrows() {
        return borrowRecordRepository.findByStatus(BorrowRecord.Status.BORROWED);
    }

    @GetMapping("/card/{userCardId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN') or hasRole('READER')")
    public List<BorrowRecord> getBorrowsByCard(@PathVariable("userCardId") Long userCardId) {
        return borrowRecordRepository.findByUserCardId(userCardId);
    }
}
