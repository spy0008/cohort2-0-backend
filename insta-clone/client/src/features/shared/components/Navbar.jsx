import "../style/nav.scss";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <p>Insta</p>
      <button onClick={() => navigate("/create-post")} className="button primary-button">
        New post
      </button>
    </nav>
  );
};

export default Navbar;
