import { faSpotify, faItunes, faDeezer, faSoundcloud, faYoutube, faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

const streaming = [
    {
        key: "spotify",
        icon: faSpotify
    },
    {
        key: "appleMusic",
        icon: faItunes
    },
    {
        key: "deezer",
        icon: faDeezer
    },
    {
        key: "soundcloud",
        icon: faSoundcloud
    },
    {
        key: "youtube",
        icon: faYoutube
    },
];

const social = [
    {
        key: "web",
        icon: faGlobe
    },
    {
        key: "facebook",
        icon: faFacebook
    },
    {
        key: "twitter",
        icon: faTwitter
    },
    {
        key: "instagram",
        icon: faInstagram
    },
];

function get(key: string) {
    return [...streaming, ...social].find(link => link.key === key);
}

export default {
    get,
    social,
    streaming
};