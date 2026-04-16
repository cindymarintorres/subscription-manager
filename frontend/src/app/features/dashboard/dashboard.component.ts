import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriptionService } from '../../core/services/subscription.service';
import { Subscription, SubscriptionStats } from '../../core/models/subscription.model';
import { MonthlySummaryComponent } from './components/monthly-summary/monthly-summary.component';
import { UpcomingRenewalsComponent } from './components/upcoming-renewals/upcoming-renewals.component';
import { SubscriptionCardComponent } from './components/subscription-card/subscription-card.component';

type PriceSort = 'none' | 'asc' | 'desc';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MonthlySummaryComponent,
    UpcomingRenewalsComponent,
    SubscriptionCardComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private subscriptionService = inject(SubscriptionService);
  private router = inject(Router);

  subscriptions = signal<Subscription[]>([]);
  stats = signal<SubscriptionStats>({ totalMonthly: 0, count: 0, annualProjection: 0 });
  isLoading = signal(true);
  priceSort = signal<PriceSort>('none');

  activeSubscriptions = computed(() => {
    const active = this.subscriptions().filter(s => s.status === 'active');
    const sort = this.priceSort();
    if (sort === 'asc') return [...active].sort((a, b) => a.price - b.price);
    if (sort === 'desc') return [...active].sort((a, b) => b.price - a.price);
    return active;
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    this.subscriptionService.getAll().subscribe({
      next: (data) => this.subscriptions.set(data),
      error: (err) => console.error('Error cargando suscripciones:', err),
    });
    this.subscriptionService.getStats().subscribe({
      next: (data) => this.stats.set(data),
      error: (err) => console.error('Error cargando estadisticas:', err),
      complete: () => this.isLoading.set(false),
    });
  }

  togglePriceSort(): void {
    const current = this.priceSort();
    if (current === 'none') this.priceSort.set('asc');
    else if (current === 'asc') this.priceSort.set('desc');
    else this.priceSort.set('none');
  }

  getPriceSortLabel(): string {
    const sort = this.priceSort();
    if (sort === 'asc') return 'Precio ↑';
    if (sort === 'desc') return 'Precio ↓';
    return 'Precio';
  }

  navigateToNew(): void {
    this.router.navigate(['/subscriptions/new']);
  }

  handleEdit(subscription: Subscription): void {
    this.router.navigate(['/subscriptions', subscription.id, 'edit']);
  }

  handleDelete(subscription: Subscription): void {
    console.log('Eliminar:', subscription.name);
  }
}
