import { jsonToBuffer } from "../bufferUtil";
import { Artist, Release, SocialLink, User } from "../entities.api";
import { DBSchema } from "../entities.db";
import { DB } from "../pg";

const db = DB.getInstance();

export async function updateArtist(artist: Partial<Artist>, name: string) {
    try {
        await db.startTransaction();
        if (!name) {
            throw "Artist name must be provided";
        }
        const queryStatementArtist = `SELECT id, name, picture, biography, u.private_mail as mail FROM artists LEFT JOIN users as u ON u.id = "user" WHERE name = $1`;
        const existingArtistResult = await db.querySingleTyped<DBSchema.Artist & {mail: string}>(queryStatementArtist, [name]);
        const existingArtist = existingArtistResult[0];
        
        const newPicture = !!artist.picture ? jsonToBuffer(artist.picture) : undefined;
        const updatedArtist = {
            ...{biography: artist.biography ?? existingArtist.biography},
            ...{name: artist.name ?? existingArtist.name},
            ...{picture: newPicture ?? existingArtist.picture},
        };
    
        // Update Mail
        if (!!artist.mail && existingArtist.mail !== artist.mail) {
            await db.querySingleTyped<DBSchema.User>(
                `UPDATE users SET private_mail = $1 WHERE private_mail = $2`,
                [
                    artist.mail,
                    existingArtist.mail
                ]
            );
        }
    
        if (!!artist.socialLinks && artist.socialLinks.length > 0) {
            // Replace Social Links if they are appended
            const deleteStatementSocialLinks = `DELETE FROM social_link WHERE artist = $1`;
            await db.querySingleTyped<void>(deleteStatementSocialLinks, [existingArtist.id]);

            const insertStatementSocialLinks = `INSERT INTO social_link (platform, link, platform_type, artist) VALUES ($1, $2, $3, $4) RETURNING *`;
            const newSocialLinks = (await Promise.all(artist.socialLinks.map(async link => {
                return db.querySingleTyped<DBSchema.SocialLink>(insertStatementSocialLinks, [
                    link.platform,
                    link.link,
                    link.platform_type,
                    artist.id
                ]);
            })))[0];
        }
    
        // Update Artist
        const updateStatementArtist = `UPDATE artists SET biography = $1, name = $2, picture = $3 WHERE name = $4`;
        const updatedArtistResult = await db.querySingleTyped<DBSchema.Artist>(updateStatementArtist, [updatedArtist.biography, updatedArtist.name, updatedArtist.picture, name]); 
        
        await db.endTransaction();
        return updatedArtistResult[0];
    } catch (e) {
        await db.rollback();
        throw e;
    }
}

/**
 * @todo
 */
async function updateUser(user: Partial<User>): Promise<User> {
    if (!user.id) {
        throw "Can't update user that has no id";
    }
    const queryStatementUser = `SELECT * FROM users WHERE id = $1`;
    const existingUserResult = await db.querySingleTyped<DBSchema.User>(queryStatementUser, [user.id]);
    const existingUser = existingUserResult[0];

    const updatedUser: User = {
        ...{privateMail: user.privateMail ?? existingUser.private_mail},
        ...{pwd_hash: user.pwd_hash ?? existingUser.pwd_hash},
        ...{salt: user.salt ?? existingUser.salt},
        role: existingUser.role
    };
    const updateStatement = `UPDATE users SET private_mail = $1, pwd_hash = $2, salt = $3 WHERE id = $4`;
    const updatedUserResult = await db.querySingleTyped<DBSchema.User>(updateStatement, [updatedUser.privateMail, updatedUser.pwd_hash, updatedUser.salt, user.id]);
    return {
        ...updatedUserResult[0],
        privateMail: updatedUserResult[0].private_mail
    };
}

/**
 * @todo
 */
export async function updateRelease(release: Partial<Release>, id: string) {
    try {
        await db.startTransaction();
        const queryStatementRelease = `SELECT * FROM releases WHERE id = $1`;
        const existingReleaseResult = await db.querySingleTyped<DBSchema.Release>(queryStatementRelease, [id]);
        const existingRelease = existingReleaseResult[0];
        const updatedRelease = {
            ...{name: release.name ?? existingRelease.name},
            ...{description: release.description ?? existingRelease.description},
            ...{artwork: release.artwork ?? existingRelease.artwork},
            ...{release_date: release.release_date ?? existingRelease.release_date},
            ...{release_type: release.release_type ?? existingRelease.release_type}
        };
        const updateStatementRelease = `UPDATE releases SET name = $1, description = $2, artwork = $3, release_date = $4, release_type = $5 WHERE id = $6`;
        const updatedReleaseResult = await db.querySingleTyped<DBSchema.Release>(updateStatementRelease, [updatedRelease.name, updatedRelease.description, Buffer.from(updatedRelease.artwork), updatedRelease.release_date, updatedRelease.release_type]);
        
        // TODO: Streaming Links (Release/release item), release items, artists(Release/release item), genre(releaseItem)


        await db.endTransaction();
        return updatedReleaseResult[0] as Release;
    } catch (e) {
        await db.rollback();
        throw e;
    }
}

/**
 * @deprecated
 */
export async function updateSocialLink(socialLink: Partial<SocialLink>, artist: Artist, platform: string) {
    if (!artist.id) {
        throw "Artist ID is required";
    }
    const queryStatementSocialLink = `SELECT platform, link, platform_type FROM social_link WHERE artist = $1 AND platform = $2`;
    const existingSocialLinkResult = await db.querySingle(queryStatementSocialLink, [artist.id, platform]);
    const existingSocialLink: SocialLink = existingSocialLinkResult.rows[0];
    const updatedSocialLink = {
        ...{platform: socialLink.platform ?? existingSocialLink.platform},
        ...{link: socialLink.link ?? existingSocialLink.link},
        ...{platform_type: socialLink.platform_type ?? existingSocialLink.platform_type},
    };
    const updateStatementSocialLink = `UPDATE social_link SET platform = $1, link = $2, platform_type = $3 WHERE artist = $4 AND platform = $5`;
    const updatedStatementResult = await db.querySingle(updateStatementSocialLink, [updatedSocialLink.platform, updatedSocialLink.link, updatedSocialLink.platform_type, artist.id, platform]);
    return updatedStatementResult.rows[0] as SocialLink;
}