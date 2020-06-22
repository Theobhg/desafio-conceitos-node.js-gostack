const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateId(request, response, next) {
  const { id } = request.params;

  const respostoryIndex = repositories.findIndex(repository => repository.id === id);

  if (respostoryIndex < 0 ) {
    return response.status(400).json({ error: 'Repository does not exists.' });
  }

  return next();
}

app.use("/repositories/:id", validateId);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", validateId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const respostoryIndex = repositories.findIndex(repository => repository.id === id);

  const repository = {
    ...repositories[respostoryIndex],
    title,
    url, 
    techs,
  };

  repositories[respostoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", validateId, (request, response) => {
  const { id } = request.params;

  const respostoryIndex = repositories.findIndex(repository => repository.id === id);

  repositories.splice(respostoryIndex, 1);
  
  return response.status(204).send();
});

app.post("/repositories/:id/like", validateId, (request, response) => {
  const { id } = request.params;

  const respostoryIndex = repositories.findIndex(repository => repository.id === id);

  repositories[respostoryIndex].likes++;

  return response.json(repositories[respostoryIndex]);
});

module.exports = app;
