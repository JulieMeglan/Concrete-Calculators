import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TcpowersComponent } from './tcpowers.component';

describe('TcpowersComponent', () => {
  let component: TcpowersComponent;
  let fixture: ComponentFixture<TcpowersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TcpowersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TcpowersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
