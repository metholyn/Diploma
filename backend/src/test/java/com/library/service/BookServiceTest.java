package com.library.service;

import com.library.entity.Book;
import com.library.repository.BookRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookServiceTest {

    @Mock
    private BookRepository bookRepository;

    @InjectMocks
    private BookService bookService;

    @Test
    void getBookById_existingId_returnsBook() {
        Book book = new Book("Test Book", "Test Author", "978-0-0001", 2024, 5, 5);
        when(bookRepository.findById(1L)).thenReturn(Optional.of(book));

        Book result = bookService.getBookById(1L);

        assertEquals("Test Book", result.getTitle());
        assertEquals("Test Author", result.getAuthor());
    }

    @Test
    void getBookById_nonExistingId_throwsException() {
        when(bookRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> bookService.getBookById(99L));
    }

    @Test
    void createBook_savesAndReturnsBook() {
        Book book = new Book("New Book", "Author", "978-0-0002", 2024, 3, 3);
        when(bookRepository.save(any(Book.class))).thenReturn(book);

        Book result = bookService.createBook(book);

        assertEquals("New Book", result.getTitle());
        verify(bookRepository, times(1)).save(book);
    }

    @Test
    void deleteBook_existingId_deletesBook() {
        when(bookRepository.existsById(1L)).thenReturn(true);

        bookService.deleteBook(1L);

        verify(bookRepository, times(1)).deleteById(1L);
    }

    @Test
    void deleteBook_nonExistingId_throwsException() {
        when(bookRepository.existsById(99L)).thenReturn(false);

        assertThrows(NoSuchElementException.class, () -> bookService.deleteBook(99L));
        verify(bookRepository, never()).deleteById(any());
    }

    @Test
    void getBooks_noFilters_returnsPaginatedBooks() {
        Pageable pageable = PageRequest.of(0, 12);
        Page<Book> expected = new PageImpl<>(
                List.of(new Book("Book1", "Author1", "978-1", 2020, 2, 2)));
        when(bookRepository.findWithFilters(null, null, false, pageable)).thenReturn(expected);

        Page<Book> result = bookService.getBooks(null, null, null, pageable);

        assertEquals(1, result.getTotalElements());
    }

    @Test
    void getBooks_withQuery_passesQueryToRepo() {
        Pageable pageable = PageRequest.of(0, 12);
        Page<Book> expected = new PageImpl<>(List.of());
        when(bookRepository.findWithFilters("шевченко", null, false, pageable)).thenReturn(expected);

        bookService.getBooks("шевченко", null, null, pageable);

        verify(bookRepository).findWithFilters("шевченко", null, false, pageable);
    }

    @Test
    void getBooks_withAvailableTrue_passesOnlyAvailableTrue() {
        Pageable pageable = PageRequest.of(0, 12);
        Page<Book> expected = new PageImpl<>(List.of());
        when(bookRepository.findWithFilters(null, null, true, pageable)).thenReturn(expected);

        bookService.getBooks(null, null, true, pageable);

        verify(bookRepository).findWithFilters(null, null, true, pageable);
    }

    @Test
    void updateBook_existingId_updatesFields() {
        Book existing = new Book("Old Title", "Old Author", "978-0-0003", 2020, 2, 2);
        Book updates = new Book("New Title", "New Author", "978-0-0003", 2021, 3, 3);
        when(bookRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(bookRepository.save(any(Book.class))).thenAnswer(inv -> inv.getArgument(0));

        Book result = bookService.updateBook(1L, updates);

        assertEquals("New Title", result.getTitle());
        assertEquals("New Author", result.getAuthor());
        assertEquals(2021, result.getPublishedYear());
    }
}
