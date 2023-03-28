import express from "express";
import { authRoutes } from "./Auth/authRouter";
import { DB } from "./db/database"

const app = express();
const PORT = 4200;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true}));



//routes
app.use(authRoutes);






// database connection
DB.authenticate().then(() => {
    console.log('Connection successful');
  }).catch((err) => {
    console.log('Error connectiong to database', err)
})




//server
app.listen(PORT, ()=> {
    console.log(`Server listening at ${PORT}`)
})
