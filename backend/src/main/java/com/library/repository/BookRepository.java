package com.library.repository;

import com.library.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    Optional<Book> findByIsbn(String isbn);
    List<Book> findByTitleContainingIgnoreCase(String title);

    @Query("SELECT b FROM Book b WHERE " +
           "(:query IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "   OR LOWER(b.author) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:category IS NULL OR b.category = :category) AND " +
           "(:onlyAvailable = false OR b.availableCopies > 0)")
    Page<Book> findWithFilters(@Param("query") String query,
                               @Param("category") String category,
                               @Param("onlyAvailable") boolean onlyAvailable,
                               Pageable pageable);
}
