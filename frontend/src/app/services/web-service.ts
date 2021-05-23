import { Injectable } from '@angular/core';
import {
    AjaxService
  } from './ajax.service';

  import { ToastrService } from 'ngx-toastr';

export interface ResultType {
  type: string,
  message: string,
  result: any,
  code: Number
}

export let log = console.log

@Injectable({
  providedIn: 'root'
})



export class webService {
  constructor(private toastyService: ToastrService, private AjaxService: AjaxService) { }
    public apicall (data, url: String, ifHandleError: boolean, ifSuccessToast: boolean = false){
    return new Promise((resolve, reject) => {
      this.AjaxService.ajaxpost(data, url)
        .subscribe(
          (datas: ResultType) => {
            if (datas.code < 400) {
              if (ifSuccessToast)
                this.toastyService[`${datas.type}`](datas.message)

              resolve(datas)
            }
            else {
              log(datas.result)

              if (ifHandleError)
                reject(datas)
              else {
                this.toastyService[`${datas.type}`](datas.message)
                resolve(datas)
              }
            }
          },
          (err) => {
            let datas = err.error
            log(err)
            if(err.error.message)
            {
              if (ifHandleError)
                reject(datas)
              else {
                this.toastyService[`${datas.type}`](datas.message)
                resolve(datas)
              }
            }
            else
            {
              log(err)
              let errMsg = {
                type: "error",
                message: err.name,
                result: ifHandleError ? err : [],
                code: err.status
              }
              if (ifHandleError)
                reject(errMsg)
              else
                resolve(errMsg)

            }
          }
        );
    });
  }

  public apiGet (url: String, ifHandleError: boolean, ifSuccessToast: boolean = false){
    return new Promise((resolve, reject) => {
      this.AjaxService.ajaxget(url)
        .subscribe(
          (datas: ResultType) => {
            if (datas.code < 400) {
              if (ifSuccessToast)
                this.toastyService[`${datas.type}`](datas.message)

              resolve(datas)
            }
            else {
              log(datas.result)

              if (ifHandleError)
                reject(datas)
              else {
                this.toastyService[`${datas.type}`](datas.message)
                resolve(datas)
              }
            }
          },
          (err) => {
            let datas = err.error
            log(datas)
            if(err.error.message)
            {
              if (ifHandleError)
                reject(datas)
              else {
                this.toastyService[`${datas.type}`](datas.message)
                resolve(datas)
              }
            }
            else
            {
              log(err)
              let errMsg = {
                type: "error",
                message: err.name,
                result: ifHandleError ? err : [],
                code: err.status
              }
              if (ifHandleError)
                reject(errMsg)
              else
                resolve(errMsg)

            }
          }
        );
    });
  }

}

