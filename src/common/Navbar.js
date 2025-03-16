import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const currentLanguageLabel = i18n.language === "sk" ? "Slovensky" : "English";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-danger fixed-top">
      <a className="navbar-brand mb-0 h1" href="./">
        <img
          src={`${process.env.PUBLIC_URL}/3pe-logo.png`}
          width="28"
          height="28"
          className="d-inline-block align-middle"
          alt="logo"
        />
        &nbsp; {t("Three Point Estimation App")}
      </a>
      <div className="collapse navbar-collapse justify-content-end">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              className="nav-link"
              href="https://github.com/sunray-eu/three-point-est"
              target="_blank"
              rel="noopener noreferrer"
            >
              Github
            </a>
          </li>
          <li className="nav-item dropdown" ref={dropdownRef}>
            <button
              className="btn nav-link dropdown-toggle"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{ background: "none", border: "none", padding: 0 }}
            >
              {currentLanguageLabel}
            </button>
            <div
              className={`dropdown-menu dropdown-menu-right ${
                dropdownOpen ? "show" : ""
              }`}
            >
              <button
                className="dropdown-item"
                onClick={() => changeLanguage("en")}
              >
                English
              </button>
              <button
                className="dropdown-item"
                onClick={() => changeLanguage("sk")}
              >
                Slovensky
              </button>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
