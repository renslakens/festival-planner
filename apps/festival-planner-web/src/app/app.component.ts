import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonComponentModule } from '@festival-planner/common';

@Component({
  standalone: true,
  imports: [RouterModule, CommonComponentModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'festival-planner-web';
}
