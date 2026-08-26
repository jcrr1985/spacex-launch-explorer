import { Launch } from "@/app/core/models/launch.model";
import { DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";

// presentational: no store, no router navigation, it only renders what it
// gets and shouts when the star is clicked
@Component({
  selector: "app-launch-card",
  imports: [
    DatePipe,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
  ],
  templateUrl: "./launch-card.html",
  styleUrl: "./launch-card.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LaunchCard {
  launch = input.required<Launch>();
  isFavorite = input(false);

  toggleFavorite = output<number>();
}
