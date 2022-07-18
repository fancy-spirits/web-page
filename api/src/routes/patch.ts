import { Request, Response } from "express";
import { Artist, Release, SocialLink } from "../entities.api";
import { getArtist } from "../dbHandles/readDB";
import { updateArtist, updateRelease, updateSocialLink } from "../dbHandles/updateDB";

export default {
    "/artists/:name": async (req, res) => {
        const { name } = req.params;
        const artist: Partial<Artist> = req.body;
        const updatedArtist = await updateArtist(artist, name);

        res.json(updatedArtist);
    },
    "/releases/:id": async (req, res) => {
        const { id } = req.params;
        const release: Partial<Release> = req.body;
        const updatedRelease = await updateRelease(release, id);

        res.json(updatedRelease);
    },
    "/artists/:name/socialLink/:id": async (req, res) => {
        const { name: artistName, id } = req.params;
        const socialLink: Partial<SocialLink> = req.body;
        const platform = socialLink.platform;
        const artist = (await getArtist(artistName));
        if (!artist || !platform) {
            res.status(400).send("Artist and platform are mandatory");
            return;
        }
        const updatedSocialLink = await updateSocialLink(socialLink, artist, platform);

        res.json(updatedSocialLink);
    }

} as {
    [route: string]: (req: Request, res: Response) => Promise<any>
};