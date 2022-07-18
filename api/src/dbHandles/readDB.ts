import { Artist, Release, ReleaseItem, SocialLink, StreamingLink, User } from "../entities.api";
import { DBSchema } from "../entities.db";
import { DB } from "../pg";

const db = DB.getInstance();

export async function getAllArtists() {
    const queryString = `SELECT id, name, picture, biography, "user" FROM artists ORDER BY name ASC`;
    const socialQueryString = `SELECT platform, link, platform_type FROM social_link WHERE artist = $1`;
    const queryStringUser = `SELECT private_mail FROM users WHERE id = $1`;
    const { rows } = await db.querySingle(queryString, []);
    
    const responseObject: Artist[] = await Promise.all(rows.map(async artist => {
        const socialLinks = (await db.querySingle(socialQueryString, [artist.id])).rows ?? [];
        const mailResult = await db.querySingle(queryStringUser, [artist.user]);

        const mail = mailResult.rows[0].private_mail;
        return {
            ...artist,
            socialLinks,
            mail
        };
    }));
    return responseObject;
}

export async function getArtist(name: string) {
    const queryStringArtist = `SELECT id, name, picture, biography FROM artists WHERE name = $1`;
    const socialQueryString = `SELECT platform, link, platform_type FROM social_link WHERE artist = $1`;

    const artistHeaderResult = await db.querySingle(queryStringArtist, [name]);
    if (artistHeaderResult.rowCount === 0) {
        throw "Artist not found";
    }
    const artistHeader = artistHeaderResult.rows[0];
    const socialLinks = (await db.querySingle(socialQueryString, [artistHeader.id])).rows ?? [];

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

    const artistHeaderResult = await db.querySingle(queryStringArtist, [name]);
    if (artistHeaderResult.rowCount === 0) {
        return;
    }
    const artistHeader = artistHeaderResult.rows[0];
    const releases: Release[] = (await db.querySingle(queryStringReleases, [artistHeader.id])).rows ?? [];

    return releases;
}

export async function getArtistSocialLinks(name: string) {
    const queryStringSocialLinks = `SELECT id, platform, link, platform_type FROM artist_social_links($1)`;
    const socialLinksResult = await db.querySingle(queryStringSocialLinks, [name]);
    const socialLinks = socialLinksResult.rows.map(socialLink => socialLink as SocialLink);

    return socialLinks;
}

export async function getReleases() {
    const queryStringReleases = `SELECT * FROM releases ORDER BY release_date DESC`;
    const queryStringReleaseItem = `SELECT ri.id, ri.name, g.name AS genre FROM release_items AS ri LEFT JOIN genre AS g ON ri.genre = g.id WHERE ri.release = $1`;
    const queryStringStreamingLinksRelease = `SELECT * FROM streaming_link_release WHERE release = $1`;
    const queryStringStreamingLinksReleaseItem = `SELECT * FROM streaming_link WHERE release_item = $1`;
    const queryStringArtistsOfReleaseItem = `SELECT a.id, a.name, a.picture, a.biography, ric.position FROM artists AS a LEFT JOIN release_item_contribution AS ric WHERE a.id IN (SELECT artist FROM release_item_contribution WHERE release_item = $1)`;
    const queryStringArtistsOfRelease = `SELECT a.id, a.name, a.picture, a.biography, rc.position FROM artists AS a LEFT JOIN release_contribution AS rc WHERE a.id IN (SELECT artist FROM release_contribution WHERE release = $1)`;

    const queryStringSocialLinks = `SELECT * FROM social_link WHERE artist = $1`;

    const releaseHeaders = await db.querySingleTyped<DBSchema.Release>(queryStringReleases, []);

    const finalReleases = await Promise.all(releaseHeaders.map(async (releaseHeader) => {
        // Get ReleaseItems from Release
        const releaseItems = await db.querySingleTyped<DBSchema.ReleaseItem & {position: number}>(queryStringReleaseItem, [releaseHeader.id]);

        // Get streaming links of total release
        const majorStreamingLinks = await db.querySingleTyped<DBSchema.StreamingLinkRelease>(queryStringStreamingLinksRelease, [releaseHeader.id]);
        
        // Get streaming links and artists for every ReleaseItem
        const finalReleaseItems = (await Promise.all(releaseItems.map(async (releaseItem) => {
            const releaseItemStreamingLinks = await db.querySingleTyped<DBSchema.StreamingLinkReleaseItem>(queryStringStreamingLinksReleaseItem, [releaseItem.id]);
            const releaseItemArtists = await db.querySingleTyped<DBSchema.Artist & {position: number}>(queryStringArtistsOfReleaseItem, [releaseItem.id]);

            // Get social links for the artists
            const socialLinks = await Promise.all(releaseItemArtists.map(async releaseItemArtist => {
                const socialLinks = await db.querySingleTyped<DBSchema.SocialLink>(queryStringSocialLinks, [releaseItemArtist.id]);
                return socialLinks;
            }));

            const finalReleaseItemArtists: {[position: number]: Artist} = {};
            releaseItemArtists.forEach((releaseItemArtist, index) => {
                finalReleaseItemArtists[releaseItemArtist.position] = {
                    ...releaseItemArtist,
                    socialLinks: socialLinks[index]
                };
            });
            const finalReleaseItem: ReleaseItem & {position: number} = {
                ...releaseItem,
                artists: finalReleaseItemArtists,
                streamingLinks: releaseItemStreamingLinks
            };
            return finalReleaseItem;
        }))).reduce((prev, curr) => {
                prev[curr.position] = curr;
                return prev;
            }, 
            {} as {[position: number]: ReleaseItem}
        );

        // Get artists of the release
        const releaseArtists = await db.querySingleTyped<DBSchema.Artist & {position: number}>(queryStringArtistsOfRelease, [releaseHeader.id]);
        // Get social links for the artists
        const artistSocialLinks = await Promise.all(releaseArtists.map(async releaseArtist => {
            const socialLinks = await db.querySingleTyped<DBSchema.SocialLink>(queryStringSocialLinks, [releaseArtist.id]);
            return socialLinks;
        }));

        const finalReleaseArtists: Artist[] = releaseArtists.map((artist, index) => ({...artist, socialLinks: artistSocialLinks[index]}));

        const releaseGenres = [...new Set(releaseItems.map(releaseItem => releaseItem.genre))];

        const finalRelease: Release = {
            ...releaseHeader,
            genres: releaseGenres,
            artists: finalReleaseArtists,
            streamingLinks: majorStreamingLinks,
            tracks: finalReleaseItems
        }

        // Assemble
        return finalRelease;
    }))

    return finalReleases;
}

export async function getRelease(id: string) {
    const queryStringReleases = `SELECT * FROM releases WHERE id = $1`;

    const releaseResult = await db.querySingle(queryStringReleases, [id]);

    return releaseResult.rows[0] as Release;
}

export async function getUsers() {
    const queryStringUsers = `SELECT * FROM users`;
    const userResults = await db.querySingle(queryStringUsers, []);

    return userResults.rows.map(user => user as User);
}