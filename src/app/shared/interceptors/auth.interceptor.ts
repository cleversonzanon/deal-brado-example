import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private _authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Recupera token salvo no localStorage
    const token = this._authService.getToken();
    // Caso tenha um token salvo
    if (token) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `${token}`)
      });
      // Retorna nova request http com header de authorization
      return next.handle(authReq);
    } else {
      // Retorna request recebida sem alteracao
      return next.handle(req);
    }
  }

}
