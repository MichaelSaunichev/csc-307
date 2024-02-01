import express from "express";
import cors from "cors";
import userServices from "./user-services.js";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  userServices.getUsers(name, job)
    .then((result) => {
      res.send({ users_list: result });
    })
    .catch(() => {
      res.status(500).send("500");
    });
});

app.get("/users/:id", (req, res) => {
  const id = req.params.id;

  userServices.findUserById(id)
    .then((result) => {
      if (result === null) {
        res.status(404).send("404");
      } else {
        res.send(result);
      }
    })
    .catch(() => {
      res.status(500).send("500");
    });
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;

  userServices.addUser(userToAdd)
    .then((addedUser) => {
      res.status(201).send(addedUser);
    })
    .catch(() => {
      res.status(500).send("500");
    });
});

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;

  userServices.findUserById(id)
    .then((user) => {
      if (user === null) {
        res.status(404).send("404");
      } else {
        userServices.deleteUser(id)
          .then(() => {
            res.status(204).send();
          })
          .catch(() => {
            res.status(500).send("500");
          });
      }
    })
    .catch(() => {
      res.status(500).send("500");
    });
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});