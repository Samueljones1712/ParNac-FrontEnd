import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntradaVisitanteComponent } from './entrada-visitante.component';

describe('EntradaVisitanteComponent', () => {
  let component: EntradaVisitanteComponent;
  let fixture: ComponentFixture<EntradaVisitanteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntradaVisitanteComponent]
    });
    fixture = TestBed.createComponent(EntradaVisitanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
