package com.library.service;

import com.library.entity.Book;
import com.library.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    public Page<Book> getBooks(String query, String category, Boolean available, Pageable pageable) {
        return bookRepository.findWithFilters(
                (query != null && !query.isBlank()) ? query : null,
                (category != null && !category.isBlank()) ? category : null,
                Boolean.TRUE.equals(available),
                pageable);
    }

    public Book getBookById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Book not found with id: " + id));
    }

    public Book createBook(Book book) {
        return bookRepository.save(book);
    }

    public Book updateBook(Long id, Book bookDetails) {
        Book book = getBookById(id);
        book.setTitle(bookDetails.getTitle());
        book.setAuthor(bookDetails.getAuthor());
        book.setIsbn(bookDetails.getIsbn());
        book.setPublishedYear(bookDetails.getPublishedYear());
        book.setTotalCopies(bookDetails.getTotalCopies());
        book.setAvailableCopies(bookDetails.getAvailableCopies());
        if (bookDetails.getCategory() != null) book.setCategory(bookDetails.getCategory());
        if (bookDetails.getDescription() != null) book.setDescription(bookDetails.getDescription());
        if (bookDetails.getLanguage() != null) book.setLanguage(bookDetails.getLanguage());
        return bookRepository.save(book);
    }

    public void deleteBook(Long id) {
        if (!bookRepository.existsById(id)) {
            throw new NoSuchElementException("Book not found with id: " + id);
        }
        bookRepository.deleteById(id);
    }
}
