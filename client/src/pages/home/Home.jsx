import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
const Home = () => {
  return (
    <div className="home">
      <h2>Please select what you would like to order</h2>
      <div className="coffes-ingredients">
        <Link to="/CoffeesCatalog">Coffee Catalog</Link>
        <Link to="/IngredientsCatalog">Ingredients Catalog</Link>
      </div>
    </div>
  );
};

export default Home;
