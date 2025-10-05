import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.html',
  styleUrls: ['./payment.scss']
})
export class PaymentComponent {
  stripe!: Stripe | null;
  card!: StripeCardElement;
  amount: number = 500;
  paymentResult: string = '';

  async ngOnInit() {
    this.stripe = await loadStripe('pk_test_51SE8bhGRNfVjVOlY12joAisWwfmcKec65lnLcMlZ7qf321pMkEyrw6SotvupUTVi1wZhJbV6pD7Xu4TaeN7rGOpN00ArIYgAYM');

    if (this.stripe) {
      const elements = this.stripe.elements();
      this.card = elements.create('card');
      this.card.mount('#card-element');
    }
  }

  async pay() {
    this.paymentResult = 'Creating payment...';

    const createResponse = await fetch('http://localhost:8080/api/payments/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: this.amount, method: 'card' })
    });

    if (!createResponse.ok) {
      this.paymentResult = 'Criando intenção de pagamento';
      return;
    }

    const paymentData = await createResponse.json();
    const clientSecret = paymentData.clientSecret;

    if (!this.stripe) {
      this.paymentResult = 'Stripe falhou ao carregar';
      return;
    }

    const { error, paymentIntent } = await this.stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: this.card
      }
    });

    if (error) {
      this.paymentResult = 'Error: ' + error.message;
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      this.paymentResult = '✅ Pagamento feito com sucesso, id do pagamento: ' + paymentIntent.id;
    } else {
      this.paymentResult = 'Status do pagamento: ' + paymentIntent?.status;
    }
  }
}
