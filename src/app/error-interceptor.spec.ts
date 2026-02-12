   import { TestBed } from '@angular/core/testing';
   import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
   import { HttpClientTestingModule, HttpTestingController } from
   '@angular/common/http/testing';
   import { errorInterceptor } from './error-interceptor';

   describe('errorInterceptor', () => {
     let http: HttpClient;
     let httpMock: HttpTestingController;

     beforeEach(() => {
       TestBed.configureTestingModule({
         imports: [HttpClientTestingModule], // ADD THIS IMPORT
         providers: [
           { provide: HTTP_INTERCEPTORS, useClass: errorInterceptor, multi: true },
         ],
       });

       http = TestBed.inject(HttpClient);
       httpMock = TestBed.inject(HttpTestingController);
     });

     afterEach(() => {
       httpMock.verify(); // Ensures no outstanding requests after each test
     });


   });