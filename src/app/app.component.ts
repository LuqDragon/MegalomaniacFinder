import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ServiceService } from './service.service';
import { Notable } from './schema/notable';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-root',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatListModule,
    MatGridListModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  @ViewChild('input')
  input!: ElementRef<HTMLInputElement>;

  filteredNotables: Notable[];
  notables: Notable[] = [];
  tradeLinks: string[] = [];
  isDarkTheme: boolean = false;

  constructor(private service: ServiceService) {
    this.filteredNotables = this.notables.slice();
  }

  ngOnInit() {
    this.service
      .getTradeStats()
      .subscribe((notables) => (this.notables = notables));
  }

  filter(): void {
    const filterValue = this.input.nativeElement.value.toLowerCase();
    this.filteredNotables = this.notables.filter((notable) =>
      notable.name.toLowerCase().includes(filterValue)
    );
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    this.service
      .generateTradeLinks(event.option.value.statId)
      .subscribe((tradeLinks) => (this.tradeLinks = tradeLinks));
  }

  displayFn(notable: Notable) {
    return notable?.name;
  }
}
