import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageResumePage } from './page-resume.page';

describe('PageResumePage', () => {
  let component: PageResumePage;
  let fixture: ComponentFixture<PageResumePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PageResumePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
