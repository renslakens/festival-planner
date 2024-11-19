import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FeaturesModule } from '@festival-planner/features';
import { CommonComponentModule } from '@festival-planner/common';

@Component({
  standalone: true,
  imports: [RouterModule, FeaturesModule, CommonComponentModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'festival-planner-web';
}
