
export type Base64String = string;

export interface Artist {
    id?: string;
    name: string;
    picture: ArrayBuffer;
    biography: string;
    socialLinks: SocialLink[];
    mail: string;
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
};

export interface ReleaseItem {
    id?: string;
    name: string;
    genre: string;
}