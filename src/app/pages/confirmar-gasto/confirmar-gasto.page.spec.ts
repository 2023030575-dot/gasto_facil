import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmarGastoPage } from './confirmar-gasto.page';

describe('ConfirmarGastoPage', () => {
  let component: ConfirmarGastoPage;
  let fixture: ComponentFixture<ConfirmarGastoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmarGastoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
