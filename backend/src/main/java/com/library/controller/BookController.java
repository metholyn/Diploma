package com.library.controller;

import com.library.entity.Book;
import com.library.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/books")
public class BookController {

    @Autowired
    BookRepository bookRepository;

    @GetMapping
    public List<Book> getAllBooks(@RequestParam(required = false) String title) {
        if (title != null && !title.isEmpty()) {
            return bookRepository.findByTitleContainingIgnoreCase(title);
        }
        return bookRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable("id") long id) {
        Optional<Book> bookData = bookRepository.findById(id);
        return bookData.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN')")
    public Book createBook(@RequestBody Book book) {
        return bookRepository.save(new Book(
                book.getTitle(),
                book.getAuthor(),
                book.getIsbn(),
                book.getPublishedYear(),
                book.getTotalCopies(),
                book.getAvailableCopies()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN')")
    public ResponseEntity<Book> updateBook(@PathVariable("id") long id, @RequestBody Book bookDetails) {
        Optional<Book> bookData = bookRepository.findById(id);

        if (bookData.isPresent()) {
            Book _book = bookData.get();
            _book.setTitle(bookDetails.getTitle());
            _book.setAuthor(bookDetails.getAuthor());
            _book.setIsbn(bookDetails.getIsbn());
            _book.setPublishedYear(bookDetails.getPublishedYear());
            _book.setTotalCopies(bookDetails.getTotalCopies());
            _book.setAvailableCopies(bookDetails.getAvailableCopies());
            return ResponseEntity.ok(bookRepository.save(_book));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN')")
    public ResponseEntity<Void> deleteBook(@PathVariable("id") long id) {
        try {
            bookRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
