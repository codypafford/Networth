import HamburgerMenu from "./HamburgerMenu";
import "./style.scss";

export default function Header() {
  return (
    <header className="header">
      <h1 className="header__title" onClick={() => window.location.assign(window.location.origin)}>
        What is my Networth?
        {/* TODO: I NEED A LOGO AND WEBSITE NAME */}
      </h1>
      <div className="header__actions">
        <HamburgerMenu />
      </div>
    </header>
  );
}
