import { createReducer, on } from "@ngrx/store";
import { Release } from "src/app/entities";
import { CreateReleaseActions, DeleteReleaseActions, FetchReleaseActions, UpdateReleaseActions, UtilReleasesActions } from "./releases.actions";
import * as _ from "lodash";

const initialState = {
    releases: [] as Release[],
    dialog: {
        visible: false,
        mode: "add" as "add" | "edit",
        releaseToBeUpdated: undefined as Release | undefined,
        error: undefined as string | undefined,
        info: undefined as string | undefined
    }
};

export type ReleaseState = typeof initialState;


export const releaseReducer = createReducer(
    initialState,
    on(CreateReleaseActions.CREATE_RELEASE, state => state),
    on(CreateReleaseActions.CREATE_RELEASE_SUCCESS, handleCreateReleaseSuccess),
    on(CreateReleaseActions.CREATE_RELEASE_ERROR, handleCreateReleaseError),

    on(UpdateReleaseActions.UPDATE_RELEASE, state => state),
    on(UpdateReleaseActions.UPDATE_RELEASE_SUCCESS, handleUpdateReleaseSuccess),
    on(UpdateReleaseActions.UPDATE_RELEASE_ERROR, handleUpdateReleaseError),

    on(DeleteReleaseActions.DELETE_RELEASE, state => state),
    on(DeleteReleaseActions.DELETE_RELEASE_SUCCESS, handleDeleteReleaseSuccess),
    on(DeleteReleaseActions.DELETE_RELEASE_ERROR, handleDeleteReleaseError),

    on(FetchReleaseActions.FETCH_RELEASES, state => state),
    on(FetchReleaseActions.FETCH_RELEASES_SUCCESS, handleFetchReleasesSuccess),

    on(UtilReleasesActions.OPEN_RELEASE_DIALOG, handleOpenReleaseDialog),
    on(UtilReleasesActions.CANCEL_RELEASE_DIALOG, handleCancelReleaseDialog),
    on(UtilReleasesActions.SET_INFO, handleSetInfo),
    on(UtilReleasesActions.CLEAR_INFO, handleClearInfo)
);


function handleCreateReleaseSuccess(state: ReleaseState, payload: {createdRelease: Release}): ReleaseState {
    return {
        ...state,
        releases: [...state.releases, payload.createdRelease],
        dialog: {
            ...state.dialog,
            error: undefined,
            visible: false
        }
    };
}

function handleCreateReleaseError(state: ReleaseState, payload: { errorMsg: string }): ReleaseState {
    return {
        ...state,
        dialog: {
            ...state.dialog,
            error: payload.errorMsg
        }
    };
}

function handleUpdateReleaseSuccess(state: ReleaseState, payload: {updatedRelease: Partial<Release>}): ReleaseState {
    const index = state.releases.findIndex(release => release.id === payload.updatedRelease.id);
    if (index === -1) {
        return state;
    }
    const releases = [...state.releases];
    const mergedRelease = _.merge(releases[index], payload.updatedRelease);
    releases[index] = mergedRelease;
    return {
        ...state,
        releases,
        dialog: {
            ...state.dialog,
            error: undefined,
            visible: false
        }
    };
}

function handleUpdateReleaseError(state: ReleaseState, payload: { errorMsg: string }): ReleaseState {
    return {
        ...state,
        dialog: {
            ...state.dialog,
            error: payload.errorMsg
        }
    };
}

function handleDeleteReleaseSuccess(state: ReleaseState, payload: { deletedRelease: Release }): ReleaseState {
    const index = state.releases.findIndex(release => release.id === payload.deletedRelease.id);
    if (index === -1) {
        return state;
    }
    const releases = [...state.releases].splice(index, 1);
    return {
        ...state,
        releases,
        dialog: {
            ...state.dialog,
        }
    };
}

function handleDeleteReleaseError(state: ReleaseState, payload: {errorMsg: string}): ReleaseState {
    return {
        ...state,
        dialog: {
            ...state.dialog,
            error: payload.errorMsg
        }
    };
}

function handleFetchReleasesSuccess(state: ReleaseState, payload: { releases: Release[]}): ReleaseState {
    return {
        ...state,
        releases: payload.releases
    };
}

function handleOpenReleaseDialog(state: ReleaseState, payload: {mode: "add" | "edit", releaseToBeUpdated?: Release}): ReleaseState {
    return {
        ...state,
        dialog: {
            ...state.dialog,
            visible: true,
            mode: payload.mode,
            releaseToBeUpdated: payload.mode === "edit" ? payload.releaseToBeUpdated : undefined 
        }
    };
}

function handleCancelReleaseDialog(state: ReleaseState): ReleaseState {
    return {
        ...state,
        dialog: {
            ...state.dialog,
            visible: false,
            releaseToBeUpdated: undefined,
            error: undefined,
        }
    }
}

function handleSetInfo(state: ReleaseState, payload: {infoMsg: string}): ReleaseState {
    return {
        ...state,
        dialog: {
            ...state.dialog,
            info: payload.infoMsg
        }
    };
}

function handleClearInfo(state: ReleaseState): ReleaseState {
    return {
        ...state,
        dialog: {
            ...state.dialog,
            info: undefined
        }
    };
}