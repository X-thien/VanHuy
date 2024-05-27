import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInfoPlaylistComponent } from './edit-info-playlist.component';

describe('EditInfoPlaylistComponent', () => {
  let component: EditInfoPlaylistComponent;
  let fixture: ComponentFixture<EditInfoPlaylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditInfoPlaylistComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditInfoPlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
