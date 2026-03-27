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
    <>
        <div className='flex justify-start p-5 text-2xl font-bold font-serif text-black border-b-2'>
            <header>
                <h1>
                   Library Management  
                </h1>
            </header>
        </div>

        <div className='flex'>
            <section className='flex flex-col gap-2 border-r-2 h-screen w-[200px]'>
                <h1 className=' flex justify-start p-3 text-black font-semibold text-[20px] border-b-2'>Side Bar</h1>
                <nav className='flex flex-col items-start justify-self-center p-4 gap-2 text-[17px] text-gray-800'>
                    <button onClick={() => setPath('/')}>Dashboard</button>
                    <button onClick={() => setPath('/books')}>Books</button>
                    <button onClick={() => setPath('/students')}>Students</button> 
                    <button onClick={() => setPath('/issue-books')}>Issue Book</button>
                    <button onClick={() => setPath('/return-books')}>Return Book</button>
                </nav>
            </section>
            <section className='flex flex-col w-full max-h-screen p-5'>
                <div>
                    {(path === "/") && <Dashboard />}
                    {(path === "/books") && <Books />}
                    {(path === "/students") && <Student />}
                    {(path === "/issue-books") && <IssueBooks />}
                    {(path === "/return-books") && <ReturnBooks />}
                </div>
            </section>
        </div>

    </>
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