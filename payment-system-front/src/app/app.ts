import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PaymentComponent } from './payment/payment';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,PaymentComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'payment-system-front';
  
}
