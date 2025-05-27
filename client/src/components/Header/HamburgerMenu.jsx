import { useState, useRef, useEffect } from "react";
import AuthButton from "./AuthButton";

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="hamburger-menu" ref={menuRef}>
      <button
        className="hamburger-menu__button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Toggle menu"
      >
        &#9776;
      </button>
      {open && (
        <ul className="hamburger-menu__dropdown">
          <li><AuthButton /></li>
          <li>Connections</li>
          <li>Help</li>
          <li>About Us</li>
        </ul>
      )}
    </div>
  );
}
