import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent {
  /**
   * Array of breadcrumb items where each item has a label (display text)
   * and an optional URL. If URL is provided, the breadcrumb is clickable.
   */
  @Input() breadcrumbs: { label: string, url?: string }[] = [];
}
