import { Route, Routes, useNavigate } from "react-router-dom";
import Main from "./pages/Main";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SetAvatar from "./pages/SetAvatar";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/set-avatar" element={<SetAvatar />}></Route>
        <Route path="/*" element={<Main />}></Route>
      </Routes>
    </div>
  );
}

export default App;
