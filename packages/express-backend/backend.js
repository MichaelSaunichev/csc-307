import express from "express";
import cors from "cors";

const app = express();
const port = 8000;
const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor"
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer"
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor"
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress"
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender"
    }
  ]
};

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const findUserByName = (name) => {
  return users["users_list"].filter(
    (user) => user["name"] === name
  );
};

const findUserByJob = (job) => {
  return users["users_list"].filter(
    (user) => user["job"] === job
  );
};

const findUsersByNameAndJob = (name, job) => {
  return users["users_list"].filter(
    (user) => user["name"] === name && user["job"] === job
  );
};

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  if (name !== undefined && job !== undefined) {
    let result = findUsersByNameAndJob(name, job);
    result = { users_list: result };
    res.send(result);
  }
  else if (name !== undefined) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  }
  else if (job !== undefined) {
    let result = findUserByJob(job);
    result = { users_list: result };
    res.send(result);
    
  }
  else {
    res.send(users);
  }
});

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } 
  else {
    res.send(result);
  }
});

const generateRandomLetters = () => {
  const getRandomLetter = () => String.fromCharCode(97 + Math.floor(Math.random() * 26));
  return getRandomLetter() + getRandomLetter() + getRandomLetter();
};

const generateID = () => {
  const randomLetters = generateRandomLetters();
  const randomNumbers = Math.random().toString().substring(2, 5);
  return randomLetters + randomNumbers;
};

const addUser = (user) => {
  const userWithID = { ...user, id: generateID() };
  users["users_list"].push(userWithID);
  return userWithID;
};

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  const addedUser = addUser(userToAdd);
  res.status(201).send(addedUser);
});

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  const index = users["users_list"].findIndex((user) => user.id === id);

  if (index === -1) {
    res.status(404).send("Not valid id");
  }
  else {
    users["users_list"].splice(index, 1);
    res.status(204).send();
  }
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});