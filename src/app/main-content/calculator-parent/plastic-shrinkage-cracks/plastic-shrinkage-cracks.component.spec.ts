import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlasticShrinkageCracksComponent } from './plastic-shrinkage-cracks.component';

describe('PlasticShrinkageCracksComponent', () => {
  let component: PlasticShrinkageCracksComponent;
  let fixture: ComponentFixture<PlasticShrinkageCracksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlasticShrinkageCracksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlasticShrinkageCracksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
