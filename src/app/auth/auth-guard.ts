import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
@Injectable({ providedIn: 'root' })
//set fichier pour controler les interfaces ne peut acceder avnt de valider le compte au connecter utilisatuer set fichier controler les routes qui spisifier le traitment pour controler les donnes
export class AuthGard implements CanActivate {
  constructor(private authservice: AuthService, private router: Router) {}
  canActivate(): boolean {
    const IsAuth = this.authservice.getAuthService();
    if (!IsAuth) {
      this.router.navigate(['/login']);
    }
    return IsAuth;
  }
}
