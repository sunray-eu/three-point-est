/**
 * @fileoverview Navigation bar with branding, GitHub link, and language selector.
 */
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { SET_LANGUAGE } from "../config/types";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const configLanguage = useSelector((state) => state.config.language);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get available languages from i18n resources
  const availableLanguages = Object.keys(i18n.options.resources).map((lng) => ({
    code: lng,
    nativeName: i18n.options.resources[lng].nativeName,
  }));

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    dispatch({ type: SET_LANGUAGE, language: lng });
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        <ul className="navbar-nav align-items-center">
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
              className="btn btn-outline-light dropdown-toggle"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {
                availableLanguages.find(
                  (lng) => lng.code === configLanguage
                )?.nativeName
              }
            </button>
            <div
              className={`dropdown-menu dropdown-menu-right ${
                dropdownOpen ? "show" : ""
              }`}
            >
              {availableLanguages.map((lng) => (
                <button
                  key={lng.code}
                  className="dropdown-item"
                  onClick={() => changeLanguage(lng.code)}
                >
                  {lng.nativeName}
                </button>
              ))}
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
