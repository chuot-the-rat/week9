import { useEffect, useMemo, useState } from "react";
import BookCard from "./BookCard";
import BookModal from "./BookModal";
import "./index.css";

function App() {
    const [books, setBooks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [publisherFilter, setPublisherFilter] = useState("All");
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("books");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) setBooks(parsed);
            } catch {}
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("books", JSON.stringify(books));
        }
    }, [books, isLoaded]);

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
            image: formData.image || "https://media1.tenor.com/m/DkActybid-oAAAAd/my-apologies-cheese.gif",
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

    return (
        <>
            <div className="app">
                <div className="header">
                    <h1>Book Shop Catalog</h1>
                </div>
                <div className="content">
                    <div className="btn-container">
                        <div className="btn-filter">
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
                        {filteredBooks.map((book) => (
                            <BookCard
                                key={book.isbn13}
                                book={book}
                                isSelected={book.selected}
                                onSelect={() => handleBookSelect(book.isbn13)}
                            />
                        ))}
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
