import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  template: `
    <h3 style="margin: 4%;font-size: 2.5rem;font-family: Open Sans,Helvetica;text-align: center;">
      Oops... This is not the page you're looking for...
    </h3>
  `,
  styles: [],
  encapsulation: ViewEncapsulation.None,
})
export class PageNotFoundComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
