import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriptionService } from '../../core/services/subscription.service';
import { Subscription, SubscriptionStats, CATEGORIES, PriceSort } from '../../core/models/subscription.model';
import { MonthlySummaryComponent } from './components/monthly-summary/monthly-summary.component';
import { UpcomingRenewalsComponent } from './components/upcoming-renewals/upcoming-renewals.component';
import { SubscriptionCardComponent } from './components/subscription-card/subscription-card.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MonthlySummaryComponent,
    UpcomingRenewalsComponent,
    SubscriptionCardComponent,
    ConfirmDialogComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private readonly subscriptionService = inject(SubscriptionService);
  private readonly router = inject(Router);


  subscriptions = signal<Subscription[]>([]);
  stats = signal<SubscriptionStats>({ totalMonthly: 0, count: 0, annualProjection: 0 });
  isLoading = signal(true);
  priceSort = signal<PriceSort>(PriceSort.None);
  categoryFilter = signal<string>('all');
  // handleDelete real con confirm dialog (igual que en subscriptions):
  confirmDeleteId = signal<number | null>(null);

  activeSubscriptions = computed(() => {
    const category = this.categoryFilter();
    const sort = this.priceSort();

    let result = this.subscriptions().filter(s => s.status === 'active');

    if (category !== 'all') {
      result = result.filter(s => s.category === category);
    }

    if (sort === PriceSort.Asc) return [...result].sort((a, b) => a.price - b.price);
    if (sort === PriceSort.Desc) return [...result].sort((a, b) => b.price - a.price);
    return result;
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
    this.priceSort.update(current => {
      if (current === PriceSort.None) return PriceSort.Asc;
      if (current === PriceSort.Asc) return PriceSort.Desc;
      return PriceSort.None;
    });
  }

  getPriceSortLabel(): string {
    const sort = this.priceSort();
    if (sort === PriceSort.Asc) return 'Precio ↑';
    if (sort === PriceSort.Desc) return 'Precio ↓';
    return 'Precio';
  }

  cycleCategoryFilter(): void {
    const allValues = ['all', ...CATEGORIES.map(c => c.value)];
    const currentIndex = allValues.indexOf(this.categoryFilter());
    this.categoryFilter.set(allValues[(currentIndex + 1) % allValues.length]);
  }

  getCategoryLabel(): string {
    const currentCategory = this.categoryFilter();
    if (currentCategory === 'all') return 'Categoría';
    return CATEGORIES.find(cat => cat.value === currentCategory)?.label ?? currentCategory;
  }


  navigateToNew(): void {
    this.router.navigate(['/subscriptions/new']);
  }

  handleEdit(subscription: Subscription): void {
    this.router.navigate(['/subscriptions', subscription.id, 'edit']);
  }

  handleDelete(subscription: Subscription): void {
    this.confirmDeleteId.set(subscription.id);
  }

  onConfirmDelete(): void {
    const id = this.confirmDeleteId();
    if (id === null) return;
    this.subscriptionService.delete(id).subscribe({
      next: () => {
        this.subscriptions.update(subs => subs.filter(s => s.id !== id));
        this.confirmDeleteId.set(null);
      },
      error: (err) => console.error('Error eliminando:', err),
    });
  }

  onCancelDelete(): void {
    this.confirmDeleteId.set(null);
  }
}
