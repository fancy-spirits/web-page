type Base64String = string;

export interface Artist {
    id?: string;
    name: string;
    picture: ArrayBuffer;
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
    artwork: ArrayBuffer;
    description: string;
};

export interface User {
    id?: string;
    privateMail: string;
    pwd_hash: string;
    salt: string;
    role: string;
}

export interface Genre {
    id?: NamedCurve;
    name: string;
}

export interface ReleaseItem {

}