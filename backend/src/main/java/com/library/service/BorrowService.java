package com.library.service;

import com.library.entity.Book;
import com.library.entity.BorrowRecord;
import com.library.entity.OperationHistory;
import com.library.entity.UserCard;
import com.library.payload.request.BorrowRequest;
import com.library.repository.BookRepository;
import com.library.repository.BorrowRecordRepository;
import com.library.repository.OperationHistoryRepository;
import com.library.repository.UserCardRepository;
import com.library.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class BorrowService {

    @Autowired
    private BorrowRecordRepository borrowRecordRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserCardRepository userCardRepository;

    @Autowired
    private OperationHistoryRepository operationHistoryRepository;

    @Autowired
    private UserRepository userRepository;

    public BorrowRecord issueBook(BorrowRequest request, String performerEmail) {
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new NoSuchElementException("Book not found"));
        UserCard card = userCardRepository.findById(request.getUserCardId())
                .orElseThrow(() -> new NoSuchElementException("User card not found"));

        if (book.getAvailableCopies() <= 0) {
            throw new IllegalArgumentException("No available copies for this book");
        }

        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        int days = request.getDaysToBorrow() > 0 ? request.getDaysToBorrow() : 14;
        BorrowRecord record = new BorrowRecord(book, card, LocalDate.now(),
                LocalDate.now().plusDays(days), BorrowRecord.Status.BORROWED);
        borrowRecordRepository.save(record);

        userRepository.findByEmail(performerEmail).ifPresent(performer -> {
            OperationHistory history = new OperationHistory(
                    performer, "BOOK_ISSUED", LocalDateTime.now(),
                    "Book '" + book.getTitle() + "' issued to card " + card.getCardNumber());
            operationHistoryRepository.save(history);
        });

        return record;
    }

    public BorrowRecord returnBook(Long recordId, String performerEmail) {
        BorrowRecord record = borrowRecordRepository.findById(recordId)
                .orElseThrow(() -> new NoSuchElementException("Borrow record not found"));

        if (record.getStatus() == BorrowRecord.Status.RETURNED) {
            throw new IllegalArgumentException("Book is already returned");
        }

        record.setStatus(BorrowRecord.Status.RETURNED);
        record.setActualReturnDate(LocalDate.now());

        Book book = record.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);
        borrowRecordRepository.save(record);

        userRepository.findByEmail(performerEmail).ifPresent(performer -> {
            OperationHistory history = new OperationHistory(
                    performer, "BOOK_RETURNED", LocalDateTime.now(),
                    "Book '" + book.getTitle() + "' returned from card "
                            + record.getUserCard().getCardNumber());
            operationHistoryRepository.save(history);
        });

        return record;
    }

    public List<BorrowRecord> getActiveBorrows() {
        return borrowRecordRepository.findByStatus(BorrowRecord.Status.BORROWED);
    }

    public List<BorrowRecord> getBorrowsByCard(Long userCardId) {
        return borrowRecordRepository.findByUserCardId(userCardId);
    }
}
