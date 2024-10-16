import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-panel',
  templateUrl: './test-panel.component.html',
  styleUrls: ['./test-panel.component.scss']
})
export class TestPanelComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {
    const openPanelBtn = document.getElementById('openPanelBtn');
    const closePanelBtn = document.getElementById('closePanelBtn');
    const footerClosePanelBtn = document.getElementById('footerClosePanelBtn');
    const sidePanel = document.getElementById('sidePanel');
    const backdrop = document.getElementById('backdrop');

    // Ouvrir le panel
    openPanelBtn?.addEventListener('click', function () {
      sidePanel?.classList.remove('translate-x-full');
      backdrop?.classList.remove('hidden');
    });

    // Fermer le panel
    closePanelBtn?.addEventListener('click', function () {
      sidePanel?.classList.add('translate-x-full');
      backdrop?.classList.add('hidden');
    });

    // Fermer en cliquant sur le backdrop
    backdrop?.addEventListener('click', function () {
      sidePanel?.classList.add('translate-x-full');
      backdrop?.classList.add('hidden');
    });

    // Fermer le panel via le bouton dans le footer
    footerClosePanelBtn?.addEventListener('click', function () {
      sidePanel?.classList.add('translate-x-full');
      backdrop?.classList.add('hidden');
    });
  }
}
