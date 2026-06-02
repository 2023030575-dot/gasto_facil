import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageGastosPage } from './page-gastos.page';

describe('PageGastosPage', () => {
  let component: PageGastosPage;
  let fixture: ComponentFixture<PageGastosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PageGastosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
