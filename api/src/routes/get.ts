import { Request, Response } from "express";
import { getAllArtists, getArtist, getArtistReleases, getArtistSocialLinks, getRelease, getReleases, getUsers } from "../dbHandles/readDB";

export default {
    "/artists": async (req, res) => {
        const artists = await getAllArtists();
        res.json(artists);
    },
    "/artists/:name": async (req, res) => {
        const { name } = req.params;
        const artist = await getArtist(name);
        if (!artist) {
            res.status(404).send();
        } else {
            res.json(artist);
        }
    },
    "/artists/:name/releases": async (req, res) => {
        const { name } = req.params;
        const releases = await getArtistReleases(name);
        if (!releases) {
            res.status(404).send();
        } else {
            res.json(releases);
        }
    },
    "/artists/:name/socialLinks": async (req, res) => {
        const { name } = req.params;
        const socialLinks = await getArtistSocialLinks(name);
        res.json(socialLinks);
    },
    "/releases": async (req, res) => {
        const releases = await getReleases();
        res.json(releases);
    },
    "/releases/:id": async (req, res) => {
        const { id } = req.params;
        const release = await getRelease(id);
        if (!release) {
            res.status(404).send();
        } else {
            res.json(release);
        }
    },
    "/users": async (req, res) => {
        const users = await getUsers();
        res.json(users);
    }
} as {
    [route: string]: (req: Request, res: Response) => Promise<any>
};