import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { SubscriptionService } from '../../core/services/subscription.service';
import { Subscription, SubscriptionStats, CATEGORIES } from '../../core/models/subscription.model';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, DatePipe, ConfirmDialogComponent, EmptyStateComponent],
  templateUrl: './subscriptions.component.html',
  styleUrl: './subscriptions.component.scss'
})
export class SubscriptionsComponent implements OnInit {
  private readonly subscriptionService = inject(SubscriptionService);
  private readonly router = inject(Router);

  subscriptions = signal<Subscription[]>([]);
  stats = signal<SubscriptionStats>({ totalMonthly: 0, count: 0, annualProjection: 0 });
  isLoading = signal(true);
  searchQuery = signal('');
  activeFilter = signal<string>('all');
  confirmDeleteId = signal<number | null>(null);
  categories = CATEGORIES;

  nextRenewal = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sorted = [...this.subscriptions()]
      .filter(subs => subs.status === 'active' && new Date(subs.nextPaymentDate) >= today)
      .sort((subsA, subsB) => new Date(subsA.nextPaymentDate).getTime() - new Date(subsB.nextPaymentDate).getTime());
    return sorted[0] ?? null;
  });

  filteredSubscriptions = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const filter = this.activeFilter();
    return this.subscriptions().filter(subs => {
      const matchesSearch = !query || subs.name.toLowerCase().includes(query);
      const matchesCategory = filter === 'all' || subs.category === filter;
      return matchesSearch && matchesCategory;
    });
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    forkJoin({
      suscriptions: this.subscriptionService.getAll(),
      stats: this.subscriptionService.getStats()
    }).subscribe({
      next: ({ suscriptions, stats }) => {
        this.subscriptions.set(suscriptions);
        this.stats.set(stats);
      },
      error: (err) => console.error('Error cargando datos:', err),
      complete: () => this.isLoading.set(false),
    });
  }

  setFilter(category: string): void {
    this.activeFilter.set(category);
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
  }

  navigateToAdd(): void {
    this.router.navigate(['/subscriptions/new']);
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/subscriptions', id, 'edit']);
  }

  navigateToDetail(id: number): void {
    this.router.navigate(['/subscriptions', id]);
  }

  handleDelete(id: number): void {
    this.confirmDeleteId.set(id);
  }

  onConfirmDelete(): void {
    const id = this.confirmDeleteId();
    if (id === null) return;
    this.subscriptionService.delete(id).subscribe({
      next: () => {
        this.confirmDeleteId.set(null);
        this.loadData();
      },
      error: (err) => console.error('Error eliminando suscripcion:', err),
    });
  }

  onCancelDelete(): void {
    this.confirmDeleteId.set(null);
  }

  getCategoryLabel(category: string): string {
    return CATEGORIES.find(cat => cat.value === category)?.label ?? category;
  }
}
