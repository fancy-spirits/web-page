import { createAction, props } from "@ngrx/store";
import { Release, ReleaseItem } from "src/app/entities";

export const CreateReleaseActions = {
    CREATE_RELEASE: createAction(
        "[Releases] Create release",
        props<{release: Release}>()
    ),
    CREATE_RELEASE_SUCCESS: createAction(
        "[Releases] Create release success",
        props<{createdRelease: Release}>()
    ),
    CREATE_RELEASE_ERROR: createAction(
        "[Releases] Create release failed",
        props<{errorMsg: string}>()
    )
};

export const UpdateReleaseActions = {
    UPDATE_RELEASE: createAction(
        "[Releases] Update release",
        props<{release: Release}>()
    ),
    UPDATE_RELEASE_SUCCESS: createAction(
        "[Releases] Update release success",
        props<{updatedRelease: Release}>()
    ),
    UPDATE_RELEASE_ERROR: createAction(
        "[Releases] Update release failed",
        props<{errorMsg: string}>()
    )
};

export const DeleteReleaseActions = {
    DELETE_RELEASE: createAction(
        "[Releases] Delete Release",
        props<{release: Release}>()
    ),
    DELETE_RELEASE_SUCCESS: createAction(
        "[Releases] Delete Release success",
        props<{deletedRelease: Release}>()
    ),
    DELETE_RELEASE_ERROR: createAction(
        "[Releases] Delete Release failed",
        props<{errorMsg: string}>()
    )
};

export const FetchReleaseActions = {
    FETCH_RELEASES: createAction(
        "[Releases] Fetch releases"
    ),
    FETCH_RELEASES_SUCCESS: createAction(
        "[Releases] Fetch releases success",
        props<{releases: Release[]}>()
    ),
    FETCH_RELEASES_ERROR: createAction(
        "[Releases] Fetch releases failed"
    )
};

export const UtilReleasesActions = {
    OPEN_RELEASE_DIALOG: createAction(
        "[Releases] Open Release Dialog",
        props<{mode: "add" | "edit", releaseToBeUpdated?: Release}>()
    ),
    CANCEL_RELEASE_DIALOG: createAction(
        "[Releases] Cancel Release dialog"
    ),

    SET_INFO: createAction(
        "[Releases] Set Info",
        props<{infoMsg: string}>()
    ),
    CLEAR_INFO: createAction(
        "[Releases] Clear info"
    )
}