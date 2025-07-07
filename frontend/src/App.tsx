import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import DepartmentDashboard from './DepartmentDashboard'
import { Routes } from 'react-router'
import { Route } from 'react-router-dom'
import EmployeeDashboard from './EmployeeDashboard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path="/department" element={<DepartmentDashboard/>}></Route>
        <Route path="/employee" element={<EmployeeDashboard/>}></Route>
      </Routes>
    </>
  )
}

export default App
