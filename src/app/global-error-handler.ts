import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    // Log the error to console for development
    console.error('Global Error Handler:', error);

    // In production, you could send the error to a logging service
    // Example: this.loggingService.logError(error);
  }
}