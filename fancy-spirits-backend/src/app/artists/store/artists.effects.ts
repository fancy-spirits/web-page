import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, mergeMap } from "rxjs";
import { Artist } from "src/app/entities";
import { FetchReleaseActions } from "src/app/releases/store/releases.actions";
import { APIConnectorService } from "src/app/shared/services/apiconnector.service";
import { CreateArtistActions, DeleteArtistActions, FetchArtistsActions, UpdateArtistActions } from "./artists.actions";


@Injectable()
export class ArtistEffects {
    constructor(
        private actions$: Actions, 
        private httpClient: HttpClient,
        private api: APIConnectorService
    ) {}

    fetchArtists = createEffect(() => this.actions$.pipe(
        ofType(FetchArtistsActions.FETCH_ARTISTS),
        mergeMap(() => {
            return this.httpClient.get<Artist[]>(this.api.generateURL("/artists"))
                .pipe(
                    map(artists => FetchArtistsActions.FETCH_ARTISTS_SUCCESS({ artists })),
                    // TODO
                    catchError(_error => of(FetchArtistsActions.FETCH_ARTISTS_ERROR())),
                );
        })
    ));

    createArtist = createEffect(() => this.actions$.pipe(
        ofType(CreateArtistActions.CREATE_ARTIST),
        mergeMap(({artist}) => {
            return this.httpClient.post<Artist>(this.api.generateURL("/artists"), artist)
                .pipe(
                    map(artist => CreateArtistActions.CREATE_ARTIST_SUCCESS({createdArtist: artist})),
                    catchError(_error => of(CreateArtistActions.CREATE_ARTIST_ERROR({
                        errorMsg: "Artist creation failed!"
                    })))
                );
        })
    ));

    updateArtist = createEffect(() => this.actions$.pipe(
        ofType(UpdateArtistActions.UPDATE_ARTIST),
        mergeMap(({updatedArtist, originalName}) => {
            return this.httpClient.patch<void>(this.api.generateURL(`/artists/${originalName}`), updatedArtist)
                .pipe(
                    mergeMap(() => [
                        UpdateArtistActions.UPDATE_ARTIST_SUCCESS({updatedArtist}),
                        FetchArtistsActions.FETCH_ARTISTS(),
                        FetchReleaseActions.FETCH_RELEASES()
                    ]),
                    catchError(_error => of(UpdateArtistActions.UPDATE_ARTIST_ERROR({
                        errorMsg: "Editing artist failed!"
                    })))
                );
        })
    ));

    deleteArtist = createEffect(() => this.actions$.pipe(
        ofType(DeleteArtistActions.DELETE_ARTIST),
        mergeMap(({artistName}) => {
            return this.httpClient.delete<void>(this.api.generateURL(`/artists/${artistName}`))
                .pipe(
                    mergeMap(() => [
                        DeleteArtistActions.DELETE_ARTIST_SUCCESS({artistName}),
                        FetchReleaseActions.FETCH_RELEASES()
                    ]),
                    catchError(_error => of(DeleteArtistActions.DELETE_ARTIST_ERROR({
                        errorMsg: `${artistName} could not be fired…`
                    })))
                );
        })
    ))
}