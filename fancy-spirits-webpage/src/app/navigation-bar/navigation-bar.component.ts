import { Component, OnInit } from '@angular/core';
import routes from "../routes";

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit {
  readonly routes = routes;

  constructor() { }

  ngOnInit(): void {
  }

}
