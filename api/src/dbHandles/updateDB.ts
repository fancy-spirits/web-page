import { Artist, Release, SocialLink } from "../entities";
import { querySingle } from "../pg";

export async function updateArtist(artist: Partial<Artist>, name: string) {
    const queryStatementArtist = `SELECT FROM artists WHERE name = $1`;
    const existingArtistResult = await querySingle(queryStatementArtist, [name]);
    const existingArtist: Artist = existingArtistResult.rows[0];
    const updatedArtist = {
        ...{biography: artist.biography ?? existingArtist.biography},
        ...{name: artist.name ?? existingArtist.name},
        ...{picture: artist.picture ?? existingArtist.picture},
        // ...{biography: artist.socialLinks ?? existingArtist.socialLinks},
    };
    const updateStatementArtist = `UPDATE artists SET biography = $1, name = $2, picture = $3 WHERE name = $4`;
    const updatedArtistResult = await querySingle(updateStatementArtist, [updatedArtist.biography, updatedArtist.name, updatedArtist.picture, name]); 
    return updatedArtistResult.rows[0] as Artist;
}

export async function updateRelease(release: Partial<Release>, id: string) {
    const queryStatementRelease = `SELECT * FROM releases WHERE id = $1`;
    const existingReleaseResult = await querySingle(queryStatementRelease, [id]);
    const existingRelease: Release = existingReleaseResult.rows[0];
    const updatedRelease = {
        ...{name: release.name ?? existingRelease.name},
        ...{description: release.description ?? existingRelease.description},
        ...{artwork: release.artwork ?? existingRelease.artwork},
        ...{release_date: release.release_date ?? existingRelease.release_date},
        ...{release_type: release.release_type ?? existingRelease.release_type}
    };
    const updateStatementRelease = `UPDATE releases SET name = $1, description = $2, artwork = $3, release_date = $4, release_type = $5 WHERE id = $6`;
    const updatedReleaseResult = await querySingle(updateStatementRelease, [updatedRelease.name, updatedRelease.description, updatedRelease.artwork, updatedRelease.release_date, updatedRelease.release_type]);
    return updatedReleaseResult.rows[0] as Release;
}

export async function updateSocialLink(socialLink: Partial<SocialLink>, artist: Artist & {id: string}, platform: string) {
    const queryStatementSocialLink = `SELECT platform, link, platform_type FROM social_link WHERE artist = $1 AND platform = $2`;
    const existingSocialLinkResult = await querySingle(queryStatementSocialLink, [artist.id, platform]);
    const existingSocialLink: SocialLink = existingSocialLinkResult.rows[0];
    const updatedSocialLink = {
        ...{platform: socialLink.platform ?? existingSocialLink.platform},
        ...{link: socialLink.link ?? existingSocialLink.link},
        ...{platform_type: socialLink.platform_type ?? existingSocialLink.platform_type},
    };
    const updateStatementSocialLink = `UPDATE social_link SET platform = $1, link = $2, platform_type = $3 WHERE artist = $4 AND platform = $5`;
    const updatedStatementResult = await querySingle(updateStatementSocialLink, [updatedSocialLink.platform, updatedSocialLink.link, updatedSocialLink.platform_type, artist.id, platform]);
    return updatedStatementResult.rows[0] as SocialLink;
}