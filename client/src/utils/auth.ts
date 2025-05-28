import { JwtPayload, jwtDecode } from 'jwt-decode';

class AuthService {
  getProfile() {
    // TODO: return the decoded token
  }

  loggedIn(): boolean {  // Changed return type to boolean
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);  // Return boolean check
  }

  isTokenExpired(token: string): boolean {  // Added return type
    // TODO: return a value that indicates if the token is expired
    try {
      const decodedToken = jwtDecode<JwtPayload>(token);
      if (decodedToken.exp) {
        return Date.now() >= decodedToken.exp * 1000;
      }
      return false;
    } catch (error) {
      return true;
    }
  }

  getToken(): string | null {  // Changed return type to allow null
    return localStorage.getItem('id_token');  // Actually return the token
  }

  login(idToken: string): void {
    localStorage.setItem('id_token', idToken);
    // TODO: redirect to the home page
  }

  logout(): void {
    localStorage.removeItem('id_token');
    // TODO: redirect to the login page
  }
}

export default new AuthService();