import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogInprogressComponent } from './dialog-inprogress.component';

describe('DialogInprogressComponent', () => {
  let component: DialogInprogressComponent;
  let fixture: ComponentFixture<DialogInprogressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogInprogressComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogInprogressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
