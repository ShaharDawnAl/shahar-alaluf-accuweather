import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data-service/data.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class FavoritesComponent implements OnInit {

  favsData: any;
  celsius = true;
  favoritesNumber: any;

  constructor(private router: Router, private dataService: DataService) { }

  ngOnInit(): void {
    this.getFavorites();
    this.dataService.currentFavsNumber.subscribe(
      favsNumber => {
        this.favoritesNumber = favsNumber;
      }
    );
  }

  toggleCelsiusFahrenheit() {
    this.celsius = !this.celsius;
  }

  onSelectFav(favorite) {
    this.router.navigate(['/weather', favorite.ID]);
  }

  getFavorites() {
    this.favsData = JSON.parse(localStorage.getItem('cityFavoriteKeys'));
  }

  removeFavorite(favID) {
    if (confirm('Are you sure you want to remove this location from your favorites?')) {
      const oldFavs = this.favsData || [];
      const index = oldFavs.map(function (e) { return e.ID; }).indexOf(favID);
      if (index > -1) {
        oldFavs.splice(index, 1);
      }
      localStorage.setItem('cityFavoriteKeys', JSON.stringify(oldFavs));
      this.dataService.changeFavs(JSON.parse(localStorage.getItem('cityFavoriteKeys')).length);
    }
  }

  ngOnDestroy() {
    // this.router.unsubscribe();
  }
}
