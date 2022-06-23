import { Artist, Genre, Release, SocialLink, User } from "../entities";
import { DB } from "../pg";

const db = DB.getInstance();

export async function createArtist(artist: Artist) {
    const artistUser = await createArtistUser({
        privateMail: `${artist.name}:${Date.now()}`,
        pwd_hash: "x",
        salt: "x"
    });
    const insertStatement = `INSERT INTO artists (name, picture, biography, user) VALUES ($1, $2, $3, $4) RETURNING *`;
    const created: Artist = await (await db.querySingle(insertStatement, [artist.name, artist.picture, artist.biography, artistUser.id!])).rows[0];
    return created;
}

export async function createRelease(release: Release, artists: Artist[]) {
    const insertStatementRelease = `INSERT INTO releases (name, release_date, release_type, artwork, description) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const insertStatementReleaseContribution = `INSERT INTO release_contribution (artist, release) VALUES ($1, $2) RETURNING *`;
    const result = await db.querySingle(insertStatementRelease, [release.name, release.release_date, release.release_type, release.artwork, release.description]);
    const createdRelease = result.rows[0];
    const queries: [text: string, params: any[]][] = artists.map(artist => [insertStatementReleaseContribution, [artist["id"], createdRelease["_id"]]]);
    await db.queryMultiple([
        ...queries
    ]);
    return createdRelease as Release;
}

export async function createSocialLinks(socialLinks: SocialLink[], artist: Artist & {id: string}) {
    const insertStatementSocialLink = `INSERT INTO social_link (platform, link, platform_type, artist) VALUES ($1, $2, $3, $4) RETURNING *`;
    const queries: [text: string, params: any[]][] = socialLinks.map(socialLink => [insertStatementSocialLink,  [socialLink.platform, socialLink.link, socialLink.platform_type, artist.id]]);
    const results = await db.queryMultiple([
        ...queries
    ]);

    return results.map(result => result.rows[0] as SocialLink);
}

export async function createArtistUser(user: Partial<User>) {
    if (!user.privateMail || !user.pwd_hash || !user.salt) {
        throw "Invalid User";
    }
    const insertStatementUser = `INSERT INTO users (private_mail, pwd_hash, salt, role) VALUES ($1, $2, $3, $4) RETURNING *`;
    const userResult = await db.querySingle(insertStatementUser, [user.privateMail, user.pwd_hash, user.salt, "artist"]);
    const createdUser: User = userResult.rows[0];
    console.log(userResult);
    
    return createdUser;
}

export async function createGenre(genre: Genre) {
    const insertStatementGenre = `INSERT INTO genre (name) VALUES ($1) RETURNING *`;
    const genreResult = await db.querySingle(insertStatementGenre, [genre.name]);
    const createdGenre: Genre = genreResult.rows[0];
    console.log(`Created artist ${createdGenre}`);

    return createdGenre;
}