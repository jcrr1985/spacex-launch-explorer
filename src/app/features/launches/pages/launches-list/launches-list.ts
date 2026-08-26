import { Launch } from "@/app/core/models/launch.model";
import { loadLaunches } from "@/app/features/launches/state/launch.actions";

import { selectAllLaunches } from "@/app/features/launches/state/launch.selectors";
import { CommonModule, DatePipe } from "@angular/common";
import { Component, computed, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { Store } from "@ngrx/store";

@Component({
  selector: "app-launches-list",
  imports: [
    CommonModule,
    DatePipe,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: "./launches-list.html",
  styleUrl: "./launches-list.scss",
})
export class LaunchList {
  private store = inject(Store);

  query = signal("");

  private allLaunches = toSignal(this.store.select(selectAllLaunches), {
    requireSync: true,
  });

  filteredLaunches = computed(() => {
    const query = this.query().toLowerCase();
    return this.allLaunches().filter((launch: Launch) =>
      launch.mission_name.toLowerCase().includes(query),
    );
  });

  ngOnInit(): void {
    this.store.dispatch(loadLaunches());
  }

  onSearchChange(value: string): void {
    this.query.set(value);
  }
}
