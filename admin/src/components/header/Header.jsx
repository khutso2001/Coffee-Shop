import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
export default function Header() {
  return (
    <header className="header">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/coffess">Coffess</Link>
        </li>
        <li>
          <Link to="/ingredients">Ingredients</Link>
        </li>
      </ul>
    </header>
  );
}
