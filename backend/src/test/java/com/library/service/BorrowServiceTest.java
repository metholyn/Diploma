package com.library.service;

import com.library.entity.*;
import com.library.payload.request.BorrowRequest;
import com.library.repository.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BorrowServiceTest {

    @Mock private BorrowRecordRepository borrowRecordRepository;
    @Mock private BookRepository bookRepository;
    @Mock private UserCardRepository userCardRepository;
    @Mock private OperationHistoryRepository operationHistoryRepository;
    @Mock private UserRepository userRepository;

    @InjectMocks
    private BorrowService borrowService;

    private BorrowRequest makeBorrowRequest(Long bookId, Long cardId, int days) {
        BorrowRequest req = new BorrowRequest();
        req.setBookId(bookId);
        req.setUserCardId(cardId);
        req.setDaysToBorrow(days);
        return req;
    }

    @Test
    void issueBook_bookNotFound_throwsException() {
        when(bookRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class,
                () -> borrowService.issueBook(makeBorrowRequest(99L, 1L, 14), "admin@library.com"));
    }

    @Test
    void issueBook_cardNotFound_throwsException() {
        Book book = new Book("Test", "Author", "978-0-1", 2020, 3, 3);
        when(bookRepository.findById(1L)).thenReturn(Optional.of(book));
        when(userCardRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class,
                () -> borrowService.issueBook(makeBorrowRequest(1L, 99L, 14), "admin@library.com"));
    }

    @Test
    void issueBook_noAvailableCopies_throwsException() {
        Book book = new Book("Test", "Author", "978-0-2", 2020, 3, 0);
        UserCard card = new UserCard(new User(), "LIB-001", LocalDate.now());
        when(bookRepository.findById(1L)).thenReturn(Optional.of(book));
        when(userCardRepository.findById(1L)).thenReturn(Optional.of(card));

        assertThrows(IllegalArgumentException.class,
                () -> borrowService.issueBook(makeBorrowRequest(1L, 1L, 14), "admin@library.com"));
    }

    @Test
    void issueBook_valid_decreasesAvailableCopiesAndSaves() {
        Book book = new Book("Test", "Author", "978-0-3", 2020, 3, 3);
        UserCard card = new UserCard(new User(), "LIB-001", LocalDate.now());
        BorrowRecord saved = new BorrowRecord(book, card, LocalDate.now(),
                LocalDate.now().plusDays(14), BorrowRecord.Status.BORROWED);

        when(bookRepository.findById(1L)).thenReturn(Optional.of(book));
        when(userCardRepository.findById(1L)).thenReturn(Optional.of(card));
        when(borrowRecordRepository.save(any())).thenReturn(saved);
        when(userRepository.findByEmail("admin@library.com")).thenReturn(Optional.empty());

        BorrowRecord result = borrowService.issueBook(makeBorrowRequest(1L, 1L, 14), "admin@library.com");

        assertEquals(2, book.getAvailableCopies());
        assertEquals(BorrowRecord.Status.BORROWED, result.getStatus());
        verify(bookRepository).save(book);
        verify(borrowRecordRepository).save(any(BorrowRecord.class));
    }

    @Test
    void returnBook_alreadyReturned_throwsException() {
        Book book = new Book("Test", "Author", "978-0-4", 2020, 3, 2);
        UserCard card = new UserCard(new User(), "LIB-001", LocalDate.now());
        BorrowRecord record = new BorrowRecord(book, card, LocalDate.now().minusDays(7),
                LocalDate.now(), BorrowRecord.Status.RETURNED);

        when(borrowRecordRepository.findById(1L)).thenReturn(Optional.of(record));

        assertThrows(IllegalArgumentException.class,
                () -> borrowService.returnBook(1L, "admin@library.com"));
    }

    @Test
    void returnBook_valid_increasesAvailableCopiesAndMarksReturned() {
        Book book = new Book("Test", "Author", "978-0-5", 2020, 3, 2);
        UserCard card = new UserCard(new User(), "LIB-001", LocalDate.now());
        BorrowRecord record = new BorrowRecord(book, card, LocalDate.now().minusDays(7),
                LocalDate.now(), BorrowRecord.Status.BORROWED);

        when(borrowRecordRepository.findById(1L)).thenReturn(Optional.of(record));
        when(bookRepository.save(any())).thenReturn(book);
        when(borrowRecordRepository.save(any())).thenReturn(record);
        when(userRepository.findByEmail("admin@library.com")).thenReturn(Optional.empty());

        BorrowRecord result = borrowService.returnBook(1L, "admin@library.com");

        assertEquals(3, book.getAvailableCopies());
        assertEquals(BorrowRecord.Status.RETURNED, result.getStatus());
        assertNotNull(result.getActualReturnDate());
    }

    @Test
    void getActiveBorrows_returnsOnlyBorrowedRecords() {
        List<BorrowRecord> records = List.of(
                new BorrowRecord(new Book(), new UserCard(), LocalDate.now(),
                        LocalDate.now().plusDays(14), BorrowRecord.Status.BORROWED));
        when(borrowRecordRepository.findByStatus(BorrowRecord.Status.BORROWED)).thenReturn(records);

        List<BorrowRecord> result = borrowService.getActiveBorrows();

        assertEquals(1, result.size());
        verify(borrowRecordRepository).findByStatus(BorrowRecord.Status.BORROWED);
    }
}
