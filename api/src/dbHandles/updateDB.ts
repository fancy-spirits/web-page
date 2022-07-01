import { jsonToBuffer } from "../bufferUtil";
import { Artist, Release, SocialLink, User } from "../entities";
import { DB } from "../pg";
import { createSocialLinks } from "./insertDB";
import { getArtistSocialLinks } from "./readDB";

const db = DB.getInstance();

export async function updateArtist(artist: Partial<Artist>, name: string) {
    if (!name) {
        throw "Artist name must be provided";
    }
    const queryStatementArtist = `SELECT * FROM artists WHERE name = $1`;
    const existingArtistResult = await db.querySingle(queryStatementArtist, [name]);
    const existingArtist: Artist = existingArtistResult.rows[0];
    
    const newPicture = !!artist.picture ? jsonToBuffer(artist.picture) : undefined;
    const updatedArtist = {
        ...{biography: artist.biography ?? existingArtist.biography},
        ...{name: artist.name ?? existingArtist.name},
        ...{picture: newPicture ?? existingArtist.picture},
        ...{socialLinks: existingArtist.socialLinks}, // No effect
    };

    // Update Mail
    if (!!artist.mail && existingArtist.mail !== artist.mail) {
        await updateUser({
            id: existingArtistResult.rows[0].user,
            privateMail: artist.mail
        });
    }

    // Update Social Links
    const existingLinks = await getArtistSocialLinks(existingArtist.name);
    await Promise.all(artist.socialLinks!.map(async link => {
        // Link exists --> gets updated
        if (existingLinks.find(existingLink => existingLink.platform === link.platform)) {
            await updateSocialLink(link, existingArtist, link.platform);
        } else {
            // Link does not exist --> gets created
            await createSocialLinks([link], existingArtist);
        }
    }))

    // Update Artist
    const updateStatementArtist = `UPDATE artists SET biography = $1, name = $2, picture = $3 WHERE name = $4`;
    const updatedArtistResult = await db.querySingle(updateStatementArtist, [updatedArtist.biography, updatedArtist.name, updatedArtist.picture, name]); 
    return updatedArtistResult.rows[0] as Artist;
}

async function updateUser(user: Partial<User>) {
    if (!user.id) {
        throw "Can't update user that has no id";
    }
    const queryStatementUser = `SELECT * FROM users WHERE id = $1`;
    const existingUserResult = await db.querySingle(queryStatementUser, [user.id]);
    const existingUser: User = existingUserResult.rows[0];

    const updatedUser: User = {
        ...{privateMail: user.privateMail ?? existingUser.privateMail},
        ...{pwd_hash: user.pwd_hash ?? existingUser.pwd_hash},
        ...{salt: user.salt ?? existingUser.salt},
        role: existingUser.role
    };
    const updateStatement = `UPDATE users SET private_mail = $1, pwd_hash = $2, salt = $3 WHERE id = $4`;
    const updatedUserResult = await db.querySingle(updateStatement, [updatedUser.privateMail, updatedUser.pwd_hash, updatedUser.salt, user.id]);
    return updatedUserResult.rows[0] as User;
}

export async function updateRelease(release: Partial<Release>, id: string) {
    const queryStatementRelease = `SELECT * FROM releases WHERE id = $1`;
    const existingReleaseResult = await db.querySingle(queryStatementRelease, [id]);
    const existingRelease: Release = existingReleaseResult.rows[0];
    const updatedRelease = {
        ...{name: release.name ?? existingRelease.name},
        ...{description: release.description ?? existingRelease.description},
        ...{artwork: release.artwork ?? existingRelease.artwork},
        ...{release_date: release.release_date ?? existingRelease.release_date},
        ...{release_type: release.release_type ?? existingRelease.release_type}
    };
    const updateStatementRelease = `UPDATE releases SET name = $1, description = $2, artwork = $3, release_date = $4, release_type = $5 WHERE id = $6`;
    const updatedReleaseResult = await db.querySingle(updateStatementRelease, [updatedRelease.name, updatedRelease.description, Buffer.from(updatedRelease.artwork), updatedRelease.release_date, updatedRelease.release_type]);
    return updatedReleaseResult.rows[0] as Release;
}

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