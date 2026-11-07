import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Col, Container, Form, Row } from "react-bootstrap";

const API = "http://localhost:3001/recipes";

const emptyForm = {
  name: "",
  ingredients: "",
  instructions: "",
  prepTimeMinutes: 0,
  cookTimeMinutes: 0,
  cuisine: "",
  difficulty: "",
  tags: "",
  mealType: "",
};

//"a; b; c" -> ["a", "b", "c"]
function splitList(text) {
  return text
    .split(";")
    .map((item) => item.trim())
    .filter((item) => item !== "");
}

function CreateRecipe() {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [nameError, setNameError] = useState("");
  const [error, setError] = useState("");

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function save(e) {
    e.preventDefault();

    //validate: tên recipe không được để trống
    if (form.name.trim() === "") {
      setNameError("Recipe Name is required");
      return;
    }
    setNameError("");
    setError("");

    const newRecipe = {
      name: form.name.trim(),
      ingredients: splitList(form.ingredients),
      instructions: splitList(form.instructions),
      prepTimeMinutes: Number(form.prepTimeMinutes),
      cookTimeMinutes: Number(form.cookTimeMinutes),
      cuisine: form.cuisine.trim(),
      difficulty: form.difficulty.trim(),
      tags: splitList(form.tags),
      mealType: splitList(form.mealType),
      image: "thumbnail.png",
    };

    try {
      await axios.post(API, newRecipe);
      alert("Create new Recipe success!");
      navigate("/");
    } catch (err) {
      setError("Create recipe failed");
    }
  }

  return (
    <Container className="p-4" style={{ maxWidth: 700 }}>
      <h1 className="text-center mb-4">Create A New Recipe</h1>

      <Form onSubmit={save}>
        <Form.Group controlId="name" className="mb-3">
          <Form.Label>Recipe Name (*)</Form.Label>
          <Form.Control name="name" value={form.name} onChange={change} />
          {nameError && <div className="text-danger">{nameError}</div>}
        </Form.Group>

        <Form.Group controlId="ingredients" className="mb-3">
          <Form.Label>Ingredients</Form.Label>
          <Form.Control
            name="ingredients"
            placeholder="Separate ingredients with ;"
            value={form.ingredients}
            onChange={change}
          />
        </Form.Group>

        <Form.Group controlId="instructions" className="mb-3">
          <Form.Label>Instructions</Form.Label>
          <Form.Control
            name="instructions"
            placeholder="Separate instructions with ;"
            value={form.instructions}
            onChange={change}
          />
        </Form.Group>

        <Row className="mb-3">
          <Col>
            <Form.Group controlId="prepTimeMinutes">
              <Form.Label>Preparation Time Minutes</Form.Label>
              <Form.Control
                type="number"
                min="0"
                name="prepTimeMinutes"
                value={form.prepTimeMinutes}
                onChange={change}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="cookTimeMinutes">
              <Form.Label>Cook Time Minutes</Form.Label>
              <Form.Control
                type="number"
                min="0"
                name="cookTimeMinutes"
                value={form.cookTimeMinutes}
                onChange={change}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="cuisine" className="mb-3">
          <Form.Label>Cuisine</Form.Label>
          <Form.Control name="cuisine" value={form.cuisine} onChange={change} />
        </Form.Group>

        <Form.Group controlId="difficulty" className="mb-3">
          <Form.Label>Difficulty</Form.Label>
          <Form.Control name="difficulty" value={form.difficulty} onChange={change} />
        </Form.Group>

        <Form.Group controlId="tags" className="mb-3">
          <Form.Label>Tags</Form.Label>
          <Form.Control
            name="tags"
            placeholder="Separate tags with ;"
            value={form.tags}
            onChange={change}
          />
        </Form.Group>

        <Form.Group controlId="mealType" className="mb-3">
          <Form.Label>Meal Types</Form.Label>
          <Form.Control
            name="mealType"
            placeholder="Separate meal types with ;"
            value={form.mealType}
            onChange={change}
          />
        </Form.Group>

        {error && <p className="text-danger">{error}</p>}
        <Button type="submit" variant="primary">
          Save
        </Button>
      </Form>
    </Container>
  );
}

export default CreateRecipe;
