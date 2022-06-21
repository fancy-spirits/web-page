
export interface Artist {
    id?: string;
    name: string;
    picture: Buffer;
    biography: string;
    socialLinks: SocialLink[];
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
    artwork: Buffer;
    description: string;
};

export interface ReleaseItem {

}