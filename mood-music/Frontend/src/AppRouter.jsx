import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./features/auth/pages/LoginForm";
import RegisterForm from "./features/auth/pages/RegisterForm";
import Protected from "./features/auth/components/Protected";
import Home from "./features/home/pages/Home";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route
          path="/"
          element={
            <Protected>
              <Home />
            </Protected>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
