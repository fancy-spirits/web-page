
export namespace DBSchema {
    export type ID = string;

    export interface Artist {
        id: ID;
        name: string;
        picture: any;
        biography: string;
        user: ID;
    };

    export interface SocialLink {
        id: ID;
        platform: string;
        link: string;
        platform_type: string;
    };

    export interface Release {
        id: ID;
        name: string;
        release_date: Date;
        release_type: string;
        artwork: any;
        description: string;
    };

    export interface ReleaseItem {
        id: ID;
        name: string;
        genre: string;
    };

    export interface Genre {
        id: ID;
        name: string;
    };

    export interface ReleaseContribution {
        artist: ID;
        release: ID;
        position: number;
    };

    export interface ReleaseItemContribution {
        artist: ID;
        release_item: ID;
        position: number;
    };

    export interface StreamingLinkReleaseItem {
        id: ID;
        service: string;
        link: string;
    };
    
    export interface StreamingLinkRelease {
        id: ID;
        service: string;
        link: string;
    };
}