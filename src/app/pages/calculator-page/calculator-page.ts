import { Component } from '@angular/core';
import { SharedModules } from '../../shared/shared.module';

@Component({
  selector: 'app-calculator-page',
  imports: [...SharedModules],
  templateUrl: './calculator-page.html',
  styleUrl: './calculator-page.scss',
})
export class CalculatorPage {
  num1: number = 0;
  num2: number = 0;
  result: number = 0;

  btnCalculate(operator: string) {
    switch (operator) {
      case '+':
        return (this.result = Number(this.num1) + Number(this.num2));
      case '-':
        return (this.result = Number(this.num1) - Number(this.num2));
      case '*':
        return (this.result = Number(this.num1) * Number(this.num2));
      case '/':
        return (this.result = Number(this.num1) / Number(this.num2));
      default:
        return 0;
    }
  }
}
