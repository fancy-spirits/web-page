import { Artist, Release, SocialLink, User } from "../entities";
import { queryMultiple, querySingle } from "../pg";

export async function createArtist(artist: Artist) {
    const artistUser = await createArtistUser({
        privateMail: `${artist.name}:${Date.now()}`,
        pwd_hash: "x",
        salt: "x"
    });
    const insertStatement = `INSERT INTO artists (name, picture, biography, user) VALUES ('$1', '$2', '$3', '$4')`;
    const created: Artist = await (await querySingle(insertStatement, [artist.name, artist.picture, artist.biography, artistUser.id!])).rows[0];
    return created;
}

export async function createRelease(release: Release, artists: Artist[]) {
    const insertStatementRelease = `INSERT INTO releases (name, release_date, release_type, artwork, description) VALUES ('$1', '$2', '$3', '$4', '$5')`;
    const insertStatementReleaseContribution = `INSERT INTO release_contribution (artist, release) VALUES ('$1', '$2')`;
    const result = await querySingle(insertStatementRelease, [release.name, release.release_date, release.release_type, release.artwork, release.description]);
    const createdRelease = result.rows[0];
    const queries: [text: string, params: any[]][] = artists.map(artist => [insertStatementReleaseContribution, [artist["id"], createdRelease["_id"]]]);
    await queryMultiple([
        ...queries
    ]);
    return createdRelease as Release;
}

export async function createSocialLinks(socialLinks: SocialLink[], artist: Artist & {id: string}) {
    const insertStatementSocialLink = `INSERT INTO social_link (platform, link, platform_type, artist) VALUES ('$1', '$2', '$3', '$4')`;
    const queries: [text: string, params: any[]][] = socialLinks.map(socialLink => [insertStatementSocialLink,  [socialLink.platform, socialLink.link, socialLink.platform_type, artist.id]]);
    const results = await queryMultiple([
        ...queries
    ]);

    return results.map(result => result.rows[0] as SocialLink);
}

export async function createArtistUser(user: User) {
    const insertStatementUser = `INSERT INTO users (private_mail, pwd_hash, salt, role) VALUES ('$1', '$2', '$3', '$4')`;
    const userResult = await querySingle(insertStatementUser, [user.privateMail, user.pwd_hash, user.salt, "artist"]);
    const createdUser: User = userResult.rows[0];
    console.log(userResult);
    
    return createdUser;
}