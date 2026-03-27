import { useState, useEffect } from "react";
import AddBookModal from "./AddBookModal";

function Books() {
  const [books, setBooks] = useState([]);
  let [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    fetch("http://localhost:8080/api/book/getAllBooks")
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
      });
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      fetch("http://localhost:8080/api/book/getAllBooks")
        .then((res) => res.json())
        .then((data) => {
          setBooks(data);
        });
    } else {
      fetch(
        `http://localhost:8080/api/book/searchBooks?bookTitle=${searchTerm.toLowerCase()}`,
      )
        .then((res) => res.json())
        .then((data) => {
          setBooks(data);
        });
    }
  }, [searchTerm]);

  const handleDelete = (id) => {
    fetch(`http://localhost:8080/api/book/Delete/${id}`, {
      method: "DELETE",
    })
    .then(async (res) => {
      let data = null;

      if (res.status !== 204) {
        try {
          data = await res.json();
        } catch {}
      }

      if (!res.ok) {
        alert(data?.message);
        return;
      }
      alert("Book deleted successfully");
    })
    .catch((error) => {
      alert("Server error");
    });
  };

  const handleDeleteAll = () => {
    fetch("http://localhost:8080/api/book/DeleteAll", {
      method: "DELETE",
    })
    .then(async (res) => {
      let data = null;

      if (res.status !== 204) {
        try {
          data = await res.json();
        } catch {}
      }

      if (!res.ok) {
        alert(data?.message );
        return;
      }
      alert("All books deleted successfully");
    })
    .catch((error) => {
      alert("Server error");
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header Section - Responsive Stack */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
            📚 Books List
          </h1>
          <p className="text-sm md:text-base text-gray-600">Manage your library's book collection</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors shadow-sm font-semibold text-sm md:text-base"
        >
          + Add Book
        </button>
      </div>

      {/* Search Bar - Responsive Width */}
      <div className="mb-6">
        <input
          type="search"
          placeholder="Search by title or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border-2 border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 text-sm md:text-base"
        />
      </div>

      {/* Table/Card Section */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {books.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-teal-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="text-left px-4 md:px-6 py-3 font-semibold text-gray-700 text-sm">
                      Title
                    </th>
                    <th className="text-left px-4 md:px-6 py-3 font-semibold text-gray-700 text-sm">
                      Author
                    </th>
                    <th className="text-left px-4 md:px-6 py-3 font-semibold text-gray-700 text-sm">
                      Total Copies
                    </th>
                    <th className="text-left px-4 md:px-6 py-3 font-semibold text-gray-700 text-sm">
                      Available
                    </th>
                    <th className="text-left px-4 md:px-6 py-3 font-semibold text-gray-700 text-sm">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {books.map((book) => (
                    <tr
                      key={book.bookId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 md:px-6 py-4 text-gray-800 font-medium text-sm">
                        {book.bookTitle}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-gray-700 text-sm">{book.author}</td>
                      <td className="px-4 md:px-6 py-4 text-gray-700 text-sm">
                        {book.totalCopies}
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            book.availableBooks > 0
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {book.availableBooks}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <button
                          onClick={() => handleDelete(book.bookId)}
                          className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors text-xs font-semibold whitespace-nowrap"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-200">
              {books.map((book) => (
                <div
                  key={book.bookId}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="space-y-3">
                    {/* Title */}
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase">Title</p>
                      <p className="text-sm font-medium text-gray-800">{book.bookTitle}</p>
                    </div>

                    {/* Author */}
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase">Author</p>
                      <p className="text-sm text-gray-700">{book.author}</p>
                    </div>

                    {/* Copies - Side by Side */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase">Total Copies</p>
                        <p className="text-sm font-medium text-gray-800">{book.totalCopies}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase">Available</p>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                            book.availableBooks > 0
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {book.availableBooks}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleDelete(book.bookId)}
                      className="w-full bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-semibold mt-2"
                    >
                      Delete Book
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="p-6 md:p-8 text-center">
            <p className="text-gray-600 text-base md:text-lg">
              {searchTerm
                ? "📌 No books found matching your search"
                : "📭 No books available"}
            </p>
          </div>
        )}
      </div>

      {/* Delete All Button */}
      {books.length > 0 && (
        <div className="mt-4">
          <button
            onClick={handleDeleteAll}
            className="w-full md:w-auto bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-semibold text-sm md:text-base"
          >
            Delete All Books
          </button>
        </div>
      )}

      {/* Add Book Modal */}
      <AddBookModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default Books;
