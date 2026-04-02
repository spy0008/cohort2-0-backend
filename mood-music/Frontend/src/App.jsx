import AppRouter from "./AppRouter";
import { AuthProvider } from "./features/auth/auth.context";
import { SongContextProvider } from "./features/home/song.context";

function App() {
  return (
    <AuthProvider>
      <SongContextProvider>
        <AppRouter />
      </SongContextProvider>
    </AuthProvider>
  );
}

export default App;
