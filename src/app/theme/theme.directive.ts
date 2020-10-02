import { Directive, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { ThemeService } from './theme.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Theme } from './symbols';

@Directive({
    selector: '[app-theme]'
})
export class ThemeDirective implements OnInit {

    private unsubscribe = new Subject();
    constructor(
        private _elementRef: ElementRef,
        private _themeService: ThemeService
    ) { }

    ngOnInit() {
        const active = this._themeService.getActiveTheme();
        if (active) {
            this.updateTheme(active);
        }
        this._themeService.themeChange.pipe(takeUntil(this.unsubscribe))
            .subscribe((theme: Theme) => this.updateTheme(theme));
    }

    updateTheme(theme: Theme) {
        document.getElementsByTagName("body")[0].style.backgroundColor = theme.properties['--bodyBackground'];
        document.getElementsByTagName("body")[0].style.color = theme.properties['--on-bodyBackground'];
        for (const key in theme.properties) {
            this._elementRef.nativeElement.style.setProperty(key, theme.properties[key]);
        }
    }

}
