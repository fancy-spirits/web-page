import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistBoxComponent } from './artist-box.component';

describe('ArtistBoxComponent', () => {
  let component: ArtistBoxComponent;
  let fixture: ComponentFixture<ArtistBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArtistBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtistBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
