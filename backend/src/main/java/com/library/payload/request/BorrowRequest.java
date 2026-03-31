package com.library.payload.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class BorrowRequest {
    @NotNull(message = "Book ID is required")
    private Long bookId;

    @NotNull(message = "User card ID is required")
    private Long userCardId;

    @Min(value = 1, message = "Days to borrow must be at least 1")
    private int daysToBorrow;

    public Long getBookId() {
        return bookId;
    }

    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }

    public Long getUserCardId() {
        return userCardId;
    }

    public void setUserCardId(Long userCardId) {
        this.userCardId = userCardId;
    }

    public int getDaysToBorrow() {
        return daysToBorrow;
    }

    public void setDaysToBorrow(int daysToBorrow) {
        this.daysToBorrow = daysToBorrow;
    }
}
