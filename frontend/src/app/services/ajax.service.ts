import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AjaxService {

  constructor(private httpClient: HttpClient) { }

  public ajaxpost(data, submitUrl) {
    return this.httpClient.post(environment.api_url + submitUrl, data)
      .pipe(map(response => response))
      .pipe(catchError(this._errorhandler));
  }

  public ajaxget(submitUrl) {
    return this.httpClient.get(environment.api_url + submitUrl)
      .pipe(map(response => response))
      .pipe(catchError(this._errorhandler));
  };

  public ajaxput(data, submitUrl) {
    return this.httpClient.put(environment.api_url + submitUrl, data)
      .pipe(map(response => response))
      .pipe(catchError(this._errorhandler));
  };

  private _errorhandler(error: Response) {
    return throwError(error || "some error occured");
  }
}
