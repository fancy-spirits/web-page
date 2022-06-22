
type Base64String = string;

export interface Artist {
    id?: string;
    name: string;
    picture: Base64String;
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
    artwork: Base64String;
    description: string;
};

export interface ReleaseItem {

}