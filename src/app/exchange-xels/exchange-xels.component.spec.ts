import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeXelsComponent } from './exchange-xels.component';

describe('ExchangeXelsComponent', () => {
  let component: ExchangeXelsComponent;
  let fixture: ComponentFixture<ExchangeXelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExchangeXelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeXelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
