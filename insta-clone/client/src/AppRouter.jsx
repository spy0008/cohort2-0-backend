import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./features/auth/pages/LoginForm";
import RegisterForm from "./features/auth/pages/RegisterForm";
import Feed from "./features/post/pages/Feed";
import CreatePost from "./features/post/pages/CreatePost";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/create-post" element={<CreatePost />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
