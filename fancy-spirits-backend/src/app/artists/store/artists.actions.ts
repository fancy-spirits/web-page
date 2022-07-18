import { createAction, props } from "@ngrx/store";
import { Artist } from "src/app/entities";

export const CreateArtistActions = {
    CREATE_ARTIST: createAction(
        "[Artists] Create artist",
        props<{artist: Artist}>()
    ),
    CREATE_ARTIST_SUCCESS: createAction(
        "[Artists] Create artist success",
        props<{createdArtist: Artist}>() 
    ),
    CREATE_ARTIST_ERROR: createAction(
        "[Artists] Create artist failed",
        props<{errorMsg: string}>()
    )
};

export const UpdateArtistActions = {
    UPDATE_ARTIST: createAction(
        "[Artists] Update artist",
        props<{updatedArtist: Partial<Artist>, originalName: string}>()
    ),
    UPDATE_ARTIST_SUCCESS: createAction(
        "[Artists] Update artist success",
        props<{updatedArtist: Artist}>()
    ),
    UPDATE_ARTIST_ERROR: createAction(
        "[Artists] Update artist failed",
        props<{errorMsg: string}>()
    )
}

export const DeleteArtistActions = {
    DELETE_ARTIST: createAction(
        "[Artists] Delete artist",
        props<{artistName: string}>()
    ),
    DELETE_ARTIST_SUCCESS: createAction(
        "[Artists] Delete artist success",
        props<{artistName: string}>()
    ),
    DELETE_ARTIST_ERROR: createAction(
        "[Artists] Delete Artist failed",
        props<{errorMsg: string}>()
    )
}

export const FetchArtistsActions = {
    FETCH_ARTISTS: createAction("[Artists] Fetch artists"),
    FETCH_ARTISTS_SUCCESS: createAction(
        "[Artists] Fetch artists success",
        props<{artists: Artist[]}>()
    ),
    FETCH_ARTISTS_ERROR: createAction(
        "[Artists] Fetch artists failed"
    )
};

export const UtilArtistsActions = {
    OPEN_ARTIST_DIALOG: createAction(
        "[Artists] Open Artist Dialog",
        props<{mode: "add" | "edit", artistToBeUpdated?: Artist}>()
    ),
    CANCEL_ARTIST_DIALOG: createAction(
        "[Artists] Cancel artist dialog"
    ),

    SET_INFO: createAction(
        "[Artists] Set Info",
        props<{infoMsg: string}>()
    ),
    CLEAR_INFO: createAction(
        "[Artists] Clear info"
    )
}
