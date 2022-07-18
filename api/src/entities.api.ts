type Base64String = string;

export interface Artist {
    id?: string;
    name: string;
    picture: ArrayBuffer;
    biography: string;
    socialLinks: SocialLink[];
    mail?: string;
};

export interface SocialLink {
    id?: string;
    platform: string;
    link: string;
    platform_type: string;
};

export interface Release {
    id?: string;
    name: string;
    release_date: Date;
    release_type: string;
    artwork: ArrayBuffer;
    description: string;
    tracks: {
        [trackNumber: number]: ReleaseItem
    },
    artists: {
        [position: number]: Artist
    },
    genres: string[],
    streamingLinks: StreamingLink[]
};

export interface User {
    id?: string;
    privateMail: string;
    pwd_hash: string;
    salt: string;
    role: string;
};

export interface Genre {
    id?: string;
    name: string;
};

export interface ReleaseItem {
    id?: string;
    name: string;
    genre: string;
    streamingLinks: StreamingLink[]
    artists: {
        [position: number]: Artist
    }
};

export interface StreamingLink {
    id?: string;
    service: string;
    link: string;
}