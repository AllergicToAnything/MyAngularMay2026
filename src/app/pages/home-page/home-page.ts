import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReversePipe } from '../../pipes/reverse-pipe';

@Component({
  selector: 'app-home-page',
  imports: [FormsModule, ReversePipe],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  public name: string = 'Enter Your Name';
  public inputText: string = '';

  btnClick() {
    this.name = this.inputText;
  }
}
