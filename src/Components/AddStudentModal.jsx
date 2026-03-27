import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

function AddStudentModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const departments = ["MECH", "EEE", "ECE", "CIVIL", "CSE", "MECHATRONICS"];

  // Validation rules
  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "name":
        if (value.trim().length < 2) {
          newErrors.name = "Name must be at least 2 characters";
        } else if (value.length > 100) {
          newErrors.name = "Name cannot exceed 100 characters";
        } else {
          delete newErrors.name;
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value.trim().length === 0) {
          newErrors.email = "Email is required";
        } else if (!emailRegex.test(value)) {
          newErrors.email = "Please enter a valid email address";
        } else {
          delete newErrors.email;
        }
        break;

      case "department":
        if (value.trim() === "") {
          newErrors.department = "Please select a department";
        } else {
          delete newErrors.department;
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (
      formData.name.trim().length >= 2 &&
      formData.name.length <= 100 &&
      emailRegex.test(formData.email) &&
      formData.department.trim() !== "" &&
      Object.keys(errors).length === 0
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      department: true,
    });

    // Validate all fields
    validateField("name", formData.name);
    validateField("email", formData.email);
    validateField("department", formData.department);

    if (isFormValid()) {
      const studentData = {
        name: formData.name,
        email: formData.email,
        department: formData.department,
      };

      fetch(`http://localhost:8080/api/students/addStudent`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData)
    })
    .then(async (res)=>{
        let data=null
        
        if(res.status!==200){
            try{
                data=await res.json();
                alert(data?.message);
            }catch{}
        }
        if(res.ok){
            alert("Student added successfully");
        }
    })
    .catch(() => {
        alert("Server error");
    });

      
      // Reset form and close modal
      setFormData({ name: "", email: "", department: "" });
      setErrors({});
      setTouched({});
      onClose();
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", email: "", department: "" });
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden transform transition-all duration-300 scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-teal-50 to-teal-100 px-6 py-5 flex items-center justify-between border-b border-gray-200">
          <h2 className="text-2xl font-bold text-teal-900">Add New Student</h2>
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
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Student Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter student name"
              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-all ${
                touched.name && errors.name
                  ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              }`}
            />
            {touched.name && errors.name && (
              <p className="text-red-500 text-sm mt-1 font-medium">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter email address"
              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-all ${
                touched.email && errors.email
                  ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              }`}
            />
            {touched.email && errors.email && (
              <p className="text-red-500 text-sm mt-1 font-medium">
                {errors.email}
              </p>
            )}
          </div>

          {/* Department Field */}
          <div>
            <label
              htmlFor="department"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Department
            </label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-all ${
                touched.department && errors.department
                  ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              }`}
            >
              <option value="">Select a department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {touched.department && errors.department && (
              <p className="text-red-500 text-sm mt-1 font-medium">
                {errors.department}
              </p>
            )}
          </div>
        </form>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-6 py-4 flex gap-3 border-t border-gray-200">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid()}
            className={`flex-1 px-4 py-2 text-white font-semibold rounded-lg transition-colors ${
              isFormValid()
                ? "bg-teal-600 hover:bg-teal-700 cursor-pointer"
                : "bg-gray-400 cursor-not-allowed opacity-60"
            }`}
          >
            Add Student
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

export default AddStudentModal;
