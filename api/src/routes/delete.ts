import { Request, Response } from "express";
import { deleteArtistSafe, deleteReleaseSafe, deleteSocialLink } from "../dbHandles/deleteDB";

export default {
    "/artists/:name": async (req, res) => {
        const { name } = req.params;

        await deleteArtistSafe(name);

        res.status(204).send();
    },
    "/releases/:id": async (req, res) => {
        const { id } = req.params;

        await deleteReleaseSafe(id);

        res.status(204).send();
    },
    "/artists/:name/socialLinks/:platform": async (req, res) => {
        const { name: artistName, platform } = req.params;

        await deleteSocialLink(artistName, platform);

        res.status(204).send();
    }
} as {
    [route: string]: (req: Request, res: Response) => Promise<any>
};