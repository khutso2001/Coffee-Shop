import React, { useEffect, useMemo, useState } from "react";
import { API_KEY, API_URL, COFFEE, INGREDIENTS } from "../../constants";
import { useAppData } from "../../context/AppContext";
import "./Coffee.css";
export const Coffees = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { coffees, setCoffees, ingredients, setIngredients } = useAppData();

  const [checkedIngredients, setCheckedIngredients] = useState({});

  const coffeIngredients = useMemo(() => {
    const ings = [];

    Object.keys(checkedIngredients).forEach((ing) => {
      if (checkedIngredients[ing]) {
        ings.push(ing);
      }
    });

    return ings;
  }, [checkedIngredients]);

  const create = async () => {
    if (!title || !description || !coffeIngredients.length) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${COFFEE}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          { title, ingredients: coffeIngredients, description },
        ]),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      setCoffees((coffees) => {
        return [...coffees, data.items[0]];
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
    const fetchCoffees = async () => {
      try {
        const response = await fetch(`${API_URL}/${COFFEE}`, {
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

        setCoffees(data.items);
      } catch (error) {
        setError(error.message);
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

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

    fetchCoffees();
    fetchIngredients();
  }, []);

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="inputs">
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            value={description}
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit" className="createButton">
            Create
          </button>
        </div>
        <div className="ingredients-coffes">
          <div className="ingredients">
            {ingredients.map((ing) => (
              <div key={ing._uuid}>
                <label htmlFor={ing._uuid}>{ing.name}</label>
                <input
                  type="checkbox"
                  key={ing._uuid}
                  id={ing._uuid}
                  value={checkedIngredients[ing._uuid]}
                  onChange={(e) =>
                    setCheckedIngredients((prev) => ({
                      ...prev,
                      [ing._uuid]: e.target.checked,
                    }))
                  }
                />
              </div>
            ))}
          </div>
          <div className="coffes">
            {coffees.map((coffee) => (
              <div key={coffee._uuid}>
                <p>Title: {coffee.title}</p>
                <p>Description: {coffee.description}</p>
                {coffee.ingredients.map((cof) => {
                  const ingName = ingredients.find(
                    (ing) => ing._uuid === cof
                  ).name;

                  return <span key={cof}>Addition: {ingName}</span>;
                })}
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};
