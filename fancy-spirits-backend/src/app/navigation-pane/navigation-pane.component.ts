import { Component, OnInit } from '@angular/core';
import routes from "../routes";

@Component({
  selector: 'app-navigation-pane',
  templateUrl: './navigation-pane.component.html',
  styleUrls: ['./navigation-pane.component.scss']
})
export class NavigationPaneComponent implements OnInit {
  readonly routes = routes;

  constructor() { }

  ngOnInit(): void {
  }

}
