import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricMortarAndMixComponent } from './metric-mortar-and-mix.component';

describe('MetricMortarAndMixComponent', () => {
  let component: MetricMortarAndMixComponent;
  let fixture: ComponentFixture<MetricMortarAndMixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetricMortarAndMixComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MetricMortarAndMixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
