import React, { useEffect, useState } from "react";
import { API_KEY, API_URL, INGREDIENTS } from "../../constants";
import { useAppData } from "../../context/AppContext";
import "./Ingredients.css";
export const Ingredients = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { ingredients, setIngredients } = useAppData();

  const create = async () => {
    if (!name || !price || !description) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${INGREDIENTS}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([{ name, price, description }]),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      setIngredients((ingredients) => {
        return [...ingredients, data.items[0]];
      });
    } catch (error) {
      setError(error.message);
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    create();
  };

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await fetch(`${API_URL}/${INGREDIENTS}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        setIngredients(data.items);
      } catch (error) {
        setError(error.message);
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    console.log("test");

    fetchIngredients();
  }, []);

  return (
    <div className="ingredeintsPage">
      <form onSubmit={onSubmit}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          value={description}
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit">Create</button>
      </form>

      {ingredients.map((ingredient) => (
        <div key={ingredient._uuid}>
          <p>Name: {ingredient.name}</p>
          <p>Description: {ingredient.description}</p>
          <p>Ingerdient: {ingredient.price}</p>
        </div>
      ))}
    </div>
  );
};
