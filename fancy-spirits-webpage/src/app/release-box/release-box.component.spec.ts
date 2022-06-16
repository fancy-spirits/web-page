import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseBoxComponent } from './release-box.component';

describe('ReleaseBoxComponent', () => {
  let component: ReleaseBoxComponent;
  let fixture: ComponentFixture<ReleaseBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReleaseBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReleaseBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
