import { Link } from 'react-router-dom';
import Books from './Books';
import Student from './Students';
import IssueBooks from './IssueBooks';
import ReturnBooks from './RreturnBooks';
import Dashboard from './Dashboard';
import { useState } from 'react';
function Home() {
    const [path, setPath] = useState('/');
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
                {/* Header */}
                <header className="bg-white shadow-sm border-b sticky top-0 z-40">
                    <div className="flex items-center justify-between px-6 py-4">
                        <h1 className="text-2xl font-bold font-serif text-teal-700 tracking-tight">📚 Library Management</h1>
                        <div className="text-base text-gray-600 font-medium">👤 User</div>
                    </div>
                </header>

                <div className="flex">
                    {/* Sidebar */}
                    <aside className="flex flex-col gap-2 bg-white border-r shadow-sm h-[calc(100vh-72px)] w-[220px] p-0">
                        <div className="flex items-center px-6 py-4 border-b">
                            <span className="text-lg font-semibold text-gray-700 tracking-wide">Menu</span>
                        </div>
                        <nav className="flex flex-col gap-1 px-4 py-4">
                            <button onClick={() => setPath('/')} className={`w-full text-left px-4 py-2 rounded-lg transition font-medium ${path==='/' ? 'bg-teal-100 text-teal-700' : 'hover:bg-gray-100 text-gray-700'}`}>🏠 Dashboard</button>
                            <button onClick={() => setPath('/books')} className={`w-full text-left px-4 py-2 rounded-lg transition font-medium ${path==='/books' ? 'bg-teal-100 text-teal-700' : 'hover:bg-gray-100 text-gray-700'}`}>📚 Books</button>
                            <button onClick={() => setPath('/students')} className={`w-full text-left px-4 py-2 rounded-lg transition font-medium ${path==='/students' ? 'bg-teal-100 text-teal-700' : 'hover:bg-gray-100 text-gray-700'}`}>👨‍🎓 Students</button>
                            <button onClick={() => setPath('/issue-books')} className={`w-full text-left px-4 py-2 rounded-lg transition font-medium ${path==='/issue-books' ? 'bg-teal-100 text-teal-700' : 'hover:bg-gray-100 text-gray-700'}`}>✅ Issue Book</button>
                            <button onClick={() => setPath('/return-books')} className={`w-full text-left px-4 py-2 rounded-lg transition font-medium ${path==='/return-books' ? 'bg-teal-100 text-teal-700' : 'hover:bg-gray-100 text-gray-700'}`}>🔁 Return Book</button>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 p-6 overflow-y-auto">
                        <div className="max-w-5xl mx-auto">
                            {path === "/" && <Dashboard />}
                            {path === "/books" && <Books />}
                            {path === "/students" && <Student />}
                            {path === "/issue-books" && <IssueBooks />}
                            {path === "/return-books" && <ReturnBooks />}
                        </div>
                    </main>
                </div>
            </div>
        );
}       
export default Home;

// ---------------------------------------------------------
// | Library Management                      👤 User        |
// ---------------------------------------------------------
// | Sidebar        | Main Content Area                    |
// |                |                                      |
// | 🏠 Dashboard   |   📊 Dashboard Cards                 |
// | 📚 Books       |   -----------------------------      |
// | 👨‍🎓 Students  |   | Total Books      | 120     |      |
// | ✅ Issue Book  |   | Available Books  | 80      |      |
// | 🔁 Return Book |   | Issued Books     | 40      |      |
// |                |   -----------------------------      |
// |                |                                      |
// ---------------------------------------------------------