import { ActionReducerMap } from "@ngrx/store";
import { artistReducer, ArtistState } from "../artists/store/artists.reducer";
import { releaseReducer, ReleaseState } from "../releases/store/releases.reducer";

export interface AppState {
    artists: ArtistState,
    releases: ReleaseState
};

export const appReducer: ActionReducerMap<AppState> = {
    artists: artistReducer,
    releases: releaseReducer
};