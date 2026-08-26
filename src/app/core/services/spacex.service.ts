import { Launch } from "@/app/core/models/launch.model";
import { environment } from "@/environments/environment";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class SpacexService {
  private localUrl = environment.apiUrl;

  private http = inject(HttpClient);

  getPastLaunches(): Observable<Launch[]> {
    return this.http.get<Launch[]>(this.localUrl);
  }

  getLaunchById(id: string): Observable<Launch | undefined> {
    return this.http
      .get<Launch[]>(this.localUrl)
      .pipe(
        map((launches) => launches.find((l) => l.flight_number === Number(id))),
      );
  }
}
