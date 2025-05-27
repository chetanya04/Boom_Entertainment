import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/signup_signIn/register.tsx";
import Login from "./components/signup_signIn/login.tsx";
import BoomFeed from "./components/Dashboard/dashboard.tsx";
import UploadForm from "./components/uploadForm/uploadform.tsx";

export default function App() {
  return (<>

    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<BoomFeed />} />
        <Route path="/upload" element={<UploadForm />} />
      </Routes>
    </BrowserRouter>
  </>
  );
}

