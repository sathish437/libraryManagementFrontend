import { useEffect, useState } from 'react';

function ReturnBooks() {
  const [searchStudent, setSearchStudent] = useState("");
  const [formData, setFormData] = useState({
    issueId: '',
    bookTitle: '',
    returnDate: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [returnedBooks, setReturnedBooks] = useState([]);
  const [allReturnedBooks, setAllReturnedBooks] = useState([]);

  // Delete a single returned book
  const handleDelete = (returnId) => {
    if (!window.confirm('Are you sure you want to delete this return?')) return;
    fetch(`http://localhost:8080/api/returnBook/delete/${returnId}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Delete failed');
        // Remove from UI
        setReturnedBooks((prev) => prev.filter((b) => b.returnId !== returnId));
        setAllReturnedBooks((prev) => prev.filter((b) => b.returnId !== returnId));
      })
      .catch(() => alert('Server error while deleting return'));
  };

  // Delete all returned books
  const handleDeleteAll = () => {
    if (!window.confirm('Are you sure you want to delete ALL returns?')) return;
    fetch('http://localhost:8080/api/returnBook/deleteAll', {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Delete all failed');
        setReturnedBooks([]);
        setAllReturnedBooks([]);
      })
      .catch(() => alert('Server error while deleting all returns'));
  };
  const [bookTitles, setBookTitles] = useState([]);
  
  useEffect(()=> {
    fetch("http://localhost:8080/api/book/getAllBooks")
      .then((res) => res.json())
      .then((data) => {
        setBookTitles(data);
      })
      .catch(() => {
        alert("Server error while fetching books");
      })

    fetch("http://localhost:8080/api/returnBook/AllReturnedBooks")
      .then((res) => res.json())
      .then((data) => {
        setAllReturnedBooks(data);
        setReturnedBooks(data);
        // Filter returned books by student name
        
      })
      .catch(() => {
        alert("Server error while fetching returned books");
      })  
    }, []);
    useEffect(() => {
          if (!searchStudent) {
            setReturnedBooks(allReturnedBooks);
          } else {
            fetch(`http://localhost:8080/api/returnBook/Search?name=${searchStudent.toLocaleLowerCase()}`)
              .then((res) => res.json())
              .then((data) => {
                setReturnedBooks(data);
                console.log(returnedBooks)
              })
              .catch(() => {
                alert("Server error while searching returned books");
              });
          }
    }, [searchStudent]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.issueId.trim()) {
      newErrors.issueId = 'Issue ID is required';
    } else if (!/^\d+$/.test(formData.issueId.trim())) {
      newErrors.issueId = 'Issue ID must be a number';
    }

    if (!formData.bookTitle.trim()) {
      newErrors.bookTitle = 'Book title is required';
    }

    if (!formData.returnDate) {
      newErrors.returnDate = 'Return date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const calculateFine = () => {
    // Simple fine calculation: $0.50 per day overdue
    // For demo, we'll return a random fine amount
    return Math.floor(Math.random() * 500) / 100;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      const newReturnedBook = {
        issueId: formData.issueId,
        bookTitle: formData.bookTitle,
        returnDate: formData.returnDate
      };

      fetch("http://localhost:8080/api/returnBook/userReturnBook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },    
        body: JSON.stringify(newReturnedBook)
      })
      .then((res) => res.json())
      .then((data) => {
        setReturnedBooks(data)
        setAllReturnedBooks(data)
      })
      .catch(() => {
        alert("Server error while returning book");
      })
    

      // Reset form
      setFormData({
        issueId: '',
        bookTitle: '',
        returnDate: new Date().toISOString().split('T')[0],
      });

      // Auto-dismiss after 5 seconds
     
    }, 1000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">🔁 Return Book</h1>
        <p className="text-sm md:text-base text-gray-600">Process book returns and calculate fines</p>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-8 mb-6 md:mb-8">
        

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          {/* Issue ID Field */}
          <div>
            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
              Issue ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="issueId"
              value={formData.issueId}
              onChange={handleChange}
              placeholder="Enter Issue ID"
              className={`w-full px-4 py-2 md:py-3 border-2 rounded-lg focus:outline-none transition-all text-sm md:text-base ${
                errors.issueId
                  ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                  : 'border-gray-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100'
              }`}
            />
            {errors.issueId && (
              <p className="text-red-500 text-xs md:text-sm mt-1">❌ {errors.issueId}</p>
            )}
          </div>

          {/* Book Title Field */}
          <div>
            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
              Book Title <span className="text-red-500">*</span>
            </label>
            <select
              name="bookTitle"
              value={formData.bookTitle}
              onChange={handleChange}
              className={`w-full px-4 py-2 md:py-3 border-2 rounded-lg focus:outline-none transition-all text-sm md:text-base ${
                errors.bookTitle
                  ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                  : 'border-gray-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100'
              }`}
            >
              <option value="">-- Select a Book --</option>
              {bookTitles.map((title) => (
                <option key={title.bookId} value={title.bookTitle}>
                  {title.bookTitle}
                </option>
              ))}
            </select>
            {errors.bookTitle && (
              <p className="text-red-500 text-xs md:text-sm mt-1">❌ {errors.bookTitle}</p>
            )}
          </div>

          {/* Return Date Field */}
          <div>
            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
              Return Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="returnDate"
              value={formData.returnDate}
              onChange={handleChange}
              className={`w-full px-4 py-2 md:py-3 border-2 rounded-lg focus:outline-none transition-all text-sm md:text-base ${
                errors.returnDate
                  ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                  : 'border-gray-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100'
              }`}
            />
            {errors.returnDate && (
              <p className="text-red-500 text-xs md:text-sm mt-1">❌ {errors.returnDate}</p>
            )}
          </div>

          

          {/* Submit Button - Stack on Mobile */}
          <div className="flex flex-col md:flex-row gap-2 pt-2 md:pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 font-semibold py-2 md:py-3 rounded-lg transition-all text-sm md:text-base ${
                isLoading
                  ? 'bg-gray-400 text-white cursor-not-allowed opacity-75'
                  : 'bg-teal-600 text-white hover:bg-teal-700'
              }`}
            >
              {isLoading ? '⏳ Processing...' : '🔁 Return Book'}
            </button>
            <button
              type="reset"
              onClick={() => {
                setFormData({
                  studentEmail: '',
                  bookTitle: '',
                  returnDate: new Date().toISOString().split('T')[0],
                });
                setErrors({});
              }}
              className="flex-1 bg-gray-400 text-white font-semibold py-2 md:py-3 rounded-lg hover:bg-gray-500 transition-all text-sm md:text-base"
            >
              Clear
            </button>
          </div>
        </form>
      </div>


      {/* Returned Books Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-4 md:px-6 py-4 border-b-2 border-gray-200 bg-teal-50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-gray-800">📋 All Returned Books</h2>
            <p className="text-gray-600 text-xs md:text-sm mt-1">
              {returnedBooks.length} book{returnedBooks.length !== 1 ? 's' : ''} returned
            </p>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <input
              type="text"
              placeholder="Search by Student Name..."
              value={searchStudent}
              onChange={e => setSearchStudent(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200"
            />
            <button
              onClick={handleDeleteAll}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg text-xs md:text-sm"
              disabled={returnedBooks.length === 0}
            >
              🗑️ Delete All
            </button>
          </div>
        </div>

        {returnedBooks.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="text-left px-4 md:px-6 py-3 font-semibold text-gray-700 text-sm">Return ID</th>
                    <th className="text-left px-4 md:px-6 py-3 font-semibold text-gray-700 text-sm">Issue ID</th>
                    <th className="text-left px-4 md:px-6 py-3 font-semibold text-gray-700 text-sm">Student Name</th>
                    <th className="text-left px-4 md:px-6 py-3 font-semibold text-gray-700 text-sm">Book Title</th>
                    <th className="text-left px-4 md:px-6 py-3 font-semibold text-gray-700 text-sm">Return Date</th>
                    <th className="text-left px-4 md:px-6 py-3 font-semibold text-gray-700 text-sm">Fine Amount</th>
                    <th className="text-left px-4 md:px-6 py-3 font-semibold text-gray-700 text-sm">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {returnedBooks.map((book) => (
                    <tr key={book.returnId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 md:px-6 py-4 text-gray-700 text-sm">{book.returnId}</td>
                      <td className="px-4 md:px-6 py-4 text-gray-700 text-sm">{book.issueId}</td>
                      <td className="px-4 md:px-6 py-4 text-gray-700 text-sm">{book.studentName}</td>
                      <td className="px-4 md:px-6 py-4 text-gray-700 text-sm">{book.bookTitle}</td>
                      <td className="px-4 md:px-6 py-4 text-gray-700 text-sm">{book.returnDate}</td>
                      <td className="px-4 md:px-6 py-4">
                        <span className={`font-semibold text-sm ${book.fineAmount > 0 ? 'text-orange-600' : 'text-green-600'}`}>${book.fineAmount?.toFixed(2) ?? '0.00'}</span>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <button
                          onClick={() => handleDelete(book.returnId)}
                          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-1 rounded text-xs"
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
              {returnedBooks.map((book) => (
                <div key={book.returnId} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase">Return ID</p>
                      <p className="text-sm text-gray-700">{book.returnId}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase">Issue ID</p>
                      <p className="text-sm text-gray-700">{book.issueId}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase">Student</p>
                      <p className="text-sm text-gray-700">{book.studentName}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase">Book</p>
                      <p className="text-sm text-gray-700">{book.bookTitle}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase">Return Date</p>
                        <p className="text-sm text-gray-700">{book.returnDate}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase">Fine</p>
                        <p className={`text-sm font-semibold ${book.fineAmount > 0 ? 'text-orange-600' : 'text-green-600'}`}>${book.fineAmount?.toFixed(2) ?? '0.00'}</p>
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={() => handleDelete(book.returnId)}
                        className="mt-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-1 rounded text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="p-6 md:p-8 text-center">
            <p className="text-gray-600 text-base md:text-lg">
              📭 No books returned yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReturnBooks;