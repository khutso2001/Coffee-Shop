import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
export const Home = () => {
  return (
    <div className="home">
      <h2>Please select what you would like to order</h2>
      <div className="coffes-ingredients">
        <Link to="/coffess">Coffess</Link>
        <Link to="/ingredients">Ingredients</Link>
      </div>
    </div>
  );
};
