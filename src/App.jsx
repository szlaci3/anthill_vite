import { Route, Routes } from "react-router-dom"
// import Index from "./pages/Index/Index"
// import Contract from "./pages/Staff/Contract/Contract"
// import EmployeeDetails from "./pages/Staff/Employee/EmployeeDetails"
// import NotFound from './pages/404'
import BasicLayout from "./layouts/BasicLayout"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<BasicLayout />} />
      {/* <Route path="/" element={<Index />} />
      <Route path="/contract" element={<Contract />} />
      <Route path="/employee-details" element={<EmployeeDetails />} />
      <Route path="*" element={<NotFound />} /> */}
    </Routes>
  )
}
