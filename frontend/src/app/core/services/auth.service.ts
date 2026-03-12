import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginDto, RegisterDto, User } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = `${environment.apiUrl}/auth`;

  // --- State dùng Signal ---
  private currentUser = signal<User | null>(null);
  readonly user = this.currentUser.asReadonly();
  readonly isLoggedIn = computed(() => !!this.currentUser());
  readonly isAdmin = computed(() => this.currentUser()?.role === 'admin');

  constructor(private http: HttpClient, private router: Router) {
    // Khôi phục user từ localStorage khi app khởi động
    this.loadUserFromStorage();
  }

  // --- Register ---
  register(dto: RegisterDto) {
    return this.http.post<AuthResponse>(`${this.API}/register`, dto).pipe(
      tap(res => this.saveSession(res))
    );
  }

  // --- Login ---
  login(dto: LoginDto) {
    return this.http.post<AuthResponse>(`${this.API}/login`, dto).pipe(
      tap(res => this.saveSession(res))
    );
  }

  // --- Logout ---
  logout() {
    return this.http.post(`${this.API}/logout`, {}).pipe(
      tap(() => this.clearSession())
    );
  }

  // --- Refresh Token ---
  refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<AuthResponse>(`${this.API}/refresh`, { refreshToken }).pipe(
      tap(res => this.saveSession(res))
    );
  }

  // --- Helpers ---
  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private saveSession(res: AuthResponse) {
    localStorage.setItem('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    localStorage.setItem('user', JSON.stringify(res.user));
    this.currentUser.set(res.user);
  }

  private clearSession() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  private loadUserFromStorage() {
    const user = localStorage.getItem('user');
    if (user) this.currentUser.set(JSON.parse(user));
  }
}