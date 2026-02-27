package com.library.config;

import com.library.entity.*;
import com.library.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private UserCardRepository userCardRepository;
    @Autowired private BookRepository bookRepository;
    @Autowired private BorrowRecordRepository borrowRecordRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // Already initialized
        }

        // ── Users ──────────────────────────────────────────────────

        User admin = new User("admin@library.com",
                passwordEncoder.encode("admin123"),
                "Адмін", "Системи", Role.ADMIN);

        User librarian = new User("librarian@library.com",
                passwordEncoder.encode("librarian123"),
                "Марія", "Коваленко", Role.LIBRARIAN);

        User reader1 = new User("ivan@example.com",
                passwordEncoder.encode("reader123"),
                "Іван", "Петренко", Role.READER);

        User reader2 = new User("olena@example.com",
                passwordEncoder.encode("reader123"),
                "Олена", "Шевченко", Role.READER);

        User reader3 = new User("dmytro@example.com",
                passwordEncoder.encode("reader123"),
                "Дмитро", "Бондаренко", Role.READER);

        userRepository.saveAll(List.of(admin, librarian, reader1, reader2, reader3));

        // ── User Cards ─────────────────────────────────────────────

        UserCard cardLibrarian = new UserCard(librarian, "LIB-0001", LocalDate.of(2024, 1, 10));
        UserCard cardReader1   = new UserCard(reader1,   "LIB-1001", LocalDate.of(2024, 3, 15));
        UserCard cardReader2   = new UserCard(reader2,   "LIB-1002", LocalDate.of(2024, 5, 20));
        UserCard cardReader3   = new UserCard(reader3,   "LIB-1003", LocalDate.of(2025, 1,  5));

        userCardRepository.saveAll(List.of(cardLibrarian, cardReader1, cardReader2, cardReader3));

        // ── Books ──────────────────────────────────────────────────

        List<Book> books = bookRepository.saveAll(List.of(
                new Book("Кобзар",                           "Тарас Шевченко",            "978-966-01-0001-1", 1840, 5, 5),
                new Book("Тіні забутих предків",             "Михайло Коцюбинський",      "978-966-01-0002-8", 1911, 3, 3),
                new Book("Місто",                            "Валер'ян Підмогильний",     "978-966-01-0003-5", 1928, 4, 4),
                new Book("Захар Беркут",                     "Іван Франко",               "978-966-01-0004-2", 1883, 6, 5),
                new Book("Лісова пісня",                     "Леся Українка",             "978-966-01-0005-9", 1912, 4, 4),
                new Book("Майстер і Маргарита",              "Михайло Булгаков",          "978-966-01-0006-6", 1967, 5, 4),
                new Book("1984",                             "Джордж Орвелл",             "978-0-452-28423-4", 1949, 4, 3),
                new Book("Волхви",                           "Джон Фаулз",                "978-966-01-0008-0", 1965, 3, 3),
                new Book("Дюна",                             "Френк Герберт",             "978-0-441-17271-9", 1965, 5, 5),
                new Book("Чистий код",                       "Роберт Мартін",             "978-0-13-235088-4", 2008, 3, 2),
                new Book("Алгоритми: побудова та аналіз",   "Томас Кормен",              "978-0-262-03384-8", 2009, 2, 2),
                new Book("Великий Гетсбі",                   "Френсіс Скотт Фіцджеральд", "978-0-7432-7356-5", 1925, 4, 4)
        ));

        // ── Borrow Records ─────────────────────────────────────────

        // reader1 has 2 active borrows
        BorrowRecord b1 = new BorrowRecord(books.get(0), cardReader1,
                LocalDate.now().minusDays(10), LocalDate.now().plusDays(4),
                BorrowRecord.Status.BORROWED);

        BorrowRecord b2 = new BorrowRecord(books.get(6), cardReader1,
                LocalDate.now().minusDays(20), LocalDate.now().minusDays(6),
                BorrowRecord.Status.OVERDUE);

        // reader2 has 1 returned borrow
        BorrowRecord b3 = new BorrowRecord(books.get(1), cardReader2,
                LocalDate.now().minusDays(30), LocalDate.now().minusDays(16),
                BorrowRecord.Status.RETURNED);
        b3.setActualReturnDate(LocalDate.now().minusDays(18));

        // reader2 has 1 active borrow
        BorrowRecord b4 = new BorrowRecord(books.get(5), cardReader2,
                LocalDate.now().minusDays(5), LocalDate.now().plusDays(9),
                BorrowRecord.Status.BORROWED);

        // reader3 has 1 active borrow
        BorrowRecord b5 = new BorrowRecord(books.get(9), cardReader3,
                LocalDate.now().minusDays(3), LocalDate.now().plusDays(11),
                BorrowRecord.Status.BORROWED);

        borrowRecordRepository.saveAll(List.of(b1, b2, b3, b4, b5));

        // adjust availableCopies for borrowed books
        books.get(0).setAvailableCopies(4);   // Кобзар – 1 borrowed
        books.get(5).setAvailableCopies(3);   // Майстер і Маргарита – 1 borrowed + already 4
        books.get(6).setAvailableCopies(2);   // 1984 – 1 overdue still out → was 3, now 2
        books.get(9).setAvailableCopies(1);   // Чистий код – 1 borrowed
        bookRepository.saveAll(List.of(books.get(0), books.get(5), books.get(6), books.get(9)));

        System.out.println("=================================================");
        System.out.println("  Test data initialized successfully!");
        System.out.println("  admin@library.com      / admin123     (ADMIN)");
        System.out.println("  librarian@library.com  / librarian123 (LIBRARIAN)");
        System.out.println("  ivan@example.com       / reader123    (READER)");
        System.out.println("  olena@example.com      / reader123    (READER)");
        System.out.println("  dmytro@example.com     / reader123    (READER)");
        System.out.println("=================================================");
    }
}
