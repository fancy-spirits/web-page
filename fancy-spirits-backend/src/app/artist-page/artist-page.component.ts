import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { APIConnectorService } from '../apiconnector.service';
import { Artist } from '../entities';
import { ImageCoderService } from '../image-coder.service';
import socialMediaIcons from "../socialMedia";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-artist-page',
  templateUrl: './artist-page.component.html',
  styleUrls: ['./artist-page.component.scss']
})
export class ArtistPageComponent implements OnInit {
  toBase64 = this.imageCoderService.toBase64;
  getSocialMediaIcon = socialMediaIcons.get;

  artists: Artist[] = [];

  addArtistModalVisible = false;

  constructor(
    private httpClient: HttpClient, 
    private api: APIConnectorService, 
    private imageCoderService: ImageCoderService,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.loadArtists();
  }

  onNewArtist(){
    this.addArtistModalVisible = true;
  }

  loadArtists = () => {
    this.httpClient.get(this.api.generateURL("/artists"), {observe: "body"}, )
      .subscribe({
        next: body => {
          this.artists = body as Artist[];
          console.log(this.artists);
        },
        error: _error => console.log("Artists could not be loaded")
      });
  }

  onArtistCreated = (success: boolean) => {
    if (!success) {
      alert("Creation failed");
    }
    this.loadArtists();
  }

  getSocialLinks(artist: Artist) {
    return artist.socialLinks.filter(link => link.platform_type === "social");
  }
  
  getStreamingLinks(artist: Artist) {
    return artist.socialLinks.filter(link => link.platform_type === "streaming");
  }
}
