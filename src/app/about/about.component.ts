import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  values = [
    { icon: 'local_shipping', title: 'Fast Delivery',      desc: 'Same-day dispatch on all in-stock orders. Get your tech faster.' },
    { icon: 'verified',       title: 'Genuine Products',   desc: '100% authentic — every product is sourced from authorized distributors.' },
    { icon: 'support_agent',  title: '24/7 Support',       desc: 'Questions? Our team is always online to help you out.' },
    { icon: 'replay',         title: 'Easy Returns',       desc: '30-day hassle-free returns. No paperwork, no headaches.' },
    { icon: 'lock',           title: 'Secure Payments',    desc: 'Your payment data is encrypted with Stripe — industry-leading security.' },
    { icon: 'local_offer',    title: 'Best Prices',        desc: 'We match competitors. If you find it cheaper, tell us.' },
  ];
}
