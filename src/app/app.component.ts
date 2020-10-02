import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ThemeService } from './theme/theme.service';
import { DataService } from './data-service/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  title = 'geoapp';
  public numOfFavs;
  constructor(private themeService: ThemeService, private dataService: DataService) { }

  ngOnInit() {
    this.numOfFavs = localStorage.getItem('cityFavoriteKeys') !== null ? JSON.parse(localStorage.getItem('cityFavoriteKeys')).length || 0 : 0;

    this.dataService.currentFavsNumber.subscribe(
      favsNumber => {
        this.numOfFavs = favsNumber;
      }
    );
  }

  /*Toggle Theme*/
  changeTheme(): void {
    const active = this.themeService.getActiveTheme();
    if (active.name === 'light') {
      this.themeService.setTheme('dark');
    } else {
      this.themeService.setTheme('light');
    }
  }

}
