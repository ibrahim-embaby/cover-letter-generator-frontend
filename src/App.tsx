import { Route, Routes } from "react-router-dom";
import UserForm from "./Pages/UserForm";
import RequestsPage from "./Pages/Requests";

function App() {
  return (
    <Routes>
      <Route path="/" element={<UserForm />} />
      <Route path="/admin" element={<RequestsPage />} />
    </Routes>
  );
}

export default App;
