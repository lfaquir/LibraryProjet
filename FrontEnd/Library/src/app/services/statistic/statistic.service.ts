import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Statistic } from '../../model/statistic';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  private apiUrl = `http://localhost:5000/api/statistics`;

  constructor(private http: HttpClient) {}

  getStatistics():Observable<Statistic>{
    return this.http.get<Statistic>(`${this.apiUrl}`);
  }
}
