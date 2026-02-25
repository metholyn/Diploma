package com.library.payload.request;

public class BorrowRequest {
    private Long bookId;
    private Long userCardId;
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
