import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, of, mergeMap, map } from "rxjs";
import { Release } from "src/app/entities";
import { APIConnectorService } from "src/app/shared/services/apiconnector.service";
import { CreateReleaseActions, DeleteReleaseActions, FetchReleaseActions, UpdateReleaseActions } from "./releases.actions";

@Injectable()
export class ReleasesEffects {
    constructor(
        private actions$: Actions, 
        private httpClient: HttpClient,
        private api: APIConnectorService
    ) {}

    fetchReleases = createEffect(() => this.actions$.pipe(
        ofType(FetchReleaseActions.FETCH_RELEASES),
        mergeMap(() => {
            return this.httpClient.get<Release[]>(this.api.generateURL("/releases"))
                .pipe(
                    map(releases => FetchReleaseActions.FETCH_RELEASES_SUCCESS({ releases })),
                    catchError(_error => of(FetchReleaseActions.FETCH_RELEASES_ERROR()))
                );
        })
    ));

    createRelease = createEffect(() => this.actions$.pipe(
        ofType(CreateReleaseActions.CREATE_RELEASE),
        mergeMap(({release}) => {
            return this.httpClient.post<Release>(this.api.generateURL("/releases"), release)
                .pipe(
                    map(createdRelease => CreateReleaseActions.CREATE_RELEASE_SUCCESS({createdRelease})),
                    catchError(_error => of(CreateReleaseActions.CREATE_RELEASE_ERROR({
                        errorMsg: "Creation failed!"
                    })))
                );
        })
    ));

    updateRelease = createEffect(() => this.actions$.pipe(
        ofType(CreateReleaseActions.CREATE_RELEASE),
        mergeMap(({release}) => {
            return this.httpClient.patch<Release>(this.api.generateURL(`/releases/${release.id}`), release)
                .pipe(
                    map(updatedRelease => UpdateReleaseActions.UPDATE_RELEASE_SUCCESS({updatedRelease})),
                    catchError(_error => of(UpdateReleaseActions.UPDATE_RELEASE_ERROR({
                        errorMsg: "Editing release failed!"
                    })))
                );
        })
    ));

    deleteRelease = createEffect(() => this.actions$.pipe(
        ofType(DeleteReleaseActions.DELETE_RELEASE),
        mergeMap(({release}) => {
            return this.httpClient.delete<void>(this.api.generateURL(`releases/${release.id}`))
                .pipe(
                    map(() => DeleteReleaseActions.DELETE_RELEASE_SUCCESS({deletedRelease: release})),
                    catchError(_error => of(DeleteReleaseActions.DELETE_RELEASE_ERROR({
                        errorMsg: "Could not delete release!"
                    })))
                );
        })
    ));
}