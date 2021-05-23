import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AjaxService {
  private jsonUrl = "https://jsonplaceholder.typicode.com"
  constructor(private httpClient: HttpClient) { }

  public ajaxpost(data, url) {
    return this.httpClient.post(this.jsonUrl + url, data)
      .pipe(map(response => response))
      .pipe(catchError(this._errorhandler));
  }

  public ajaxget(url) {
    return this.httpClient.get(this.jsonUrl + url)
    .pipe(map(response => response))
    .pipe(catchError(this._errorhandler));
  };

  public ajaxput(data, url) {
    return this.httpClient.put(this.jsonUrl + url, data)
      .pipe(map(response => response))
      .pipe(catchError(this._errorhandler));
  };

  public ajaxdelete(url) {
    return this.httpClient.delete(this.jsonUrl + url)
      .pipe(map(response => response))
      .pipe(catchError(this._errorhandler));
  };


  private _errorhandler(error: HttpErrorResponse) {
    console.log(error)
    alert(error.message)
    return throwError(error || "some error occured");
  }
}
