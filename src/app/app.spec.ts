import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing'; // ADD THIS IMPORT
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App, RouterTestingModule], // ADD RouterTestingModule HERE
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    // CORRECTED: Look for h2 with 'Navbar'
    expect(compiled.querySelector('h2')?.textContent).toContain('Navbar');
  });
});