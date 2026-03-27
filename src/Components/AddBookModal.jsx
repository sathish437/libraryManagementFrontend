import { useState, useEffect, use } from "react";
import { createPortal } from "react-dom";

function AddBookModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    totalCopies: "",
  });
  const[sub,setSub] = useState(false)
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  

  // Validation rules
  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "title":
        if (value.trim().length < 2) {
          newErrors.title = "Title must be at least 2 characters";
        } else if (value.length > 100) {
          newErrors.title = "Title cannot exceed 100 characters";
        } else {
          delete newErrors.title;
        }
        break;

      case "author":
        if (value.trim().length < 2) {
          newErrors.author = "Author name must be at least 2 characters";
        } else if (value.length > 100) {
          newErrors.author = "Author name cannot exceed 100 characters";
        } else {
          delete newErrors.author;
        }
        break;

      case "totalCopies":
        const numValue = parseInt(value);
        if (value === "") {
          newErrors.totalCopies = "Total copies is required";
        } else if (isNaN(numValue) || numValue < 1) {
          newErrors.totalCopies = "Total copies must be at least 1";
        } else {
          delete newErrors.totalCopies;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    validateField(name, value);
  };

  const isFormValid = () => {
    return (
      formData.title.trim().length >= 2 &&
      formData.title.length <= 100 &&
      formData.author.trim().length >= 2 &&
      formData.author.length <= 100 &&
      formData.totalCopies !== "" &&
      parseInt(formData.totalCopies) >= 1 &&
      Object.keys(errors).length === 0
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      title: true,
      author: true,
      totalCopies: true,
    });

    // Validate all fields
    validateField("title", formData.title);
    validateField("author", formData.author);
    validateField("totalCopies", formData.totalCopies);

    if (isFormValid()) {

    fetch("http://localhost:8080/api/book/addBook",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookTitle: formData.title,
          author: formData.author,
          totalCopies: parseInt(formData.totalCopies),
        })
      })
      .then((res) => res.json())
      .then((data) => {
        alert("Book added successfully");
      })
      .catch((error) => {
        console.error("Error adding book:", error);
      });

      // Reset form and close modal
      setFormData({ title: "", author: "", totalCopies: "" });
      setErrors({});
      setTouched({});
      setSub(true)
      onClose();
    }
  };

  const handleCancel = () => {
    setFormData({ title: "", author: "", totalCopies: "" });
    setErrors({});
    setTouched({});
    onClose();
  };
  
  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle click outside modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-full overflow-y-auto transform transition-all duration-300 scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-teal-50 to-teal-100 px-4 md:px-6 py-4 md:py-5 flex items-center justify-between border-b border-gray-200 sticky top-0">
          <h2 className="text-lg md:text-2xl font-bold text-teal-900">Add New Book</h2>
          <button
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1 hover:bg-gray-200 rounded-lg"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="px-4 md:px-6 py-4 md:py-6 space-y-4 md:space-y-5">
          {/* Title Field */}
          <div>
            <label
              htmlFor="title"
              className="block text-xs md:text-sm font-semibold text-gray-700 mb-2"
            >
              Book Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter book title"
              className={`w-full px-3 md:px-4 py-2 border-2 rounded-lg focus:outline-none transition-all text-sm md:text-base ${
                touched.title && errors.title
                  ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              }`}
            />
            {touched.title && errors.title && (
              <p className="text-red-500 text-xs md:text-sm mt-1 font-medium">
                {errors.title}
              </p>
            )}
          </div>

          {/* Author Field */}
          <div>
            <label
              htmlFor="author"
              className="block text-xs md:text-sm font-semibold text-gray-700 mb-2"
            >
              Author Name
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter author name"
              className={`w-full px-3 md:px-4 py-2 border-2 rounded-lg focus:outline-none transition-all text-sm md:text-base ${
                touched.author && errors.author
                  ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              }`}
            />
            {touched.author && errors.author && (
              <p className="text-red-500 text-xs md:text-sm mt-1 font-medium">
                {errors.author}
              </p>
            )}
          </div>

          {/* Total Copies Field */}
          <div>
            <label
              htmlFor="totalCopies"
              className="block text-xs md:text-sm font-semibold text-gray-700 mb-2"
            >
              Total Copies
            </label>
            <input
              type="number"
              id="totalCopies"
              name="totalCopies"
              value={formData.totalCopies}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter total copies"
              className={`w-full px-3 md:px-4 py-2 border-2 rounded-lg focus:outline-none transition-all text-sm md:text-base ${
                touched.totalCopies && errors.totalCopies
                  ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              }`}
            />
            {touched.totalCopies && errors.totalCopies && (
              <p className="text-red-500 text-xs md:text-sm mt-1 font-medium">
                {errors.totalCopies}
              </p>
            )}
          </div>
        </form>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-4 md:px-6 py-3 md:py-4 flex gap-2 md:gap-3 border-t border-gray-200 sticky bottom-0">
          <button
            onClick={handleCancel}
            className="flex-1 px-3 md:px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-xs md:text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid()}
            className={`flex-1 px-3 md:px-4 py-2 text-white font-semibold rounded-lg transition-colors text-xs md:text-sm ${
              isFormValid()
                ? "bg-teal-600 hover:bg-teal-700 cursor-pointer"
                : "bg-gray-400 cursor-not-allowed opacity-60"
            }`}
          >
            Add Book
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

export default AddBookModal;
