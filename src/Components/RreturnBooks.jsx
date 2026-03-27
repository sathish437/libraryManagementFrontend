import { useState } from 'react';

function ReturnBooks() {
  const [formData, setFormData] = useState({
    studentEmail: '',
    bookTitle: '',
    returnDate: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState({});
  const [successData, setSuccessData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [returnedBooks, setReturnedBooks] = useState([]);

  const bookTitles = [
    'Java Basics',
    'Spring Boot',
    'DB Design',
    'Python Essentials',
    'Web Development',
  ];

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
      const fine = calculateFine();
      const studentName = formData.studentEmail.split('@')[0];

      const newReturnedBook = {
        id: Date.now(),
        studentName,
        studentEmail: formData.studentEmail,
        bookTitle: formData.bookTitle,
        returnDate: formData.returnDate,
        fineAmount: fine,
        status: 'RETURNED',
      };

      setReturnedBooks((prev) => [newReturnedBook, ...prev]);

      setSuccessData({
        bookTitle: formData.bookTitle,
        studentEmail: formData.studentEmail,
        returnDate: formData.returnDate,
        fineAmount: fine,
      });

      // Reset form
      setFormData({
        studentEmail: '',
        bookTitle: '',
        returnDate: new Date().toISOString().split('T')[0],
      });

      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        setSuccessData(null);
      }, 5000);
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
        {/* Success Message with Fine Details */}
        {successData && (
          <div className="mb-6 p-4 md:p-6 bg-green-50 border-l-4 border-green-600 rounded-lg">
            <p className="text-green-700 font-semibold text-sm md:text-base mb-3">
              ✓ Book "{successData.bookTitle}" returned successfully
            </p>
            <div className="bg-white rounded p-3 md:p-4 space-y-2">
              <div className="flex flex-col md:flex-row md:justify-between text-gray-700 text-sm">
                <span>Student Email:</span>
                <span className="font-semibold text-xs md:text-base break-all">{successData.studentEmail}</span>
              </div>
              <div className="flex flex-col md:flex-row md:justify-between text-gray-700 text-sm">
                <span>Return Date:</span>
                <span className="font-semibold">{successData.returnDate}</span>
              </div>
              <div className="flex flex-col md:flex-row md:justify-between text-base md:text-lg font-bold pt-2 border-t border-gray-300">
                <span>Fine Amount:</span>
                <span className={successData.fineAmount > 0 ? 'text-orange-600' : 'text-green-600'}>
                  ${successData.fineAmount.toFixed(2)}
                </span>
              </div>
            </div>
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
              {bookTitles.map((title) => (
                <option key={title} value={title}>
                  {title}
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

          {/* Status Info (Auto-set) */}
          <div className="bg-green-50 p-3 md:p-4 rounded-lg border-l-4 border-green-600">
            <p className="text-xs md:text-sm font-semibold text-green-700">Status</p>
            <p className="text-green-600 text-xs md:text-sm mt-1">Status will be automatically set to: <span className="font-bold">RETURNED</span></p>
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
        <div className="px-4 md:px-6 py-4 border-b-2 border-gray-200 bg-teal-50">
          <h2 className="text-lg md:text-xl font-bold text-gray-800">📋 All Returned Books</h2>
          <p className="text-gray-600 text-xs md:text-sm mt-1">
            {returnedBooks.length} book{returnedBooks.length !== 1 ? 's' : ''} returned
          </p>
        </div>

        {returnedBooks.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="text-left px-4 md:px-6 py-3 font-semibold text-gray-700 text-sm">
                      Student Name
                    </th>
                    <th className="text-left px-4 md:px-6 py-3 font-semibold text-gray-700 text-sm">
                      Book Title
                    </th>
                    <th className="text-left px-4 md:px-6 py-3 font-semibold text-gray-700 text-sm">
                      Return Date
                    </th>
                    <th className="text-left px-4 md:px-6 py-3 font-semibold text-gray-700 text-sm">
                      Fine Amount
                    </th>
                    <th className="text-left px-4 md:px-6 py-3 font-semibold text-gray-700 text-sm">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {returnedBooks.map((book) => (
                    <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 md:px-6 py-4 text-gray-800 font-medium text-sm">
                        {book.studentName}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-gray-700 text-sm">{book.bookTitle}</td>
                      <td className="px-4 md:px-6 py-4 text-gray-700 text-sm">{book.returnDate}</td>
                      <td className="px-4 md:px-6 py-4">
                        <span className={`font-semibold text-sm ${
                          book.fineAmount > 0 ? 'text-orange-600' : 'text-green-600'
                        }`}>
                          ${book.fineAmount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                          {book.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-200">
              {returnedBooks.map((book) => (
                <div key={book.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase">Student</p>
                        <p className="text-sm font-medium text-gray-800">{book.studentName}</p>
                      </div>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                        {book.status}
                      </span>
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
                        <p className={`text-sm font-semibold ${
                          book.fineAmount > 0 ? 'text-orange-600' : 'text-green-600'
                        }`}>
                          ${book.fineAmount.toFixed(2)}
                        </p>
                      </div>
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