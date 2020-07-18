import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DUMMY_RES } from './dummy';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdService {

  constructor(private http: HttpClient) { }

  public getDummyData(): Observable<any> {
    return of(DUMMY_RES);
  }

  public getDataHttp(url: string): Observable<any> {
    return this.http.get(url);
  }
}
