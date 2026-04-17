import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { SubscriptionService } from '../../core/services/subscription.service';
import { Subscription, CATEGORIES } from '../../core/models/subscription.model';

@Component({
  selector: 'app-subscription-detail',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './subscription-detail.component.html',
  styleUrl: './subscription-detail.component.scss'
})
export class SubscriptionDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly subscriptionService = inject(SubscriptionService);

  subscription = signal<Subscription | null>(null);
  isLoading = signal(true);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/subscriptions']);
      return;
    }
    this.subscriptionService.getById(Number(id)).subscribe({
      next: (sub) => {
        this.subscription.set(sub);
        this.isLoading.set(false);
      },
      error: () => this.router.navigate(['/subscriptions']),
    });
  }

  getCategoryLabel(category: string):   string {
    return CATEGORIES.find(cat => cat.value === category)?.label ?? category;
  }

  goBack(): void {
    this.router.navigate(['/subscriptions']);
  }

  goToEdit(): void {
    const sub = this.subscription();
    if (sub) this.router.navigate(['/subscriptions', sub.id, 'edit']);
  }
}
