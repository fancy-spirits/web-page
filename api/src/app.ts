import express from "express";
import morgan from "morgan";
import cors from "cors";
import get from "./routes/get";
import patch from "./routes/patch";
import post from "./routes/post";
import {default as deleteRoutes} from "./routes/delete";

// Init DB Connection
import { DB } from "./pg";
DB.getInstance();

const app = express();
const PORT = process.env.PORT ?? 4000;

app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(morgan("combined"));

// Add GET-Endpoints
Object.entries(get).forEach(route => app.get(route[0], route[1]));
// ADD POST-Endpoints
Object.entries(post).forEach(route => app.post(route[0], route[1]));
// ADD PATCH-Endpoints
Object.entries(patch).forEach(route => app.patch(route[0], route[1]));
// ADD DELETE-Endpoints
Object.entries(deleteRoutes).forEach(route => app.delete(route[0], route[1]));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));