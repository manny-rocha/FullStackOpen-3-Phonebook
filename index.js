require("dotenv").config();
const express = require("express");
const morgan = require("morgan");

const Entry = require("./models/entry");

const app = express();

app.use(express.static("build"));

app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      req.method === "POST" ? JSON.stringify(req.body) : "",
    ].join(" ");
  })
);

app.use(express.json());

app.get("/info", function (req, res) {
  let currentDate = new Date();
  
  Entry.countDocuments({}).then(count => {
    res.send(
        `<!DOCTYPE html>
            <h2>Phonebook has info for ${count} people</h2>
            <h3>${currentDate}</h3>`
    )
  })
    .catch(err => next(err));
});

app.get("/api/persons", (req, res) => {
  Entry.find({}).then((entries) => {
    res.json(entries);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  Entry.findById(req.params.id)
    .then((entry) => {
      if (entry) {
        res.json(entry);
      } else {
          res.status(404).end();
      }
    })
    .catch(err => next(err));
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  if (body.name === undefined || body.number === undefined) {
    return res.status(400).json({
      error: "Name or number not provided",
    });
  }

  const entry = new Entry({
    name: body.name,
    number: body.number,
  });

  entry.save().then((savedEntry) => {
    res.json(savedEntry);
  });
});

app.put("/api/persons/:id", (req, res, next) => {
    const body = req.body;

    const updatedEntry ({
        name: body.name,
        number: body.number
    })

    Entry.findByIdAndUpdate(req.params.id, updatedEntry, { new: true }).then(result => {
        res.json(result);
    })
    .catch(err => next(err));
});

app.delete("/api/persons/:id", (req, res) => {
    Entry.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end();
        })
        .catch(err => next(err));
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
};

app.use(unknownEndpoint);

const errorHandler = (err, req, res, next) => {
    console.error(err.message);

    if (err.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    }
    
    next(err);
};

app.use(errorHandler);