package com.library.repository;

import com.library.entity.UserCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserCardRepository extends JpaRepository<UserCard, Long> {
    Optional<UserCard> findByCardNumber(String cardNumber);
    Optional<UserCard> findByUserId(Long userId);
}
