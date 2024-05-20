import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDoneComponent } from './dialog-done.component';

describe('DialogDoneComponent', () => {
  let component: DialogDoneComponent;
  let fixture: ComponentFixture<DialogDoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogDoneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
