import { Pool, Client } from "pg";

const pool = new Pool({
    host: "postgres",
    port: 5432,
    database: process.env.POSTGRES_DB_NAME,
    user: process.env.POSTGRES_FANCY_SPIRITS_USER,
    password: process.env.POSTGRES_FANCY_SPIRITS_PASSWORD
});

console.log(`database: ${process.env.POSTGRES_DB_NAME}, username: ${process.env.POSTGRES_FANCY_SPIRITS_USER}, password: ${process.env.POSTGRES_FANCY_SPIRITS_PASSWORD}`)

const query = (text: string, params: any) => pool.query(text, params);

export async function getAllArtists() {
    const queryString = `SELECT id, name, picture, biography FROM artists ORDER BY name ASC`;
    const socialQueryString = `SELECT platform, link, platform_type FROM social_link WHERE artist = $1`;
    const { rows } = await query(queryString, []);
    const responseObject: Artist[] = [];
    await Promise.all(rows.map(row => async function(){
        const socialLinks = (await query(socialQueryString, [row.id])).rows ?? [];
        responseObject.push({
            ...row,
            socialLinks
        });
    }));
    return responseObject;
}

export async function getArtist(name: string): Promise<Artist | undefined> {
    const queryStringArtist = `SELECT id, name, picture, biography FROM artists WHERE name = $1`;
    const socialQueryString = `SELECT platform, link, platform_type FROM social_link WHERE artist = $1`;

    const artistHeaderResult = await query(queryStringArtist, [name]);
    if (artistHeaderResult.rowCount === 0) {
        return;
    }
    const artistHeader = artistHeaderResult.rows[0];
    const socialLinks = (await query(socialQueryString, [artistHeader.id])).rows ?? [];

    return {
        ...artistHeader,
        socialLinks
    };
}

export async function getArtistReleases(name: string) {
    const queryStringArtist = `SELECT id, name, picture, biography FROM artists WHERE name = $1`;
    const queryStringReleases = `SELECT * FROM releases WHERE id IN (SELECT release FROM release_contribution WHERE artist = $1)`;

    const artistHeaderResult = await query(queryStringArtist, [name]);
    if (artistHeaderResult.rowCount === 0) {
        return;
    }
    const artistHeader = artistHeaderResult.rows[0];
    const releases: Release[] = (await query(queryStringReleases, [artistHeader.id])).rows ?? [];

    return releases;
}

export async function getReleases() {
    const queryStringReleases = `SELECT * FROM releases ORDER BY release_date DESC`;

    const releases: Release[] = (await query(queryStringReleases, [])).rows ?? [];

    return releases;
}

interface Artist {
    name: string;
    picture: Buffer;
    biography: string;
    socialLinks: SocialLink[];
};

interface SocialLink {
    platform: string;
    link: string;
    platform_type: string;
};

interface Release {
    name: string;
    release_date: Date;
    release_type: string;
    artwork: Buffer;
    description: string;
};

interface ReleaseItem {

}