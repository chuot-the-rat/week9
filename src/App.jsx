import { useEffect, useMemo, useState } from "react";
import BookCard from "./BookCard";
import BookModal from "./BookModal";
import "./index.css";

function App() {
    const [books, setBooks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [showLoans, setShowLoans] = useState(false);
    const [loans, setLoans] = useState([]);
    const [publisherFilter, setPublisherFilter] = useState("All");

    useEffect(() => {
        // load saved books and loans once on mount
        try {
            const saved = localStorage.getItem("books");
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) setBooks(parsed);
            }
        } catch (err) {
            void err;
        }

        try {
            const savedLoans = localStorage.getItem("loans");
            if (savedLoans) {
                const parsed = JSON.parse(savedLoans);
                if (Array.isArray(parsed)) setLoans(parsed);
            }
        } catch (err) {
            void err;
        }
    }, []);

    // persist books and loans whenever they change
    useEffect(() => {
        try {
            localStorage.setItem("books", JSON.stringify(books));
        } catch (err) {
            void err;
        }
    }, [books]);

    useEffect(() => {
        try {
            localStorage.setItem("loans", JSON.stringify(loans));
        } catch (err) {
            void err;
        }
    }, [loans]);

    const handleBookSelect = (isbn13) => {
        setBooks(
            books.map((book) => ({
                ...book,
                selected: book.isbn13 === isbn13 ? !book.selected : false,
            }))
        );
    };

    const handleBookSubmit = (formData) => {
        const newBook = {
            ...formData,
            isbn13: Date.now().toString(),
            price: "$0.00",
            image:
                formData.image ||
                "https://media1.tenor.com/m/DkActybid-oAAAAd/my-apologies-cheese.gif",
            url: "#",
            selected: false,
        };
        setBooks([...books, newBook]);
    };

    const handleDeleteBook = () => {
        setBooks(books.filter((book) => !book.selected));
    };

    const handleEditBook = () => {
        const selected = books.find((b) => b.selected);
        if (!selected) return; // do nothing if none selected
        setEditingBook(selected);
        setShowModal(true);
    };

    const handleBookUpdate = (formData) => {
        if (!editingBook) return;
        setBooks(
            books.map((b) =>
                b.isbn13 === editingBook.isbn13
                    ? { ...b, ...formData, selected: false }
                    : b
            )
        );
        setEditingBook(null);
    };

    const publishers = useMemo(() => {
        const set = new Set(books.map((b) => b.publisher).filter(Boolean));
        return ["All", ...Array.from(set).sort()];
    }, [books]);

    const filteredBooks = useMemo(() => {
        if (publisherFilter === "All") return books;
        return books.filter((b) => b.publisher === publisherFilter);
    }, [books, publisherFilter]);

    // helper lists
    const availableBooks = filteredBooks.filter(
        (b) => !loans.some((l) => l.isbn13 === b.isbn13)
    );

    // loan form state
    const [borrower, setBorrower] = useState("");
    const [selectedIsbn, setSelectedIsbn] = useState("");
    const [weeks, setWeeks] = useState(1);

    // pick a sensible default when availableBooks changes
    useEffect(() => {
        if (availableBooks.length === 0) {
            setSelectedIsbn("");
        } else if (!availableBooks.some((b) => b.isbn13 === selectedIsbn)) {
            setSelectedIsbn(availableBooks[0].isbn13);
        }
    }, [availableBooks, selectedIsbn]);

    const handleLoanSubmit = (e) => {
        e.preventDefault();
        if (!borrower || !selectedIsbn) return;
        const now = new Date();
        const due = new Date(now);
        due.setDate(due.getDate() + weeks * 7);
        const loan = {
            isbn13: selectedIsbn,
            borrower: borrower.trim(),
            weeks: Number(weeks),
            dueDate: due.toISOString(),
            loanedAt: now.toISOString(),
        };
        setLoans((prev) => [...prev, loan]);
        // reset form
        setBorrower("");
        setWeeks(1);
    };

    const formatDate = (iso) => {
        try {
            return new Date(iso).toLocaleDateString();
        } catch {
            return iso;
        }
    };

    return (
        <>
            <div className="app">
                <div className="header">
                    <h1>Book Shop Catalog</h1>
                </div>
                <div className="content">
                    <div className="btn-container">
                        <div className="btn-filter">
                            <div className="filter-row">
                                <select
                                    value={publisherFilter}
                                    onChange={(e) =>
                                        setPublisherFilter(e.target.value)
                                    }
                                >
                                    {publishers.map((p) => (
                                        <option
                                            key={p}
                                            value={p}
                                            className="option"
                                        >
                                            {p}
                                        </option>
                                    ))}
                                </select>
                                <div className="toggle-loans">
                                    <button
                                        onClick={() => setShowLoans((s) => !s)}
                                        type="button"
                                    >
                                        {showLoans
                                            ? "Show Books"
                                            : "Manage Loans"}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="btn">
                            <button
                                onClick={() => {
                                    setEditingBook(null);
                                    setShowModal(true);
                                }}
                            >
                                Add Book
                            </button>
                        </div>
                        <div className="btn-actions">
                            <div className="btn-edit">
                                <button
                                    onClick={handleEditBook}
                                    disabled={!books.some((b) => b.selected)}
                                >
                                    Edit Book
                                </button>
                            </div>
                            <div className="btn-delete">
                                <button onClick={handleDeleteBook}>
                                    Delete Book
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="content-books">
                        {showLoans ? (
                            <div className="loan-view">
                                <div className="loan-header">
                                    <button
                                        type="button"
                                        onClick={() => setShowLoans(false)}
                                    >
                                        ← Back to Books
                                    </button>
                                </div>

                                <div className="loan-form">
                                    {availableBooks.length === 0 ? (
                                        <p>All books are currently on loan.</p>
                                    ) : (
                                        <form onSubmit={handleLoanSubmit}>
                                            <div className="form-group">
                                                <label>Borrower *</label>
                                                <input
                                                    type="text"
                                                    value={borrower}
                                                    onChange={(e) =>
                                                        setBorrower(
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Book *</label>
                                                <select
                                                    value={selectedIsbn}
                                                    onChange={(e) =>
                                                        setSelectedIsbn(
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                >
                                                    {availableBooks.map((b) => (
                                                        <option
                                                            key={b.isbn13}
                                                            value={b.isbn13}
                                                        >
                                                            {b.title}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>
                                                    Loan Period (weeks) *
                                                </label>
                                                <input
                                                    type="number"
                                                    min={1}
                                                    max={4}
                                                    value={weeks}
                                                    onChange={(e) =>
                                                        setWeeks(
                                                            Number(
                                                                e.target.value
                                                            )
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div className="form-actions">
                                                <button
                                                    type="submit"
                                                    className="btn-submit"
                                                >
                                                    Create Loan
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>

                                <div className="loaned-list">
                                    <h3>Loaned Books</h3>
                                    {loans.length === 0 ? (
                                        <p>No loans yet.</p>
                                    ) : (
                                        <ul>
                                            {loans.map((l) => {
                                                const book = books.find(
                                                    (b) => b.isbn13 === l.isbn13
                                                );
                                                return (
                                                    <li
                                                        key={
                                                            l.isbn13 +
                                                            l.loanedAt
                                                        }
                                                    >
                                                        <strong>
                                                            {l.borrower}
                                                        </strong>{" "}
                                                        —{" "}
                                                        {book
                                                            ? book.title
                                                            : l.isbn13}{" "}
                                                        — due{" "}
                                                        {formatDate(l.dueDate)}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        ) : (
                            filteredBooks.map((book) => (
                                <BookCard
                                    key={book.isbn13}
                                    book={book}
                                    isSelected={book.selected}
                                    isOnLoan={loans.some(
                                        (l) => l.isbn13 === book.isbn13
                                    )}
                                    onSelect={() =>
                                        handleBookSelect(book.isbn13)
                                    }
                                />
                            ))
                        )}
                    </div>
                </div>

                <BookModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onSubmit={editingBook ? handleBookUpdate : handleBookSubmit}
                    initialData={editingBook || undefined}
                    titleText={editingBook ? "Edit Book" : "Add New Book"}
                    submitText={editingBook ? "Save Changes" : "Add Book"}
                />

                <div className="footer">
                    <div>Leana Le © 2025 Book Shop</div>
                </div>
            </div>
        </>
    );
}

export default App;
