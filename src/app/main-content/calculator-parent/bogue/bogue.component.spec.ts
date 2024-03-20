import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BogueComponent } from './bogue.component';

describe('BogueComponent', () => {
  let component: BogueComponent;
  let fixture: ComponentFixture<BogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BogueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
