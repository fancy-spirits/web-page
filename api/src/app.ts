import express from "express";
import morgan from "morgan";
import { getAllArtists, getArtist, getArtistReleases, getReleases } from "./pg";
const app = express();
const PORT = process.env.PORT ?? 4000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan("combined"));

app.get("/artists", async (req, res) => {
    const artists = await getAllArtists();
    res.json(artists);
});

app.get("/artists/:name", async (req, res) => {
    const { name } = req.params;
    const artist = await getArtist(name);
    if (!artist) {
        res.status(404).send();
    } else {
        res.json(artist);
    }
});

app.get("/artists/:name/releases", async (req, res) => {
    const { name } = req.params;
    const releases = await getArtistReleases(name);
    if (!releases) {
        res.status(404).send();
    } else {
        res.json(releases);
    }
});

app.get("/releases", async (req, res) => {
    const releases = await getReleases();
    res.json(releases);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));