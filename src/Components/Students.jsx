import { use, useEffect, useState } from 'react';
import AddStudentModal from './AddStudentModal';

function Students() {
  const [students, setStudents] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8080/api/students/getStudents")
    .then((res)=>res.json())
    .then(data=>setStudents(data))
    .catch((error) => {
      alert("Server error");
    });
  }, []);

useEffect(() => {
  if(searchTerm.trim()===""){
    fetch("http://localhost:8080/api/students/getStudents")
    .then((res)=>res.json())
    .then(data=>setStudents(data))
    .catch((error) => {
      alert("Server error");
    });
  }else{
    fetch(`http://localhost:8080/api/students/search?name=${searchTerm.toLowerCase()}`)
    .then((res)=>res.json())
    .then(data=>setStudents(data))
    .catch((error) => {
      alert("Server error");
    });
  }
}, [searchTerm]);
  
  const handleDelete = (id) => {
    fetch(`http://localhost:8080/api/students/delete/${id}`, {
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
      alert("Student deleted successfully");
    })
    .catch(() => {
      alert("Server error");
    });
    
  };

  const handleDeleteAll = () => {
      fetch(`http://localhost:8080/api/students/deleteAll`, {
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
      alert("Students are deleted successfully");
    })
    .catch(() => {
      alert("Server error");
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header Section - Responsive Stack */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
            👨‍🎓 Students List
          </h1>
          <p className="text-sm md:text-base text-gray-600">Manage registered students</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors shadow-sm font-semibold text-sm md:text-base"
        >
          + Add Student
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="search"
          placeholder="Search by name, email, or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border-2 border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 text-sm md:text-base"
        />
      </div>

      {/* Table/Card Section */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {students.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-teal-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="text-left px-4 md:px-6 py-3 font-semibold text-gray-700 text-sm">
                      Name
                    </th>
                    <th className="text-left px-4 md:px-6 py-3 font-semibold text-gray-700 text-sm">
                      Email
                    </th>
                    <th className="text-left px-4 md:px-6 py-3 font-semibold text-gray-700 text-sm">
                      Department
                    </th>
                    <th className="text-left px-4 md:px-6 py-3 font-semibold text-gray-700 text-sm">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr
                      key={student.studentId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 md:px-6 py-4 text-gray-800 font-medium text-sm">
                        {student.name}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-gray-700 text-sm">{student.email}</td>
                      <td className="px-4 md:px-6 py-4 text-gray-700 text-sm">
                        {student.department}
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <button
                          onClick={() => handleDelete(student.studentId)}
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
              {students.map((student) => (
                <div
                  key={student.studentId}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="space-y-3">
                    {/* Name */}
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase">Name</p>
                      <p className="text-sm font-medium text-gray-800">{student.name}</p>
                    </div>

                    {/* Email */}
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase">Email</p>
                      <p className="text-sm text-gray-700 break-all">{student.email}</p>
                    </div>

                    {/* Department */}
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase">Department</p>
                      <p className="text-sm text-gray-700">{student.department}</p>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleDelete(student.studentId)}
                      className="w-full bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-semibold mt-2"
                    >
                      Delete Student
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
                ? '📌 No students found matching your search'
                : '📭 No students available'}
            </p>
          </div>
        )}
      </div>

      {/* Delete All Button */}
      {students.length > 0 && (
        <div className="mt-4">
          <button
            onClick={handleDeleteAll}
            className="w-full md:w-auto bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-semibold text-sm md:text-base"
          >
            Delete All Students
          </button>
        </div>
      )}

      {/* Add Student Modal */}
      <AddStudentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default Students;