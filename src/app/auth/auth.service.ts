import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
//Pour creatioin les router de navigation au les interfaces d'aplications de manier dynamique
import { Router } from '@angular/router';
// pour resovoire le lien pour transfaire les donnes au la base de donnes pour eviter le doublont utilisation
import { environment } from '../../environment/environment';

const BACKEND_URL = environment.apiUrl + '/user/';

import { error } from 'console';
@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string;
  private IsAuthService = false;
  //pour stoke  Identifient d'utiliosatuer pouyr donnes le droit de chaqur uttilisateur
  private userId: any;
  private TokenTimer: any;
  //pour transefert les donnes vers les objet pour manqunet des informations
  private AuthserviceListen = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}
  getToken() {
    return this.token;
  }
  getAuthService() {
    return this.IsAuthService;
  }
  //POUR RETURN ID D'UTILISATEUR DE GESTION LES AUTORITAION LES POST DE CHAQUE UTILSATEUR CONNECTER
  getUserId() {
    return this.userId;
  }
  autoAuthUser() {
    const authInformation = this.GetAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expireIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expireIn > 0) {
      (this.token = authInformation?.token),
        (this.IsAuthService = true),
        (this.userId = authInformation.userId);
      this.SetAuthTime(expireIn / 1000);
      this.AuthserviceListen.next(true);
    }
  }
  getAuthServiceListen() {
    return this.AuthserviceListen.asObservable();
  }
  createUser(email: string, password: string) {
    const Authdata: AuthData = { email: email, password: password };
    this.http.post(BACKEND_URL + 'signup', Authdata).subscribe(
      () => this.router.navigate(['/']),
      (error) => {
        this.AuthserviceListen.next(false);
      }
    );
  }
  login(email: string, password: string) {
    const Authdata: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        BACKEND_URL + 'login',
        Authdata
      )
      .subscribe(
        (response) => {
          const token = response.token;
          this.token = token;
          if (token) {
            const TimeexpiresIn = response.expiresIn;
            //pour faire une calculer de tmp d'experation la sesion sous forme chrono time
            this.SetAuthTime(TimeexpiresIn);
            this.IsAuthService = true;
            //pour stoker ID d'UTILISATEUR POUR UTILISATION DANS SET
            this.userId = response.userId;
            this.AuthserviceListen.next(true);
            //pour acceler a la page a'accuell au cas acceder le comptd d' utilisateur
            const now = new Date();
            const experationDate = new Date(
              now.getTime() + TimeexpiresIn * 1000
            );
            this.SaveAuthData(token, experationDate, this.userId);
            this.router.navigate(['/']);
          }
        },
        (error) => {
          this.AuthserviceListen.next(false);
        }
      );
  }
  logout() {
    this.token = '';
    this.IsAuthService = false;
    this.AuthserviceListen.next(false);
    // resouvoir ID DE recuperation d'utilisateur connecter reels
    this.userId = '';
    clearTimeout(this.TokenTimer);
    this.RemoveAuthData();
    this.router.navigate(['/']);
  }
  private SetAuthTime(duration: number) {
    console.log('la dure de sission par seconde :' + duration);
    this.TokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
  private SaveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    //pour ajouter ID utilisateur de modificatiojn les teraidement de modificatipohkn ou ajouter ou suprimer sous forme stokage liocal ou navigateur au cas actilisation page de navigateur
    localStorage.setItem('userId', userId);
  }

  private RemoveAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }
  private GetAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
    };
  }
}
