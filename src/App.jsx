import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Article from "./pages/Article";
import Edit from "./pages/Edit";
import Post from "./pages/Post";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./components/PrivateRoute";
// import { AuthProvider } from "./contexts/authContext";

export default function App() {
  return (
    // <AuthProvider>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/article/:id" element={<Article />} />
        <Route element={<PrivateRoute />}>
          <Route path="/editor" element={<Edit />} />
          <Route path="/editor/:id" element={<Edit />} />
          <Route path="/post" element={<Post />} />
        </Route>
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
    // </AuthProvider>
  );
}
