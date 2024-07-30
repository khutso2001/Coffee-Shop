import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Ingredients } from "./pages/ingredients";
import { Coffees } from "./pages/coffees";
import { Home } from "./pages/home";
import Layout from "./components/layout/Layout";
import { AppProvider } from "./context/AppContext";

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route
            element={
              <Layout>
                <Home />
              </Layout>
            }
            path="/"
          />
          <Route
            element={
              <Layout>
                <Ingredients />
              </Layout>
            }
            path="/ingredients"
          ></Route>
          <Route
            element={
              <Layout>
                <Coffees />
              </Layout>
            }
            path="/coffess"
          ></Route>

          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
