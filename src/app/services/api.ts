import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ui } from './ui';

@Injectable({
  providedIn: 'root',
})
export class Api {
  // private baseURL: string = 'https://myexpressapr2026new-production.up.railway.app/api';
  private baseURL: string = 'http://localhost:3000/api';
  constructor(
    private http: HttpClient,
    private ui: Ui,
  ) {}

  httpGet(path: string) {
    let headers = { headers: new HttpHeaders() };
    let fullURL: string = this.baseURL + path;
    return new Promise((resolve, reject) => {
      this.http.get(fullURL, headers).subscribe({
        next: (response: any) => {
          resolve(response);
        },
        error: (error: any) => {
          this.handleAuthError(error);
          reject(error);
        },
      });
    });
  }

  private handleAuthError(error: any) {
    if (error && (error.status === 401 || error.status === 403)) {
      this.ui.openSnackBar('Please login', 'OK');
    }
  }

  httpPost(path: string, payload: any, method?: string) {
    let fullURL: string = this.baseURL + path;
    let headers = { headers: new HttpHeaders() };
    let token: string =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsImVtYWlsIjoiaHVtYW5AbWFpbC5jb20iLCJpYXQiOjE3NzgxNjk1MTcsImV4cCI6MTc3ODE3MzExN30.C_K26GFWHTo1fzcYdKqViEUtU_a_JOZl5v-n0-Foufs';
    payload = { ...payload, user_id: 1 };

    if (token) {
      headers = {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }).set('Content-Type', 'application/json'),
      };
    }
    return new Promise((resolve, reject) => {
      if (method == 'put') {
        this.http.put(fullURL, payload, headers).subscribe({
          next: (response: any) => {
            resolve(response);
          },
          error: (error: any) => {
            this.handleAuthError(error);
            reject(error);
          },
        });
      } else if (method == 'delete') {
        this.http.delete(fullURL, headers).subscribe({
          next: (response: any) => {
            resolve(response);
          },
          error: (error: any) => {
            this.handleAuthError(error);
            reject(error);
          },
        });
      } else {
        this.http.post(fullURL, payload, headers).subscribe({
          next: (response: any) => {
            resolve(response);
          },
          error: (error: any) => {
            this.handleAuthError(error);
            reject(error);
          },
        });
      }
    });
  }
}
