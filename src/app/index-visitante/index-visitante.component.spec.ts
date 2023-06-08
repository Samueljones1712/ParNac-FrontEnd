import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexVisitanteComponent } from './index-visitante.component';

describe('IndexVisitanteComponent', () => {
  let component: IndexVisitanteComponent;
  let fixture: ComponentFixture<IndexVisitanteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndexVisitanteComponent]
    });
    fixture = TestBed.createComponent(IndexVisitanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
