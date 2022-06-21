import { Artist, Release, SocialLink } from "../entities";
import { queryMultiple, querySingle } from "../pg";

export async function createArtist(artist: Artist) {
    const insertStatement = `INSERT INTO artists (name, picture, biography) VALUES ($1, $2, $3)`;
    const created: Artist = await (await querySingle(insertStatement, [artist.name, artist.picture, artist.biography])).rows[0];
    return created;
}

export async function createRelease(release: Release, artists: Artist[]) {
    const insertStatementRelease = `INSERT INTO releases (name, release_date, release_type, artwork, description) VALUES ($1, $2, $3, $4)`;
    const insertStatementReleaseContribution = `INSERT INTO release_contribution (artist, release) VALUES ($1, $2)`;
    const result = await querySingle(insertStatementRelease, [release.name, release.release_date, release.release_type, release.artwork, release.description]);
    const createdRelease = result.rows[0];
    const queries: [text: string, params: any[]][] = artists.map(artist => [insertStatementReleaseContribution, [artist["id"], createdRelease["_id"]]]);
    await queryMultiple([
        ...queries
    ]);
    return createdRelease as Release;
}

export async function createSocialLinks(socialLinks: SocialLink[], artist: Artist & {id: string}) {
    const insertStatementSocialLink = `INSERT INTO social_link (platform, link, platform_type, artist) VALUES ($1, $2, $3, $4)`;
    const queries: [text: string, params: any[]][] = socialLinks.map(socialLink => [insertStatementSocialLink,  [socialLink.platform, socialLink.link, socialLink.platform_type, artist.id]]);
    const results = await queryMultiple([
        ...queries
    ]);

    return results.map(result => result.rows[0] as SocialLink);
}