import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export interface Config {
  heroesUrl: string;
  textfile: string;
  date: any;
}

@Injectable()
export class AppService {
  configUrl = 'assets/config.json';

  constructor(private http: HttpClient) { }

  getSensexList(limit=30, offset=0) {
    const url = `http://localhost:5000/api/v1/sensex/list?offset=${offset}&limit=${limit}`
    return this.http.get(url)
    .pipe(
      retry(2), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    );
    // const res = await this.http.get(url)
    // return res;
  }

  saveTodaysSensex(payload:any) {
    const url = `http://localhost:5000/api/v1/sensex/add`
    return this.http.post(url, payload)
    .pipe(
      retry(2), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    );
    // const res = await this.http.get(url)
    // return res;
  }

  getIp() {
    const url = `http://localhost:5000/api/v1/sensex/add`
    return this.http.get("http://api.ipify.org/?format=json")
    .pipe(
      retry(2), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    );
    // const res = await this.http.get(url)
    // return res;
  }

  // this.http.get("http://api.ipify.org/?format=json").subscribe((res: any) => {
  //   this.ipAddress = res.ip;
  // });

  getConfigResponse(): Observable<HttpResponse<Config>> {
    return this.http.get<Config>(
      this.configUrl, { observe: 'response' });
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }

  makeIntentionalError() {
    return this.http.get('not/a/real/url')
      .pipe(
        catchError(this.handleError)
      );
  }

}
