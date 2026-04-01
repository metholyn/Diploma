package com.library.config;

import com.library.entity.*;
import com.library.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private UserCardRepository userCardRepository;
    @Autowired private BookRepository bookRepository;
    @Autowired private BorrowRecordRepository borrowRecordRepository;
    @Autowired private OperationHistoryRepository operationHistoryRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // Already initialized
        }

        // ── Users ──────────────────────────────────────────────────

        User admin     = new User("admin@library.com",     passwordEncoder.encode("admin123"),     "Адмін",    "Системи",     Role.ADMIN);
        User librarian = new User("librarian@library.com", passwordEncoder.encode("librarian123"), "Марія",    "Коваленко",   Role.LIBRARIAN);
        User r1        = new User("ivan@example.com",      passwordEncoder.encode("reader123"),    "Іван",     "Петренко",    Role.READER);
        User r2        = new User("olena@example.com",     passwordEncoder.encode("reader123"),    "Олена",    "Шевченко",    Role.READER);
        User r3        = new User("dmytro@example.com",    passwordEncoder.encode("reader123"),    "Дмитро",   "Бондаренко",  Role.READER);
        User r4        = new User("sofiia@example.com",    passwordEncoder.encode("reader123"),    "Софія",    "Мельник",     Role.READER);
        User r5        = new User("andriy@example.com",    passwordEncoder.encode("reader123"),    "Андрій",   "Коваль",      Role.READER);
        User r6        = new User("natalia@example.com",   passwordEncoder.encode("reader123"),    "Наталія",  "Савченко",    Role.READER);
        User r7        = new User("bohdan@example.com",    passwordEncoder.encode("reader123"),    "Богдан",   "Литвин",      Role.READER);
        User r8        = new User("iryna@example.com",     passwordEncoder.encode("reader123"),    "Ірина",    "Романченко",  Role.READER);

        userRepository.saveAll(List.of(admin, librarian, r1, r2, r3, r4, r5, r6, r7, r8));

        // ── User Cards ─────────────────────────────────────────────

        UserCard cLib = new UserCard(librarian, "LIB-0001", LocalDate.of(2024, 1, 10));
        UserCard c1   = new UserCard(r1,        "LIB-1001", LocalDate.of(2024, 3, 15));
        UserCard c2   = new UserCard(r2,        "LIB-1002", LocalDate.of(2024, 5, 20));
        UserCard c3   = new UserCard(r3,        "LIB-1003", LocalDate.of(2025, 1,  5));
        UserCard c4   = new UserCard(r4,        "LIB-1004", LocalDate.of(2025, 2, 12));
        UserCard c5   = new UserCard(r5,        "LIB-1005", LocalDate.of(2025, 4,  3));
        UserCard c6   = new UserCard(r6,        "LIB-1006", LocalDate.of(2025, 6, 18));
        UserCard c7   = new UserCard(r7,        "LIB-1007", LocalDate.of(2025, 9, 25));
        UserCard c8   = new UserCard(r8,        "LIB-1008", LocalDate.of(2025, 11, 7));

        userCardRepository.saveAll(List.of(cLib, c1, c2, c3, c4, c5, c6, c7, c8));

        // ── Books (30 titles across genres) ───────────────────────

        List<Book> books = bookRepository.saveAll(List.of(
            // Ukrainian classics
            new Book("Кобзар",                              "Тарас Шевченко",              "978-966-01-0001-1", 1840, 6, 6),
            new Book("Тіні забутих предків",                "Михайло Коцюбинський",        "978-966-01-0002-8", 1911, 4, 4),
            new Book("Захар Беркут",                        "Іван Франко",                 "978-966-01-0003-5", 1883, 5, 5),
            new Book("Лісова пісня",                        "Леся Українка",               "978-966-01-0004-2", 1912, 4, 4),
            new Book("Місто",                               "Валер'ян Підмогильний",       "978-966-01-0005-9", 1928, 3, 3),
            new Book("Марія",                               "Уляна Кравченко",             "978-966-01-0006-6", 1903, 3, 3),
            new Book("Чорна рада",                          "Пантелеймон Куліш",           "978-966-01-0007-3", 1857, 4, 4),
            new Book("Земля",                               "Ольга Кобилянська",           "978-966-01-0008-0", 1902, 3, 3),
            // World classics
            new Book("Майстер і Маргарита",                "Михайло Булгаков",            "978-966-01-0009-7", 1967, 5, 5),
            new Book("1984",                                "Джордж Орвелл",               "978-0-452-28423-4", 1949, 5, 5),
            new Book("Дюна",                                "Френк Герберт",               "978-0-441-17271-9", 1965, 5, 5),
            new Book("Великий Гетсбі",                     "Френсіс Скотт Фіцджеральд",  "978-0-7432-7356-5", 1925, 4, 4),
            new Book("Злочин і кара",                       "Федір Достоєвський",          "978-966-01-0012-7", 1866, 4, 4),
            new Book("Сто років самотності",               "Ґабріель Ґарсія Маркес",     "978-0-06-088328-7", 1967, 4, 4),
            new Book("Процес",                              "Франц Кафка",                 "978-966-01-0014-1", 1925, 3, 3),
            new Book("Волхви",                              "Джон Фаулз",                  "978-966-01-0015-8", 1965, 3, 3),
            new Book("Гра в бісер",                         "Герман Гессе",                "978-966-01-0016-5", 1943, 3, 3),
            new Book("Коханець леді Чаттерлі",             "Девід Герберт Лоуренс",      "978-966-01-0017-2", 1928, 3, 3),
            // Modern fiction
            new Book("Гаррі Поттер і філософський камінь", "Джоан Роулінг",               "978-0-439-70818-8", 1997, 6, 6),
            new Book("Ігри розуму",                         "Сільвія Морено-Гарсія",      "978-966-01-0019-6", 2020, 3, 3),
            new Book("Де живуть раки",                     "Делія Оуенс",                "978-0-7352-1909-0", 2018, 4, 4),
            new Book("Хлопець у смугастій піжамі",         "Джон Бойн",                  "978-0-385-75106-5", 2006, 4, 4),
            new Book("Таємне життя бджіл",                 "Сью Монк Кідд",              "978-0-14-200174-5", 2002, 3, 3),
            // Science & Technology
            new Book("Чистий код",                          "Роберт Мартін",               "978-0-13-235088-4", 2008, 4, 4),
            new Book("Алгоритми: побудова та аналіз",      "Томас Кормен",               "978-0-262-03384-8", 2009, 3, 3),
            new Book("Проектування патернів",               "Банда чотирьох",             "978-0-201-63361-0", 1994, 3, 3),
            new Book("Людина, яка порахувала",              "Маліба Тahan",               "978-966-01-0027-1", 1938, 4, 4),
            new Book("Коротка історія майже всього",        "Білл Брайсон",               "978-0-7679-0817-7", 2003, 3, 3),
            // History & Society
            new Book("Sapiens: Коротка історія людства",   "Юваль Ной Харарі",           "978-0-06-231609-7", 2011, 5, 5),
            new Book("Homo Deus",                           "Юваль Ной Харарі",           "978-0-06-246431-6", 2015, 4, 4)
        ));

        // ── Borrow Records ─────────────────────────────────────────
        // Statuses: BORROWED (active), OVERDUE (past due date), RETURNED

        // r1 (Іван): 1 active + 1 overdue
        BorrowRecord br01 = new BorrowRecord(books.get(0),  c1, LocalDate.now().minusDays(8),  LocalDate.now().plusDays(6),   BorrowRecord.Status.BORROWED);
        BorrowRecord br02 = new BorrowRecord(books.get(9),  c1, LocalDate.now().minusDays(25), LocalDate.now().minusDays(4),  BorrowRecord.Status.OVERDUE);

        // r2 (Олена): 1 active + 2 returned
        BorrowRecord br03 = new BorrowRecord(books.get(28), c2, LocalDate.now().minusDays(6),  LocalDate.now().plusDays(8),   BorrowRecord.Status.BORROWED);
        BorrowRecord br04 = new BorrowRecord(books.get(1),  c2, LocalDate.now().minusDays(45), LocalDate.now().minusDays(31), BorrowRecord.Status.RETURNED);
        br04.setActualReturnDate(LocalDate.now().minusDays(33));
        BorrowRecord br05 = new BorrowRecord(books.get(11), c2, LocalDate.now().minusDays(60), LocalDate.now().minusDays(46), BorrowRecord.Status.RETURNED);
        br05.setActualReturnDate(LocalDate.now().minusDays(48));

        // r3 (Дмитро): 2 active
        BorrowRecord br06 = new BorrowRecord(books.get(23), c3, LocalDate.now().minusDays(3),  LocalDate.now().plusDays(11),  BorrowRecord.Status.BORROWED);
        BorrowRecord br07 = new BorrowRecord(books.get(24), c3, LocalDate.now().minusDays(7),  LocalDate.now().plusDays(7),   BorrowRecord.Status.BORROWED);

        // r4 (Софія): 1 active + 1 returned
        BorrowRecord br08 = new BorrowRecord(books.get(18), c4, LocalDate.now().minusDays(4),  LocalDate.now().plusDays(10),  BorrowRecord.Status.BORROWED);
        BorrowRecord br09 = new BorrowRecord(books.get(13), c4, LocalDate.now().minusDays(35), LocalDate.now().minusDays(21), BorrowRecord.Status.RETURNED);
        br09.setActualReturnDate(LocalDate.now().minusDays(22));

        // r5 (Андрій): 1 overdue + 1 returned
        BorrowRecord br10 = new BorrowRecord(books.get(10), c5, LocalDate.now().minusDays(30), LocalDate.now().minusDays(2),  BorrowRecord.Status.OVERDUE);
        BorrowRecord br11 = new BorrowRecord(books.get(25), c5, LocalDate.now().minusDays(55), LocalDate.now().minusDays(41), BorrowRecord.Status.RETURNED);
        br11.setActualReturnDate(LocalDate.now().minusDays(40));

        // r6 (Наталія): 2 active
        BorrowRecord br12 = new BorrowRecord(books.get(3),  c6, LocalDate.now().minusDays(5),  LocalDate.now().plusDays(9),   BorrowRecord.Status.BORROWED);
        BorrowRecord br13 = new BorrowRecord(books.get(29), c6, LocalDate.now().minusDays(2),  LocalDate.now().plusDays(12),  BorrowRecord.Status.BORROWED);

        // r7 (Богдан): 1 active + 1 returned
        BorrowRecord br14 = new BorrowRecord(books.get(8),  c7, LocalDate.now().minusDays(9),  LocalDate.now().plusDays(5),   BorrowRecord.Status.BORROWED);
        BorrowRecord br15 = new BorrowRecord(books.get(2),  c7, LocalDate.now().minusDays(40), LocalDate.now().minusDays(26), BorrowRecord.Status.RETURNED);
        br15.setActualReturnDate(LocalDate.now().minusDays(27));

        // r8 (Ірина): 1 returned
        BorrowRecord br16 = new BorrowRecord(books.get(20), c8, LocalDate.now().minusDays(50), LocalDate.now().minusDays(36), BorrowRecord.Status.RETURNED);
        br16.setActualReturnDate(LocalDate.now().minusDays(37));

        borrowRecordRepository.saveAll(List.of(
                br01, br02, br03, br04, br05, br06, br07, br08,
                br09, br10, br11, br12, br13, br14, br15, br16
        ));

        // ── Adjust availableCopies for currently-out books ─────────
        // BORROWED: br01(0), br02(9-overdue), br03(28), br06(23), br07(24),
        //           br08(18), br10(10-overdue), br12(3), br13(29), br14(8)
        books.get(0).setAvailableCopies(5);   // Кобзар: 6 - 1
        books.get(9).setAvailableCopies(4);   // 1984: 5 - 1 overdue
        books.get(28).setAvailableCopies(4);  // Sapiens: 5 - 1
        books.get(23).setAvailableCopies(3);  // Чистий код: 4 - 1
        books.get(24).setAvailableCopies(2);  // Алгоритми: 3 - 1
        books.get(18).setAvailableCopies(5);  // Гаррі Поттер: 6 - 1
        books.get(10).setAvailableCopies(4);  // Дюна: 5 - 1 overdue
        books.get(3).setAvailableCopies(3);   // Лісова пісня: 4 - 1
        books.get(29).setAvailableCopies(3);  // Homo Deus: 4 - 1
        books.get(8).setAvailableCopies(4);   // Майстер і Маргарита: 5 - 1
        bookRepository.saveAll(List.of(
                books.get(0), books.get(3), books.get(8), books.get(9),
                books.get(10), books.get(18), books.get(23), books.get(24),
                books.get(28), books.get(29)
        ));

        // ── Operation History ──────────────────────────────────────

        operationHistoryRepository.saveAll(List.of(
            new OperationHistory(r1, "BOOK_ISSUED",    LocalDateTime.now().minusDays(25), "Видано книгу «1984» (картка LIB-1001)"),
            new OperationHistory(r2, "BOOK_ISSUED",    LocalDateTime.now().minusDays(45), "Видано книгу «Тіні забутих предків» (картка LIB-1002)"),
            new OperationHistory(r2, "BOOK_RETURNED",  LocalDateTime.now().minusDays(33), "Повернено книгу «Тіні забутих предків» (картка LIB-1002)"),
            new OperationHistory(r2, "BOOK_ISSUED",    LocalDateTime.now().minusDays(60), "Видано книгу «Великий Гетсбі» (картка LIB-1002)"),
            new OperationHistory(r2, "BOOK_RETURNED",  LocalDateTime.now().minusDays(48), "Повернено книгу «Великий Гетсбі» (картка LIB-1002)"),
            new OperationHistory(r5, "BOOK_ISSUED",    LocalDateTime.now().minusDays(55), "Видано книгу «Проектування патернів» (картка LIB-1005)"),
            new OperationHistory(r5, "BOOK_RETURNED",  LocalDateTime.now().minusDays(40), "Повернено книгу «Проектування патернів» (картка LIB-1005)"),
            new OperationHistory(r7, "BOOK_ISSUED",    LocalDateTime.now().minusDays(40), "Видано книгу «Захар Беркут» (картка LIB-1007)"),
            new OperationHistory(r7, "BOOK_RETURNED",  LocalDateTime.now().minusDays(27), "Повернено книгу «Захар Беркут» (картка LIB-1007)"),
            new OperationHistory(r8, "BOOK_ISSUED",    LocalDateTime.now().minusDays(50), "Видано книгу «Де живуть раки» (картка LIB-1008)"),
            new OperationHistory(r8, "BOOK_RETURNED",  LocalDateTime.now().minusDays(37), "Повернено книгу «Де живуть раки» (картка LIB-1008)"),
            new OperationHistory(r4, "BOOK_ISSUED",    LocalDateTime.now().minusDays(35), "Видано книгу «Сто років самотності» (картка LIB-1004)"),
            new OperationHistory(r4, "BOOK_RETURNED",  LocalDateTime.now().minusDays(22), "Повернено книгу «Сто років самотності» (картка LIB-1004)"),
            new OperationHistory(r1, "BOOK_ISSUED",    LocalDateTime.now().minusDays(8),  "Видано книгу «Кобзар» (картка LIB-1001)"),
            new OperationHistory(r2, "BOOK_ISSUED",    LocalDateTime.now().minusDays(6),  "Видано книгу «Sapiens» (картка LIB-1002)"),
            new OperationHistory(r3, "BOOK_ISSUED",    LocalDateTime.now().minusDays(7),  "Видано книгу «Чистий код» (картка LIB-1003)"),
            new OperationHistory(r3, "BOOK_ISSUED",    LocalDateTime.now().minusDays(3),  "Видано книгу «Алгоритми» (картка LIB-1003)"),
            new OperationHistory(r4, "BOOK_ISSUED",    LocalDateTime.now().minusDays(4),  "Видано книгу «Гаррі Поттер» (картка LIB-1004)"),
            new OperationHistory(r5, "BOOK_ISSUED",    LocalDateTime.now().minusDays(30), "Видано книгу «Дюна» (картка LIB-1005)"),
            new OperationHistory(r6, "BOOK_ISSUED",    LocalDateTime.now().minusDays(5),  "Видано книгу «Лісова пісня» (картка LIB-1006)"),
            new OperationHistory(r6, "BOOK_ISSUED",    LocalDateTime.now().minusDays(2),  "Видано книгу «Homo Deus» (картка LIB-1006)"),
            new OperationHistory(r7, "BOOK_ISSUED",    LocalDateTime.now().minusDays(9),  "Видано книгу «Майстер і Маргарита» (картка LIB-1007)")
        ));

        System.out.println("==========================================================");
        System.out.println("  Database populated successfully!");
        System.out.println("  10 users | 30 books | 16 borrow records | 22 history events");
        System.out.println("---");
        System.out.println("  admin@library.com      / admin123");
        System.out.println("  librarian@library.com  / librarian123");
        System.out.println("  ivan@example.com       / reader123   (+ 7 more readers)");
        System.out.println("==========================================================");
    }
}
