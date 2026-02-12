import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable()
export class errorInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: any) => {
        // Handle the error here
        console.error('An error occurred:', error);
        // You can throw a new error or return an error response
        return throwError('An error occurred. Please try again later.');
      })
    );
  }

} 