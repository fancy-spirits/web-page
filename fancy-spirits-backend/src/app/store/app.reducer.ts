import { ActionReducerMap } from "@ngrx/store";
import { artistReducer, ArtistState } from "../artists/store/artists.reducer";

export interface AppState {
    artists: ArtistState,
};

export const appReducer: ActionReducerMap<AppState> = {
    artists: artistReducer
};