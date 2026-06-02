import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageNewgastoPage } from './page-newgasto.page';

describe('PageNewgastoPage', () => {
  let component: PageNewgastoPage;
  let fixture: ComponentFixture<PageNewgastoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PageNewgastoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
