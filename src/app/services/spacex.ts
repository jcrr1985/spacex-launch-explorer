import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SpacexService {
  private localUrl = 'launches.json';

  constructor(private http: HttpClient) {}

  getPastLaunches(): Observable<any[]> {
    return this.http.get<any[]>(this.localUrl);
  }

  getLaunchById(id: string): Observable<any> {
    return this.http.get<any[]>(this.localUrl).pipe(
      map(launches => launches.find(l => l.id === id))
    );
  }
}
