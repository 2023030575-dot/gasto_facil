import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageScanPage } from './page-scan.page';

describe('PageScanPage', () => {
  let component: PageScanPage;
  let fixture: ComponentFixture<PageScanPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PageScanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
