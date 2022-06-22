import { Artist, Release, SocialLink, User } from "../entities";
import { querySingle } from "../pg";

export async function getAllArtists() {
    const queryString = `SELECT id, name, picture, biography FROM artists ORDER BY name ASC`;
    const socialQueryString = `SELECT platform, link, platform_type FROM social_link WHERE artist = $1`;
    const { rows } = await querySingle(queryString, []);
    const responseObject: Artist[] = [];
    await Promise.all(rows.map(row => async function(){
        const socialLinks = (await querySingle(socialQueryString, [row.id])).rows ?? [];
        responseObject.push({
            ...row,
            socialLinks
        });
    }));
    return responseObject;
}

export async function getArtist(name: string) {
    const queryStringArtist = `SELECT id, name, picture, biography FROM artists WHERE name = $1`;
    const socialQueryString = `SELECT platform, link, platform_type FROM social_link WHERE artist = $1`;

    const artistHeaderResult = await querySingle(queryStringArtist, [name]);
    if (artistHeaderResult.rowCount === 0) {
        throw "Artist not found";
    }
    const artistHeader = artistHeaderResult.rows[0];
    const socialLinks = (await querySingle(socialQueryString, [artistHeader.id])).rows ?? [];

    return {
        ...artistHeader,
        socialLinks
    } as Artist & {
        id: string
    };
}

export async function getArtistReleases(name: string) {
    const queryStringArtist = `SELECT id, name, picture, biography FROM artists WHERE name = $1`;
    const queryStringReleases = `SELECT * FROM releases WHERE id IN (SELECT release FROM release_contribution WHERE artist = $1)`;

    const artistHeaderResult = await querySingle(queryStringArtist, [name]);
    if (artistHeaderResult.rowCount === 0) {
        return;
    }
    const artistHeader = artistHeaderResult.rows[0];
    const releases: Release[] = (await querySingle(queryStringReleases, [artistHeader.id])).rows ?? [];

    return releases;
}

export async function getArtistSocialLinks(name: string) {
    const queryStringSocialLinks = `SELECT id, platform, link, platform_type FROM artist_social_links($1)`;
    const socialLinksResult = await querySingle(queryStringSocialLinks, [name]);
    const socialLinks = socialLinksResult.rows.map(socialLink => socialLink as SocialLink);

    return socialLinks;
}

export async function getReleases() {
    const queryStringReleases = `SELECT * FROM releases ORDER BY release_date DESC`;

    const releases: Release[] = (await querySingle(queryStringReleases, [])).rows ?? [];

    return releases;
}

export async function getRelease(id: string) {
    const queryStringReleases = `SELECT * FROM releases WHERE id = $1`;

    const releaseResult = await querySingle(queryStringReleases, [id]);

    return releaseResult.rows[0] as Release;
}

export async function getUsers() {
    const queryStringUsers = `SELECT * FROM users`;
    const userResults = await querySingle(queryStringUsers, []);

    return userResults.rows.map(user => user as User);
}