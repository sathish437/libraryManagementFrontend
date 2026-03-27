import { use, useEffect, useState } from "react";

function Dashboard() {
    const [books, setBooks] = useState({});
    const [value, setValue] = useState({
          TotalBooks: 0,
          AvailableBooks: 0,
          IssuedBooks: 0,
          ReturnedBooks: 0
    });
    useEffect(() => {
        fetch("http://localhost:8080/api/book/getAllBooks")
            .then((response) => response.json())
            .then((data) => {
                setBooks(data);
            })
            .catch((error) => {
                console.error('Error fetching returned books:', error);
            });

        fetch("http://localhost:8080/api/IssueBook/AllIssueBooks")
            .then(res=>res.json())
            .then(data=>{
                setValue(prevValue=>({
                  ...prevValue,
                  IssuedBooks:data.length
                }))
            })

        fetch("http://localhost:8080/api/returnBook/AllReturnedBooks")
            .then(res=>res.json())
            .then(data=>{
                setValue(prevValue=>({
                  ...prevValue,
                  ReturnedBooks:data.length
                }))
            })
    }, []);
    useEffect(() => {
        if (books.length > 0) {
            const totalCopies=books.map(book=>book.totalCopies).reduce((acc, totalCopies) => acc + totalCopies, 0);
            setValue(prevValue => ({
                ...prevValue,
                TotalBooks: totalCopies
            }));

            const availableCopies=books.map(book=>book.availableBooks).reduce((acc,availableCopies)=>acc+availableCopies,0);
            setValue(PrevValue=>({
              ...PrevValue,
              AvailableBooks:availableCopies
            }))
          }
    }, [books]);


  const stats = [
    { label: 'Total Books', value: value.TotalBooks, icon: '📚', color: 'teal' },
    { label: 'Available Books', value: value.AvailableBooks, icon: '✅', color: 'green' },
    { label: 'Issued Books', value: value.IssuedBooks, icon: '📤', color: 'blue' },
    { label: 'Returned Books', value: value.ReturnedBooks, icon: '👨‍🎓', color: 'orange' },
  ];

  const getColorClasses = (color) => {
    const colors = {
      teal: 'border-l-4 border-teal-600 bg-teal-50',
      green: 'border-l-4 border-green-600 bg-green-50',
      blue: 'border-l-4 border-blue-600 bg-blue-50',
      orange: 'border-l-4 border-orange-600 bg-orange-50',
    };
    return colors[color] || colors.teal;
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-sm md:text-base text-gray-600">Welcome to the Library Management System</p>
      </div>

      {/* Stats Cards Grid - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${getColorClasses(
              stat.color
            )} rounded-lg p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-widest">
                  {stat.label}
                </p>
                <p className="text-2xl md:text-4xl font-bold text-gray-800 mt-2 md:mt-3">
                  {stat.value}
                </p>
              </div>
              <div className="text-3xl md:text-5xl opacity-20 ml-2">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;