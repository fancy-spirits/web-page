import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationPaneComponent } from './navigation-pane.component';

describe('NavigationPaneComponent', () => {
  let component: NavigationPaneComponent;
  let fixture: ComponentFixture<NavigationPaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavigationPaneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavigationPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
