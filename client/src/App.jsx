import { Route, Routes, BrowserRouter } from "react-router-dom";
import "./App.css";
import { CoffeesCatalog } from "./pages/coffees/CoffeesCatalog";
import IngredientsCatalog from "./pages/ingredients/IngredientsCatalog";
import { AppProvider } from "./context/AppContext";
import Layout from "./layout/Layout";
import Home from "./pages/home/Home";
function App() {
  return (
    <div>
      <BrowserRouter>
        <AppProvider>
          <Routes>
            <Route
              path="/"
              element={
                <Layout>
                  <Home />
                </Layout>
              }
            />
            <Route
              path="/CoffeesCatalog"
              element={
                <Layout>
                  <CoffeesCatalog />
                </Layout>
              }
            />
            <Route
              path="/IngredientsCatalog"
              element={
                <Layout>
                  <IngredientsCatalog />
                </Layout>
              }
            />
          </Routes>
        </AppProvider>
      </BrowserRouter>
    </div>
  );
  d;
}

export default App;
