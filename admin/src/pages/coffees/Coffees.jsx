import React, { useEffect, useMemo, useState } from "react";
import { API_KEY, API_URL, COFFEE, INGREDIENTS } from "../../constants";
import { useAppData } from "../../context/AppContext";
import "./Coffee.css";

export const Coffees = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editCoffeeId, setEditCoffeeId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { coffees, setCoffees, ingredients, setIngredients } = useAppData();
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [ingredientToDelete, setIngredientToDelete] = useState(null);

  const coffeeIngredients = useMemo(() => {
    return Object.keys(checkedIngredients).filter(
      (ing) => checkedIngredients[ing]
    );
  }, [checkedIngredients]);

  const createOrUpdateCoffee = async () => {
    if (!title || !description || !coffeeIngredients.length) {
      return;
    }

    try {
      setIsLoading(true);
      const url = editCoffeeId
        ? `${API_URL}/${COFFEE}/${editCoffeeId}`
        : `${API_URL}/${COFFEE}`;
      const method = editCoffeeId ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          ingredients: coffeeIngredients,
          description,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.items && data.items.length > 0) {
        if (editCoffeeId) {
          setCoffees((prevCoffees) =>
            prevCoffees.map((coffee) =>
              coffee._uuid === editCoffeeId ? data.items[0] : coffee
            )
          );
          setEditCoffeeId(null);
        } else {
          setCoffees((prevCoffees) => [...prevCoffees, data.items[0]]);
        }
        setTitle("");
        setDescription("");
        setCheckedIngredients({});
      } else {
        throw new Error("No items returned from API");
      }
    } catch (error) {
      setError(error.message);
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCoffee = async (id) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/${COFFEE}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setCoffees((prevCoffees) =>
        prevCoffees.filter((coffee) => coffee._uuid !== id)
      );
    } catch (error) {
      setError(error.message);
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteIngredient = async (id) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/${INGREDIENTS}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setIngredients((prevIngredients) =>
        prevIngredients.filter((ingredient) => ingredient._uuid !== id)
      );
    } catch (error) {
      setError(error.message);
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    createOrUpdateCoffee();
  };

  const onEdit = (coffee) => {
    setTitle(coffee.title);
    setDescription(coffee.description);
    setCheckedIngredients(
      coffee.ingredients.reduce((acc, ing) => {
        acc[ing] = true;
        return acc;
      }, {})
    );
    setEditCoffeeId(coffee._uuid);
  };

  useEffect(() => {
    const fetchCoffees = async () => {
      try {
        setIsLoading(true);
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
        if (data.items && Array.isArray(data.items)) {
          setCoffees(data.items);
        } else {
          throw new Error("Invalid data format for coffees");
        }
      } catch (error) {
        setError(error.message);
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchIngredients = async () => {
      try {
        setIsLoading(true);
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
        if (data.items && Array.isArray(data.items)) {
          setIngredients(data.items);
        } else {
          throw new Error("Invalid data format for ingredients");
        }
      } catch (error) {
        setError(error.message);
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoffees();
    fetchIngredients();
  }, [setCoffees, setIngredients]);

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
            {editCoffeeId ? "Update" : "Create"}
          </button>
        </div>
        <div className="ingredients-coffees">
          <div className="ingredients">
            {ingredients.map((ing) => (
              <div key={ing._uuid}>
                <label htmlFor={ing._uuid}>{ing.name}</label>
                <input
                  type="checkbox"
                  id={ing._uuid}
                  checked={!!checkedIngredients[ing._uuid]}
                  onChange={(e) =>
                    setCheckedIngredients((prev) => ({
                      ...prev,
                      [ing._uuid]: e.target.checked,
                    }))
                  }
                />
                <button
                  className="deleteIngredient"
                  onClick={() => setIngredientToDelete(ing._uuid)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
          <div className="coffees">
            {coffees.map((coffee) => (
              <div key={coffee._uuid}>
                <p>Title: {coffee.title}</p>
                <p>Description: {coffee.description}</p>
                {coffee.ingredients.map((cof) => {
                  const ingredient = ingredients.find(
                    (ing) => ing._uuid === cof
                  );
                  return (
                    <span key={cof}>
                      Addition:{" "}
                      {ingredient ? ingredient.name : "Unknown ingredient"}
                    </span>
                  );
                })}
                <div>
                  <button onClick={() => onEdit(coffee)} className="edit">
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCoffee(coffee._uuid)}
                    className="delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </form>
      {isLoading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {ingredientToDelete && (
        <div className="confirmDelete">
          <p>Are you sure you want to delete this ingredient?</p>
          <button
            onClick={() => {
              deleteIngredient(ingredientToDelete);
              setIngredientToDelete(null);
            }}
          >
            Yes
          </button>
          <button onClick={() => setIngredientToDelete(null)}>No</button>
        </div>
      )}
    </div>
  );
};
