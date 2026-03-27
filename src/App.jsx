import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './Components/Layout'
import Dashboard from './Components/Dashboard'
import Books from './Components/Books'
import Students from './Components/Students'
import IssueBooks from './Components/IssueBooks'
import ReturnBooks from './Components/RreturnBooks'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout><Dashboard /></Layout>} path="/" />
        <Route element={<Layout><Books /></Layout>} path="/books" />
        <Route element={<Layout><Students /></Layout>} path="/students" />
        <Route element={<Layout><IssueBooks /></Layout>} path="/issue-books" />
        <Route element={<Layout><ReturnBooks /></Layout>} path="/return-books" />
      </Routes>
    </BrowserRouter>
  )
}

export default App
