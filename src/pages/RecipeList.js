import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";

const API = "http://localhost:3001/recipes";

function RecipeList() {
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [selectedMealTypes, setSelectedMealTypes] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    axios
      .get(API)
      .then((res) => setRecipes(res.data))
      .catch(() => setError("Khong tai duoc du lieu, hay chay json server"));
  }, []);

  //sắp xếp rating giảm dần (recipe chưa có rating nằm cuối)
  const sortedRecipes = [...recipes].sort(
    (a, b) => (b.rating ?? 0) - (a.rating ?? 0),
  );

  //dữ liệu cho các bộ lọc, loại bỏ trùng bằng Set
  const cuisines = [...new Set(sortedRecipes.map((r) => r.cuisine))];
  const mealTypes = [...new Set(sortedRecipes.flatMap((r) => r.mealType || []))];
  const tags = [...new Set(sortedRecipes.flatMap((r) => r.tags || []))];

  //tìm kiếm (startsWith) kết hợp với 3 bộ lọc
  //trong cùng 1 nhóm: chọn nhiều ô là OR, giữa các nhóm là AND
  const displayRecipes = sortedRecipes.filter(
    (r) =>
      r.name.toLowerCase().startsWith(search.trim().toLowerCase()) &&
      (selectedCuisines.length === 0 || selectedCuisines.includes(r.cuisine)) &&
      (selectedMealTypes.length === 0 ||
        (r.mealType || []).some((m) => selectedMealTypes.includes(m))) &&
      (selectedTags.length === 0 ||
        (r.tags || []).some((t) => selectedTags.includes(t))),
  );

  //bật/tắt một giá trị trong danh sách đã chọn
  function toggle(list, setList, value) {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value));
    } else {
      setList([...list, value]);
    }
  }

  return (
    <Container fluid className="p-4">
      <h1 className="text-center mb-4">RECIPES FORUM</h1>

      {error && <p className="text-danger text-center">{error}</p>}

      <Row>
        <Col md={2}>
          <h4>Cuisine</h4>
          {cuisines.map((item) => (
            <Form.Check
              key={item}
              name = "cuisine"
              type="checkbox"
              id={`cuisine-${item}`}
              label={item}
              checked={selectedCuisines.includes(item)}
              onChange={() => toggle(selectedCuisines, setSelectedCuisines, item)}
            />
          ))}

          <h4 className="mt-4">Meal Type</h4>
          {mealTypes.map((item) => (
            <Form.Check
              key={item}
              type="checkbox"
              id={`mealType-${item}`}
              label={item}
              checked={selectedMealTypes.includes(item)}
              onChange={() => toggle(selectedMealTypes, setSelectedMealTypes, item)}
            />
          ))}
        </Col>

        <Col md={8} className="side-panel">
          <Form.Control
            type="text"
            placeholder="Enter Recipe Name to search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="text-end my-3">
            <Button variant="primary" onClick={() => navigate("/recipe/create")}>
              Create Recipe
            </Button>
          </div>

          <Table borderless>
            <thead>
              <tr>
                <th>Image</th>
                <th>Recipes</th>
                <th>Cuisine</th>
                <th>MealType</th>
                <th>Tags</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {displayRecipes.map((r) => (
                <tr key={r.id}>
                  <td>
                    <img
                      className="recipe-image"
                      src={`/images/${r.image}`}
                      alt={r.name}
                    />
                  </td>
                  <td>
                    <strong>{r.name}</strong>
                    <div>Preparation Time: {r.prepTimeMinutes} minutes</div>
                    <div>Cook Time: {r.cookTimeMinutes} minutes</div>
                  </td>
                  <td>{r.cuisine}</td>
                  <td>{(r.mealType || []).join("; ")}</td>
                  <td>{(r.tags || []).join("; ")}</td>
                  <td>{r.rating}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>

        <Col md={2}>
          <h4>Tags</h4>
          {tags.map((item) => (
            <Form.Check
              key={item}
              type="checkbox"
              id={`tag-${item}`}
              label={item}
              checked={selectedTags.includes(item)}
              onChange={() => toggle(selectedTags, setSelectedTags, item)}
            />
          ))}
        </Col>
      </Row>
    </Container>
  );
}

export default RecipeList;
