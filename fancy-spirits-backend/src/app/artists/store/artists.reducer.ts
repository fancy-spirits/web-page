import { createReducer, on } from "@ngrx/store";
import { Artist } from "src/app/entities";
import { CreateArtistActions, FetchArtistsActions, UpdateArtistActions, DeleteArtistActions, UtilArtistsActions } from "./artists.actions";

const initialState = {
    artists: [] as Artist[],
    dialog: {
        visible: false,
        mode: "add" as "add" | "edit",
        artistToBeUpdated: undefined as Artist | undefined,
        error: undefined as string | undefined,
        info: undefined as string | undefined
    }
};

export type ArtistState = typeof initialState;


export const artistReducer = createReducer(
    initialState,
    on(CreateArtistActions.CREATE_ARTIST, state => state),
    on(CreateArtistActions.CREATE_ARTIST_SUCCESS, handleCreateArtistSuccess),
    on(CreateArtistActions.CREATE_ARTIST_ERROR, handleCreateArtistError),

    on(UpdateArtistActions.UPDATE_ARTIST, state => state),
    on(UpdateArtistActions.UPDATE_ARTIST_SUCCESS, handleUpdateArtistSuccess),
    on(UpdateArtistActions.UPDATE_ARTIST_ERROR, handleUpdateArtistError),

    on(DeleteArtistActions.DELETE_ARTIST, state => state),
    on(DeleteArtistActions.DELETE_ARTIST_SUCCESS, handleDeleteArtistSuccess),
    on(DeleteArtistActions.DELETE_ARTIST_ERROR, handleDeleteArtistError),

    on(FetchArtistsActions.FETCH_ARTISTS, state => state),
    on(FetchArtistsActions.FETCH_ARTISTS_SUCCESS, handleFetchArtistsSuccess),

    on(UtilArtistsActions.OPEN_ARTIST_DIALOG, handleOpenArtistDialog),
    on(UtilArtistsActions.CANCEL_ARTIST_DIALOG, handleCancelArtistDialog),
    on(UtilArtistsActions.SET_INFO, handleSetInfo),
    on(UtilArtistsActions.CLEAR_INFO, handleClearInfo)
);

function handleFetchArtistsSuccess(state: ArtistState, payload: {artists: Artist[]}): ArtistState {
    return {
        ...state,
        artists: payload.artists
    };
}

function handleCreateArtistSuccess(state: ArtistState, payload: {createdArtist: Artist}): ArtistState {
    return {
        ...state,
        artists: [...state.artists, payload.createdArtist],
        dialog: {
            ...state.dialog,
            error: undefined,
            visible: false
        }
    };
}

function handleCreateArtistError(state: ArtistState, payload: {errorMsg: string}): ArtistState {
    return {
        ...state,
        dialog: {
            ...state.dialog,
            error: payload.errorMsg
        }
    };
}

function handleUpdateArtistSuccess(state: ArtistState, payload: {updatedArtist: Artist}): ArtistState {
    const index = state.artists.findIndex(({id}) => id === payload.updatedArtist.id);
    if (index === -1) {
        return state;
    }
    const artists = [...state.artists];
    artists[index] = payload.updatedArtist;
    return {
        ...state,
        artists,
        dialog: {
            ...state.dialog,
            error: undefined,
            visible: false
        }
    };
}

function handleUpdateArtistError(state: ArtistState, payload: {errorMsg: string}): ArtistState {
    return {
        ...state,
        dialog: {
            ...state.dialog,
            error: payload.errorMsg
        }
    };
}

function handleDeleteArtistSuccess(state: ArtistState, payload: {artistName: string}): ArtistState {
    const index = state.artists.findIndex(({name}) => name === payload.artistName);
    if (index === -1) {
        return state;
    }
    const artists = [...state.artists].splice(index, 1);
    return {
        ...state,
        artists,
        dialog: {
            ...state.dialog,
            info: `${payload.artistName} was fired sucessfully`
        }
    };
}

function handleDeleteArtistError(state: ArtistState, payload: {errorMsg: string}): ArtistState {
    return {
        ...state,
        dialog: {
            ...state.dialog,
            error: payload.errorMsg
        }
    };
}

function handleOpenArtistDialog(state: ArtistState, payload: {mode: "add" | "edit", artistToBeUpdated?: Artist}): ArtistState {
    return {
        ...state,
        dialog: {
            ...state.dialog,
            visible: true,
            mode: payload.mode,
            artistToBeUpdated: payload.mode === "edit" ? payload.artistToBeUpdated : undefined 
        }
    };
}

function handleCancelArtistDialog(state: ArtistState): ArtistState {
    return {
        ...state,
        dialog: {
            ...state.dialog,
            visible: false,
            artistToBeUpdated: undefined,
            error: undefined,
        }
    }
}

function handleSetInfo(state: ArtistState, payload: {infoMsg: string}): ArtistState {
    return {
        ...state,
        dialog: {
            ...state.dialog,
            info: payload.infoMsg
        }
    };
}

function handleClearInfo(state: ArtistState): ArtistState {
    return {
        ...state,
        dialog: {
            ...state.dialog,
            info: undefined
        }
    };
}