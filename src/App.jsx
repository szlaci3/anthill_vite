import { Route, Routes } from "react-router-dom"
import Index from "./pages/Index/Index"
import Contract from "./pages/Staff/Contract/Contract"
import EmployeeDetails from "./pages/Staff/Employee/EmployeeDetails"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/contract" element={<Contract />} />
      <Route path="/employee-details" element={<EmployeeDetails />} />
    </Routes>
  )
}
