import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DUMMY_RES } from './dummy';
import { AdPoint } from './adpoint';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdService {  

  constructor(private http: HttpClient) { }

  getData(): Observable<AdPoint[]> {
    return of(DUMMY_RES);
  }
}
