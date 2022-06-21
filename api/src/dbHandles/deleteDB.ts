import { Artist, Release } from "../entities";
import { queryMultiple, querySingle } from "../pg";
import { getArtist } from "./readDB";

export async function deleteArtistSafe(name: string) {
    const artist: Artist = (await getArtist(name))!;
    const deleteStatementArtist = `DELETE FROM artists WHERE name = $1`;
    const deleteStatementSocialLinks = `DELETE FROM social_link WHERE artist = $1`;
    const deleteStatementReleaseContributions = `DELETE FROM release_contribution WHERE artist = $1`;

    await queryMultiple([
        [deleteStatementArtist, [artist.name]],
        [deleteStatementSocialLinks, [artist.id!]],
        [deleteStatementReleaseContributions, [artist.id!]]
    ]);

    const readStatementOrphanReleases = `SELECT id FROM releases WHERE id NOT IN (SELECT release FROM release_contribution)`;
    const orphanReleasesResult = await querySingle(readStatementOrphanReleases, []);
    const orphanReleases = orphanReleasesResult.rows.map(release => release as Release);
    await Promise.all(orphanReleases.map(async release => await deleteReleaseSafe(release.id!)));
}

export async function deleteReleaseSafe(id: string) {
    const deleteStatementRelease = `DELETE FROM releases WHERE id = $1`;
    const deleteStatementReleaseItem = `DELETE FROM release_items WHERE release = $1`;

    await queryMultiple([
        [deleteStatementRelease, [id]],
        [deleteStatementReleaseItem, [id]],
    ]);
}

export async function deleteSocialLink(artistName: string, platform: string) {
    const deleteStatementSocialLink = `DELETE FROM social_link WHERE artist_name = $1 AND platform = $2`;
    await querySingle(deleteStatementSocialLink, [artistName, platform]);
}