import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonComponentModule } from '@festival-planner/common';
import { FeaturesModule } from '@festival-planner/features';

@Component({
  standalone: true,
  imports: [RouterModule, CommonComponentModule, FeaturesModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'festival-planner-web';
}
