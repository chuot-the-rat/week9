function BookCard({ book, isSelected, onSelect, isOnLoan }) {
    const handleCardClick = (e) => {
        if (e.target.closest("a") || e.target.closest("button")) {
            return;
        }
        onSelect();
    };

    return (
        <div
            className={`card ${isSelected ? "card-selected" : ""}`}
            onClick={handleCardClick}
        >
            {isOnLoan && <div className="loan-badge">On Loan</div>}
            <a
                href={book.url}
                target="_blank"
            >
                <div className="image">
                    <img
                        src={book.image}
                        alt={book.title}
                    />
                </div>
                <div className="title">
                    <h2>{book.title}</h2>
                </div>
                <div className="price">
                    <p>Price: {book.price}</p>
                </div>
            </a>
        </div>
    );
}

export default BookCard;
