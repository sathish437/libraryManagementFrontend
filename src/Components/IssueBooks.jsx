import { useEffect, useState } from 'react';
import { data } from 'react-router-dom';

function IssueBooks() {
  const [formData, setFormData] = useState({
    studentEmail: '',
    bookTitle: '',
    issueDate: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [allIssuedBooks, setAllIssuedBooks] = useState([]);
  const [search, setSearch] = useState('');

  const [bookTitles, setBookTitles] = useState([]); 
  useEffect(() => {
    fetch("http://localhost:8080/api/book/getAllBooks")
      .then((res) => res.json())
      .then((data) => {
        setBookTitles(data);
      })
      .catch(() => {
        alert("Server error while fetching books");
      });

    fetch("http://localhost:8080/api/IssueBook/AllIssueBooks")
      .then(res=>res.json())
      .then(data=>{
        setIssuedBooks(data);
        setAllIssuedBooks(data);
      })
      .catch(() => {
        alert("Server error while fetching issued books");
      });
  }, []);

  // Handle email search
  useEffect(() => {
    if (search.trim() === "") {
      setIssuedBooks(allIssuedBooks);
    } else if(search.trim() !== "") {
      // Filter issued books by email
      fetch(`http://localhost:8080/api/IssueBook/searchUser?Name=${search.toLowerCase()}`)
        .then(res => res.json())
        .then(data => {
          setIssuedBooks(data);
        })
        .catch(() => {
          alert("Server error while searching issued books");
        });
    }
  }, [search]);


 
  const calculateDueDate = (issueDate) => {
    const date = new Date(issueDate);
    date.setDate(date.getDate() + 14); // 14 days due date
    return date.toISOString().split('T')[0];
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.studentEmail.trim()) {
      newErrors.studentEmail = 'Student email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.studentEmail)) {
      newErrors.studentEmail = 'Please enter a valid email';
    }

    if (!formData.bookTitle.trim()) {
      newErrors.bookTitle = 'Book title is required';
    }

    if (!formData.issueDate) {
      newErrors.issueDate = 'Issue date is required';
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);

      // Extract student name from email (part before @)
       let newIssuedBook = {
        email: formData.studentEmail,
        bookTitle: formData.bookTitle,
        issueDate: formData.issueDate,
        status: 'Issued'
      };
      fetch("http://localhost:8080/api/IssueBook/issueBook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body:JSON.stringify(newIssuedBook)
       })
       .then(async (res) => {
        let data = null;

        if(res.status!==200){
          try{
            data= await res.json();
            alert(data?.message);
          }catch{}
        }
        if(res.ok){
          alert("Book issued successfully");  
        }
       })
       .catch(() => {
        alert("Server error while issuing book");
       });     
      // Reset form
      setFormData({
        studentEmail: '',
        bookTitle: '',
        issueDate: new Date().toISOString().split('T')[0],
      });

      // Auto-dismiss success message
      setTimeout(() => {
        setSuccessMessage('');
      }, 4000);
    }, 1000);
  };

  // Delete a single issued book
  const handleDelete = (issueId) => {
    if (!window.confirm('Are you sure you want to delete this issued book?')) return;
    fetch(`http://localhost:8080/api/IssueBook/delete/${issueId}`, {
      method: 'DELETE',
    })
      .then(async (res) => {
        let data=null;

        if (res.ok) {
          setIssuedBooks((prev) => prev.filter((book) => book.issueId !== issueId));
          setAllIssuedBooks((prev) => prev.filter((book) => book.issueId !== issueId));
        } else {
          data=await res.json();
          alert(data?.message);
        }
      })
      .catch(() => {
        alert('Server error while deleting issued book.');
      });
  };

  // Delete all issued books
  const handleDeleteAll = () => {
    if (!window.confirm('Are you sure you want to delete ALL issued books? This action cannot be undone.')) return;
    fetch('http://localhost:8080/api/IssueBook/deleteAllIssueDatas', {
      method: 'DELETE',
    })
      .then(async (res) => {
        let data = null;
        if (res.ok) {
          setIssuedBooks([]);
          setAllIssuedBooks([]);
        } else {
          data=await res.json();
          alert(data?.message);
        }
      })
      .catch(() => {
        alert('Server error while deleting all issued books.');
      });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">✅ Issue Book</h1>
        <p className="text-sm md:text-base text-gray-600">Issue a book to a student</p>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-8 mb-6 md:mb-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-600 rounded">
            <p className="text-green-700 font-semibold text-sm md:text-base">✓ {successMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          {/* Student Email Field */}
          <div>
            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
              Student Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="studentEmail"
              value={formData.studentEmail}
              onChange={handleChange}
              placeholder="student@example.com"
              className={`w-full px-4 py-2 md:py-3 border-2 rounded-lg focus:outline-none transition-all text-sm md:text-base ${
                errors.studentEmail
                  ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                  : 'border-gray-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100'
              }`}
            />
            {errors.studentEmail && (
              <p className="text-red-500 text-xs md:text-sm mt-1">❌ {errors.studentEmail}</p>
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
              {bookTitles.map((book) => (
                <option key={book.bookId} value={book.bookTitle}>
                  {book.bookTitle}
                </option>
              ))}
            </select>
            {errors.bookTitle && (
              <p className="text-red-500 text-xs md:text-sm mt-1">❌ {errors.bookTitle}</p>
            )}
          </div>

          {/* Issue Date Field */}
          <div>
            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
              Issue Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="issueDate"
              value={formData.issueDate}
              onChange={handleChange}
              className={`w-full px-4 py-2 md:py-3 border-2 rounded-lg focus:outline-none transition-all text-sm md:text-base ${
                errors.issueDate
                  ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                  : 'border-gray-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100'
              }`}
            />
            {errors.issueDate && (
              <p className="text-red-500 text-xs md:text-sm mt-1">❌ {errors.issueDate}</p>
            )}
          </div>

          {/* Status Info (Auto-set) */}
          <div className="bg-blue-50 p-3 md:p-4 rounded-lg border-l-4 border-blue-600">
            <p className="text-xs md:text-sm font-semibold text-blue-700">Status</p>
            <p className="text-blue-600 text-xs md:text-sm mt-1">Status will be automatically set to: <span className="font-bold">ISSUED</span></p>
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
              {isLoading ? '⏳ Processing...' : '✓ Issue Book'}
            </button>
            <button
              type="reset"
              onClick={() => {
                setFormData({
                  studentEmail: '',
                  bookTitle: '',
                  issueDate: new Date().toISOString().split('T')[0],
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

      {/* Issued Books Table */}
      <div className="mb-6">
        <input
          type="search"
          placeholder="Search by student email..."
          value={search.trim()}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border-2 border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 text-sm md:text-base"
        />
      </div>

      <div className="flex justify-end mb-2">
        {issuedBooks.length > 0 && (
          <button
            onClick={handleDeleteAll}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg text-sm md:text-base shadow"
          >
            Delete All
          </button>
        )}
      </div>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-4 md:px-6 py-4 border-b-2 border-gray-200 bg-teal-50">
          <h2 className="text-lg md:text-xl font-bold text-gray-800">📋 All Issued Books</h2>
          <p className="text-gray-600 text-xs md:text-sm mt-1">
            {issuedBooks.length} book{issuedBooks.length !== 1 ? 's' : ''} issued
          </p>
        </div>

        {issuedBooks.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="text-left px-4 md:px-6 py-3 font-semibold text-gray-700 text-sm">
                      IssueBook ID
                    </th>
                    <th className="text-left px-4 md:px-6 py-3 font-semibold text-gray-700 text-sm">
                      Student Name
                    </th>
                    <th className="text-left px-4 md:px-6 py-3 font-semibold text-gray-700 text-sm">
                      Book Title
                    </th>
                    <th className="text-left px-4 md:px-6 py-3 font-semibold text-gray-700 text-sm">
                      Issue Date
                    </th>
                    <th className="text-left px-4 md:px-6 py-3 font-semibold text-gray-700 text-sm">
                      Due Date
                    </th>
                    <th className="text-left px-4 md:px-6 py-3 font-semibold text-gray-700 text-sm">
                      Status
                    </th>
                    <th className="text-left px-4 md:px-6 py-3 font-semibold text-gray-700 text-sm">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {issuedBooks.map((book) => (
                    <tr key={book.issueId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 md:px-6 py-4 text-gray-700 text-sm">{book.issueId}</td>
                      <td className="px-4 md:px-6 py-4 text-gray-800 font-medium text-sm">
                        {book.studentName}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-gray-700 text-sm">{book.bookTitle}</td>
                      <td className="px-4 md:px-6 py-4 text-gray-700 text-sm">{book.issueDate}</td>
                      <td className="px-4 md:px-6 py-4 text-gray-700 text-sm">{book.dueDate}</td>
                      <td className="px-4 md:px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                          {book.status}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <button
                          onClick={() => handleDelete(book.issueId)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold"
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
              {issuedBooks.map((book) => (
                <div key={book.issueId} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase">IssueBook ID</p>
                      <p className="text-sm text-gray-700">{book.issueId}</p>
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase">Student</p>
                        <p className="text-sm font-medium text-gray-800">{book.studentName}</p>
                      </div>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                        {book.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase">Book</p>
                      <p className="text-sm text-gray-700">{book.bookTitle}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase">Issue Date</p>
                        <p className="text-sm text-gray-700">{book.issueDate}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase">Due Date</p>
                        <p className="text-sm text-gray-700">{book.dueDate}</p>
                      </div>
                    </div>
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => handleDelete(book.issueId)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold"
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
              {search
                ? '📌 No issued books found matching this email'
                : '📭 No books issued yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default IssueBooks;