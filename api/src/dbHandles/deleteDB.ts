import { Artist, Release } from "../entities.api";
import { getArtist } from "./readDB";
import { DB } from "../pg";
import { DBSchema } from "../entities.db";

const db = DB.getInstance();

export async function deleteArtistSafe(name: string) {
    try {
        await db.startTransaction();

        const queryStatementArtist = `SELECT * FROM artists WHERE name = $1`;
        const artist = (await db.querySingleTyped<DBSchema.Artist>(queryStatementArtist, [name]))[0];
        
        // Delete Artist
        const deleteStatementArtist = `DELETE FROM artists WHERE name = $1`;
        await db.querySingleTyped<void>(deleteStatementArtist, [name]);

        // Delete Social Links
        const deleteStatementSocialLinks = `DELETE FROM social_link WHERE artist = $1`;
        await db.querySingleTyped<void>(deleteStatementSocialLinks, [artist.id]);

        // Delete Release Contributions
        const deleteStatementReleaseContributions = `DELETE FROM release_contribution WHERE artist = $1`;
        await db.querySingleTyped<void>(deleteStatementReleaseContributions, [artist.id]);
        
        // Delete Release Item Contributions
        const deleteStatementReleaseItemContributions = `DELETE FROM release_item_contribution WHERE artist = $1`;
        await db.querySingleTyped<void>(deleteStatementReleaseItemContributions, [artist.id]);
    
        const readStatementOrphanReleases = `SELECT id FROM releases WHERE id NOT IN (SELECT release FROM release_contribution)`;
        const orphanReleases = await db.querySingleTyped<DBSchema.Release>(readStatementOrphanReleases, []);
        await Promise.all(orphanReleases.map(async release => await deleteReleaseSafe(release.id, true)));
        
        await db.endTransaction();
    } catch (e) {
        await db.rollback();
        throw e;
    }
}

export async function deleteReleaseSafe(id: string, keepTransaction = false) {
    try {
        if (!keepTransaction) {
            await db.startTransaction();
        }

        // Delete Release
        const deleteStatementRelease = `DELETE FROM releases WHERE id = $1`;
        await db.querySingleTyped<void>(deleteStatementRelease, [id]);

        // Delete Release Items
        const deleteStatementReleaseItem = `DELETE FROM release_items WHERE release = $1`;
        await db.querySingleTyped<void>(deleteStatementReleaseItem, [id]);
        
        // Remove orphan release items
        const deleteStatementOrphanReleaseItems = `DELETE FROM release_items WHERE id NOT IN (SELECT release_item FROM release_item_contribution)`;
        await db.querySingleTyped<{id: string}>(deleteStatementOrphanReleaseItems, []);
        
        // Remove orphan streaming links
        const deleteStatementOrphanReleaseStreamingLinks = `DELETE FROM streaming_link_release WHERE release NOT IN (SELECT id FROM releases)`;
        await db.querySingleTyped<{id: string}>(deleteStatementOrphanReleaseStreamingLinks, []);
        const deleteStatementOrphanReleaseItemStreamingLinks = `DELETE FROM streaming_link WHERE release_item NOT IN (SELECT id FROM release_items)`;
        await db.querySingleTyped<{id: string}>(deleteStatementOrphanReleaseItemStreamingLinks, []);

        if (!keepTransaction) {
            await db.endTransaction();
        }
    } catch (e) {
        if (!keepTransaction)
            await db.rollback();
        throw e;
    }
}

export async function deleteSocialLink(artistName: string, platform: string) {
    const deleteStatementSocialLink = `DELETE FROM social_link WHERE artist_name = $1 AND platform = $2`;
    await db.querySingleTyped<void>(deleteStatementSocialLink, [artistName, platform]);
}