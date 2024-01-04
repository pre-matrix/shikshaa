import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtomicStructureComponent } from './atomic-structure.component';

describe('AtomicStructureComponent', () => {
  let component: AtomicStructureComponent;
  let fixture: ComponentFixture<AtomicStructureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AtomicStructureComponent]
    });
    fixture = TestBed.createComponent(AtomicStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
