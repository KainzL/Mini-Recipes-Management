import { BrowserRouter, Route, Routes } from "react-router-dom";
import RecipeList from "./pages/RecipeList";
import CreateRecipe from "./pages/CreateRecipe";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RecipeList />} />
        <Route path="/recipe/create" element={<CreateRecipe />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
