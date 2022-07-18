import { Artist, Release, ReleaseItem, SocialLink, StreamingLink, User } from "../entities.api";
import { DBSchema } from "../entities.db";
import { DB } from "../pg";

const db = DB.getInstance();

export async function getAllArtists() {
    const queryString = `SELECT id, name, picture, biography, "user", u.private_mail FROM artists LEFT JOIN users AS u ON "user" = u.id ORDER BY name ASC`;
    const socialQueryString = `SELECT platform, link, platform_type FROM social_link WHERE artist = $1`;

    const artists = await db.querySingleTyped<DBSchema.Artist & {private_mail: string}>(queryString, []);
    
    const finalArtists = await Promise.all(artists.map(async artist => {
        const socialLinks = await db.querySingleTyped<DBSchema.SocialLink>(socialQueryString, [artist.id]);

        return {
            ...artist,
            socialLinks
        };
    }));
    return finalArtists;
}

export async function getArtist(name: string): Promise<Artist> {
    const queryStringArtist = `SELECT id, name, picture, biography FROM artists WHERE name = $1`;
    const socialQueryString = `SELECT platform, link, platform_type FROM social_link WHERE artist = $1`;

    const artistHeaders = await db.querySingleTyped<DBSchema.Artist>(queryStringArtist, [name]);
    const artistHeader = artistHeaders[0];

    const socialLinks = await db.querySingleTyped<DBSchema.SocialLink>(socialQueryString, [artistHeader.id]);

    return {
        ...artistHeader,
        socialLinks
    };
}

export async function getArtistReleases(name: string) {
    const queryStringArtist = `SELECT id, name, picture, biography FROM artists WHERE name = $1`;
    const queryStringReleases = `SELECT * FROM releases WHERE id IN (SELECT release FROM release_contribution WHERE artist = $1)`;

    const artistHeaders = await db.querySingleTyped<DBSchema.Artist>(queryStringArtist, [name]);
    const artistHeader = artistHeaders[0];
    
    const releases = await db.querySingleTyped<DBSchema.Release>(queryStringReleases, [artistHeader.id]);
    return releases;
}

export async function getArtistSocialLinks(name: string): Promise<SocialLink[]> {
    const queryStringSocialLinks = `SELECT id, platform, link, platform_type FROM artist_social_links($1)`;
    const socialLinks = await db.querySingleTyped<DBSchema.SocialLink>(queryStringSocialLinks, [name]);

    return socialLinks;
}

export async function getReleases() {
    const queryStringReleases = `SELECT * FROM releases ORDER BY release_date DESC`;
    
    const releaseHeaders = await db.querySingleTyped<DBSchema.Release>(queryStringReleases, []);

    const finalReleases = await Promise.all(releaseHeaders.map(async releaseHeader => assembleRelease(releaseHeader)))

    return finalReleases;
}

export async function getRelease(id: string) {
    const queryStringReleases = `SELECT * FROM releases WHERE id = $1`;

    const releaseHeader = await db.querySingleTyped<DBSchema.Release>(queryStringReleases, [id]);

    const finalRelease = assembleRelease(releaseHeader[0]);
    return finalRelease;
}

export async function getUsers(): Promise<User[]> {
    const queryStringUsers = `SELECT * FROM users`;
    const users = await db.querySingleTyped<DBSchema.User>(queryStringUsers, []);

    return users.map(user => ({...user, privateMail: user.private_mail}));
}

async function assembleRelease(releaseHeader: DBSchema.Release): Promise<Release> {
    const queryStringReleaseItem = `SELECT ri.id, ri.name, g.name AS genre FROM release_items AS ri LEFT JOIN genre AS g ON ri.genre = g.id WHERE ri.release = $1`;
    const queryStringStreamingLinksRelease = `SELECT * FROM streaming_link_release WHERE release = $1`;
    const queryStringStreamingLinksReleaseItem = `SELECT * FROM streaming_link WHERE release_item = $1`;
    const queryStringArtistsOfReleaseItem = `SELECT a.id, a.name, a.picture, a.biography, ric.position FROM artists AS a LEFT JOIN release_item_contribution AS ric WHERE a.id IN (SELECT artist FROM release_item_contribution WHERE release_item = $1)`;
    const queryStringArtistsOfRelease = `SELECT a.id, a.name, a.picture, a.biography, rc.position FROM artists AS a LEFT JOIN release_contribution AS rc WHERE a.id IN (SELECT artist FROM release_contribution WHERE release = $1)`;
    const queryStringSocialLinks = `SELECT * FROM social_link WHERE artist = $1`;

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
}