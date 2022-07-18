import { jsonToBuffer } from "../bufferUtil";
import { Artist, Genre, Release, ReleaseItem, SocialLink, StreamingLink, User } from "../entities.api";
import { DB } from "../pg";
import { DBSchema } from "../entities.db";

const db = DB.getInstance();

export async function createArtist(artist: Artist): Promise<Artist> {
    try {
        await db.startTransaction();
        const artistUser = await createArtistUser({
            privateMail: artist.mail,
            pwd_hash: "x",
            salt: "x"
        });
        const insertStatement = `INSERT INTO artists (name, picture, biography, "user") VALUES ($1, $2, $3, $4) RETURNING *`;
        const createdArtist = await db.querySingleTyped<DBSchema.Artist>(insertStatement, [artist.name, jsonToBuffer(artist.picture), artist.biography, artistUser.id!]);
        
        const insertStatementSocialLink = `INSERT INTO social_link (platform, link, platform_type, artist) VALUES ($1, $2, $3, $4) RETURNING *`;
        const queries: [query: string, params: Array<any>][] = artist.socialLinks.map(link => [insertStatementSocialLink, [link.platform, link.link, link.platform_type, createdArtist[0].id!]]);
        const createdSocialLinks = (await Promise.all(queries.map(async query => await db.querySingleTyped<SocialLink>(...query))))[0];

        await db.endTransaction();
        return {
            ...createdArtist[0],
            socialLinks: createdSocialLinks
        };
    } catch (e) {
        db.rollback();
        throw e;
    }
}

export async function createRelease(release: Release): Promise<Partial<Release>> {
    try {
        await db.startTransaction();
        // Create Release Header
        const insertStatementRelease = `INSERT INTO releases (name, release_date, release_type, artwork, description) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const createdRelease = (await db.querySingleTyped<DBSchema.Release>(insertStatementRelease, [release.name, release.release_date, release.release_type, jsonToBuffer(release.artwork), release.description]))[0];

        // Create Streaming Links for whole release
        const insertStatementReleaseStreamingLinks = `INSERT INTO streaming_link_release (service, link, release) RETURNING *`;
        const createdReleaseStreamingLinks = await Promise.all(release.streamingLinks.map(async streamingLink => {
            return await db.querySingleTyped<DBSchema.StreamingLinkRelease>(
                insertStatementReleaseStreamingLinks,
                [
                    streamingLink.service,
                    streamingLink.link,
                    createdRelease.id
                ]
            )
        }));

        // Create Release Contributions
        const insertStatementReleaseContribution = `INSERT INTO release_contribution (artist, release, position) VALUES ($1, $2, $3) RETURNING *`;
        await Promise.all(Object.entries(release.artists).map(async ([position, artist]) => {
            await db.querySingleTyped<DBSchema.ReleaseContribution>(
                insertStatementReleaseContribution,
                [
                    artist.id!,
                    release.id!,
                    +position
                ]
            );
        }));
        
        const insertStatementReleaseItems = `INSERT INTO release_items (name, genre, release, position) VALUES ($1, $2, $3, $4) RETURNING *`;
        const createdReleaseItems = await Promise.all(Object.entries(release.tracks).map(async ([position, releaseItem]) => {
            // Create genre if required
            let genres = await db.querySingleTyped<DBSchema.Genre | Genre>(`SELECT * FROM genres WHERE name = $1`, [releaseItem.genre]);
            if (genres.length === 0) {
                genres = [await createGenre({name: releaseItem.genre})]
            }

            // Create Release Item
            const createdReleaseItem = await db.querySingleTyped<DBSchema.ReleaseItem>(insertStatementReleaseItems, [
                releaseItem.name,
                genres[0].id!,
                createdRelease.id,
                +position
            ]);

            // Create Release Item Contributions
            const insertStatementReleaseItemContribution = `INSERT INTO release_item_contribution (artist, release_item, position) VALUES ($1, $2, $3) RETURNING *`;
            await Promise.all(Object.entries(releaseItem.artists).map(async ([position, artist]) => {
                await db.querySingleTyped<DBSchema.ReleaseItemContribution>(
                    insertStatementReleaseItemContribution,
                    [
                        artist.id!,
                        releaseItem,
                        +position
                    ]
                );
            }));

            // Insert ReleaseItem Streaming Links
            const insertStatementReleaseItemLinks = `INSERT INTO streaming_link (service, link, release_item) VALUES ($1, $2, $3) RETURNING *`;
            const createdReleaseItemStreamingLinks = (await Promise.all(releaseItem.streamingLinks.map(async streamingLink => {
                return await db.querySingleTyped<DBSchema.StreamingLinkReleaseItem>(
                    insertStatementReleaseItemLinks,
                    [
                        streamingLink.service,
                        streamingLink.link,
                        createdReleaseItem[0].id
                    ]
                )
            })))[0];

            return {
                ...createdReleaseItem[0],
                genre: genres[0].id!,
                artists: [] as Artist[],
                streamingLinks: createdReleaseItemStreamingLinks,
                position: +position
            };
        }));

        const finalReleaseItems: {[position: number]: ReleaseItem} = {};
        createdReleaseItems.forEach(releaseItem => finalReleaseItems[releaseItem.position] = releaseItem)
        
        await db.endTransaction();

        return {
            ...createdRelease,
            tracks: finalReleaseItems,
            streamingLinks: createdReleaseStreamingLinks[0],
            // genres: [],  // Partial
            // artists: [],
        }

    } catch (e) {
        await db.rollback();
        throw e;
    }
}

export async function createSocialLinks(socialLinks: SocialLink[], artist: Artist): Promise<SocialLink[]> {
    if (!artist.id) {
        throw "Artist ID is required";
    }
    const insertStatementSocialLink = `INSERT INTO social_link (platform, link, platform_type, artist) VALUES ($1, $2, $3, $4) RETURNING *`;
    const queries: [text: string, params: any[]][] = socialLinks.map(socialLink => [insertStatementSocialLink,  [socialLink.platform, socialLink.link, socialLink.platform_type, artist.id]]);
    const createdLinks = await Promise.all(queries.map(async query => {
        return (await db.querySingleTyped<DBSchema.SocialLink>(...query))[0];
    }));

    return createdLinks;
}

export async function createArtistUser(user: Partial<User>): Promise<User> {
    if (!user.privateMail || !user.pwd_hash || !user.salt) {
        throw "Invalid User";
    }
    const insertStatementUser = `INSERT INTO users (private_mail, pwd_hash, salt, role) VALUES ($1, $2, $3, $4) RETURNING *`;
    const userResult = await db.querySingleTyped<DBSchema.User>(insertStatementUser, [user.privateMail, user.pwd_hash, user.salt, "artist"]);
    const createdUser = {...userResult[0], privateMail: userResult[0].private_mail};
    
    return createdUser;
}

export async function createGenre(genre: Genre): Promise<Genre> {
    const insertStatementGenre = `INSERT INTO genre (name) VALUES ($1) RETURNING *`;
    const createdGenre = await db.querySingleTyped<DBSchema.Genre>(insertStatementGenre, [genre.name]);

    return createdGenre[0];
}