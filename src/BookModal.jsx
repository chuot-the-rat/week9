import { useEffect, useState } from "react";

function BookModal({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    titleText = "Add New Book",
    submitText = "Add Book",
}) {
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        publisher: "",
        publicationYear: "",
        language: "",
        pages: "",
        image: "",
    });

    // when modal opens, prefill for edit or reset for add
    useEffect(() => {
        if (!isOpen) return;
        setFormData(
            initialData
                ? {
                      title: initialData.title || "",
                      author: initialData.author || "",
                      publisher: initialData.publisher || "",
                      publicationYear: initialData.publicationYear || "",
                      language: initialData.language || "",
                      pages: initialData.pages || "",
                      image: initialData.image || "",
                  }
                : {
                      title: "",
                      author: "",
                      publisher: "",
                      publicationYear: "",
                      language: "",
                      pages: "",
                      image: "",
                  }
        );
    }, [isOpen, initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="modal-backdrop"
            onClick={handleBackdropClick}
        >
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{titleText}</h2>
                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Title *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="author">Author *</label>
                        <input
                            type="text"
                            id="author"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="publisher">Publisher *</label>
                        <input
                            type="text"
                            id="publisher"
                            name="publisher"
                            value={formData.publisher}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="publicationYear">
                            Publication Year *
                        </label>
                        <input
                            type="number"
                            id="publicationYear"
                            name="publicationYear"
                            value={formData.publicationYear}
                            onChange={handleChange}
                            min="1000"
                            max="2025"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="language">Language *</label>
                        <input
                            type="text"
                            id="language"
                            name="language"
                            value={formData.language}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="pages">Pages *</label>
                        <input
                            type="number"
                            id="pages"
                            name="pages"
                            value={formData.pages}
                            onChange={handleChange}
                            min="1"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="image">Image URL</label>
                        <input
                            type="url"
                            id="image"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>
                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-cancel"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-submit"
                        >
                            {submitText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default BookModal;
