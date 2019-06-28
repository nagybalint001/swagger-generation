﻿/* tslint:disable */
/* eslint-disable */
//----------------------
// <auto-generated>
//     Generated using the NSwag toolchain v13.0.1.0 (NJsonSchema v10.0.19.0 (Newtonsoft.Json v11.0.0.0)) (http://NSwag.org)
// </auto-generated>
//----------------------
// ReSharper disable InconsistentNaming

import { mergeMap as _observableMergeMap, catchError as _observableCatch } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');

@Injectable({
  providedIn: 'root'
})
export class SampleDataClient {
  private http: HttpClient;
  private baseUrl: string;
  protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

  constructor(@Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
    this.http = http;
    this.baseUrl = baseUrl ? baseUrl : '';
  }

  weatherForecasts(): Observable<WeatherForecast[]> {
    let url_ = this.baseUrl + '/api/SampleData/WeatherForecasts';
    url_ = url_.replace(/[?&]$/, '');

    let options_: any = {
      observe: 'response',
      responseType: 'blob',
      headers: new HttpHeaders({
        Accept: 'application/json'
      })
    };

    return this.http
      .request('get', url_, options_)
      .pipe(
        _observableMergeMap((response_: any) => {
          return this.processWeatherForecasts(response_);
        })
      )
      .pipe(
        _observableCatch((response_: any) => {
          if (response_ instanceof HttpResponseBase) {
            try {
              return this.processWeatherForecasts(<any>response_);
            } catch (e) {
              return <Observable<WeatherForecast[]>>(<any>_observableThrow(e));
            }
          } else return <Observable<WeatherForecast[]>>(<any>_observableThrow(response_));
        })
      );
  }

  protected processWeatherForecasts(response: HttpResponseBase): Observable<WeatherForecast[]> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse
        ? response.body
        : (<any>response).error instanceof Blob
        ? (<any>response).error
        : undefined;

    let _headers: any = {};
    if (response.headers) {
      for (let key of response.headers.keys()) {
        _headers[key] = response.headers.get(key);
      }
    }
    if (status === 200) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap(_responseText => {
          let result200: any = null;
          let resultData200 = _responseText === '' ? null : JSON.parse(_responseText, this.jsonParseReviver);
          if (Array.isArray(resultData200)) {
            result200 = [] as any;
            for (let item of resultData200) result200!.push(WeatherForecast.fromJS(item));
          }
          return _observableOf(result200);
        })
      );
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(
        _observableMergeMap(_responseText => {
          return throwException('An unexpected server error occurred.', status, _responseText, _headers);
        })
      );
    }
    return _observableOf<WeatherForecast[]>(<any>null);
  }
}

export class WeatherForecast implements IWeatherForecast {
  dateFormatted?: string | undefined;
  temperatureC?: number;
  summary?: string | undefined;
  temperatureF?: number;

  constructor(data?: IWeatherForecast) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property)) (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(data?: any) {
    if (data) {
      this.dateFormatted = data['dateFormatted'];
      this.temperatureC = data['temperatureC'];
      this.summary = data['summary'];
      this.temperatureF = data['temperatureF'];
    }
  }

  static fromJS(data: any): WeatherForecast {
    data = typeof data === 'object' ? data : {};
    let result = new WeatherForecast();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === 'object' ? data : {};
    data['dateFormatted'] = this.dateFormatted;
    data['temperatureC'] = this.temperatureC;
    data['summary'] = this.summary;
    data['temperatureF'] = this.temperatureF;
    return data;
  }
}

export interface IWeatherForecast {
  dateFormatted?: string | undefined;
  temperatureC?: number;
  summary?: string | undefined;
  temperatureF?: number;
}

export class ApiException extends Error {
  message: string;
  status: number;
  response: string;
  headers: { [key: string]: any };
  result: any;

  constructor(message: string, status: number, response: string, headers: { [key: string]: any }, result: any) {
    super();

    this.message = message;
    this.status = status;
    this.response = response;
    this.headers = headers;
    this.result = result;
  }

  protected isApiException = true;

  static isApiException(obj: any): obj is ApiException {
    return obj.isApiException === true;
  }
}

function throwException(
  message: string,
  status: number,
  response: string,
  headers: { [key: string]: any },
  result?: any
): Observable<any> {
  if (result !== null && result !== undefined) return _observableThrow(result);
  else return _observableThrow(new ApiException(message, status, response, headers, null));
}

function blobToText(blob: any): Observable<string> {
  return new Observable<string>((observer: any) => {
    if (!blob) {
      observer.next('');
      observer.complete();
    } else {
      let reader = new FileReader();
      reader.onload = event => {
        observer.next((<any>event.target).result);
        observer.complete();
      };
      reader.readAsText(blob);
    }
  });
}
