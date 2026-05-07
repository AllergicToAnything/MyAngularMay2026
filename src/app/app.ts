import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Toolbar } from './components/toolbar/toolbar';
import { Data } from './services/data';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatButtonModule, Toolbar, FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  public pageTitle: string = 'Home';
  constructor(private data: Data) {}
  ngOnInit(): void {
    this.data.observeEvent().subscribe((data: any) => {
      this.pageTitle = data;
    });
  }

  protected readonly title = signal('MyAngularMay2026');
}
