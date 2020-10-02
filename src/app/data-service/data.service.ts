import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private favNumberCheck = localStorage.getItem('cityFavoriteKeys') !== null ? JSON.parse(localStorage.getItem('cityFavoriteKeys')).length : 0;
  private favsNumber = new BehaviorSubject(this.favNumberCheck);
  currentFavsNumber = this.favsNumber.asObservable();

  constructor() { }

  changeFavs(favsNum) {
    this.favsNumber.next(favsNum);
  }

}
