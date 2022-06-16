import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddArtistModalComponent } from './add-artist-modal.component';

describe('AddArtistModalComponent', () => {
  let component: AddArtistModalComponent;
  let fixture: ComponentFixture<AddArtistModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddArtistModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddArtistModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
