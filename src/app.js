const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  const result = repositories;

  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body;

  const repository = {
    id: uuid(),
    url,
    title,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({
      error: "Repository not found",
    });
  }

  if (request.body.likes) {
    return response.json({
      likes: repositories[repoIndex].likes,
    });
  }

  const { url, title, techs } = request.body;

  const repository = {
    id,
    url,
    title,
    techs,
  };

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({
      error: "Repository not found",
    });
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({
      error: "Repository not found",
    });
  }

  repositories[repoIndex].likes += 1;

  return response.json({
    likes: repositories[repoIndex].likes,
  });
});

module.exports = app;
