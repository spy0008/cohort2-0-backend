import AppRoutes from "./AppRouter";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./features/auth/auth.context.jsx";
import { PostContextProvider } from "./features/post/post.context.jsx";

function App() {
  return (
    <AuthProvider>
      <PostContextProvider>
        <AppRoutes />
      </PostContextProvider>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
