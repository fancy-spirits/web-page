import { Request, Response } from "express";

import { createArtist, createRelease, createSocialLinks } from "../dbHandles/insertDB";
import { Artist, Release, SocialLink } from "../entities";
import { getArtist } from "../dbHandles/readDB";


export default {
    "/artists": async (req, res) => {
        const artist = req.body;
        console.log(req.body);
        
        if (!isArtist(artist)) {
            res.status(400).send("Invalid artist");
            return;
        }
        
        const createdArtist = await createArtist(artist);
        res.json(createdArtist);
    },
    "/releases": async (req, res) => {
        const release = req.body;
        const artistNames: string[] = req.body.artists;
        if (!isRelease(release)) {
            res.status(400).send("Invalid release");
            return;
        }
        const artists: Artist[] = await Promise.all(artistNames.map(async name => (await getArtist(name))!));

        const createdRelease = await createRelease(release, artists);
        res.json(createdRelease);
    },
    "/artists/:name/socialLinks": async (req, res) => {
        const socialLinks = req.body;
        const { artistName } = req.params;
        if (!isSocialLinks(socialLinks)) {
            res.status(400).send("Invalid social links");
            return;
        }
        const artist = await getArtist(artistName);
        if (!artist) {
            res.status(400).send("Invalid artist");
            return;
        }
        const createdSocialLink = await createSocialLinks(socialLinks, artist as any);
        res.json(createdSocialLink);
    }

} as {
    [route: string]: (req: Request, res: Response) => Promise<any>
};

function isArtist(artist: any): artist is Artist {
    return !!artist.name && !!artist.picture && !!artist.biography;
}

function isRelease(release: any): release is Release {
    return !!release.name && !!release.release_date && !!release.release_type && !!release.artwork && !!release.description;
}

function isSocialLinks(socialLinks: any[]): socialLinks is SocialLink[] {
    let okey = true;
    socialLinks.forEach(link => okey = okey && !!link.platform && !!link.platform_type && !!link.link );
    return okey;
}