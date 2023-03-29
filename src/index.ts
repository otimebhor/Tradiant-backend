import express from "express";
import { authRoutes } from "./Auth/authRouter";
import { PORT } from "./config";
import { DB } from "./db/database";

const app = express();
const port = PORT || 4200;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use(authRoutes);

// database connection
DB.authenticate()
  .then(() => {
    console.log("Database Connection successful");
  })
  .catch((err) => {
    console.log("Error connectiong to database", err);
  });

//server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
