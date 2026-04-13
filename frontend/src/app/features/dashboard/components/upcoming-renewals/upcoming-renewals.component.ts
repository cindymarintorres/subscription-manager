import { Component, input, computed } from '@angular/core';
import { Subscription } from '../../../../core/models/subscription.model';

@Component({
  selector: 'app-upcoming-renewals',
  standalone: true,
  imports: [],
  templateUrl: './upcoming-renewals.component.html',
  styleUrl: './upcoming-renewals.component.scss'
})
export class UpcomingRenewalsComponent {
  subscriptions = input.required<Subscription[]>();

  upcomingRenewals = computed(() => {
    return [...this.subscriptions()]
      .filter(s => s.status === 'active')
      .sort((a, b) => new Date(a.nextPaymentDate).getTime() - new Date(b.nextPaymentDate).getTime())
      .slice(0, 3)
      .map(sub => ({
        ...sub,
        isUrgent: this.isWithin48Hours(sub.nextPaymentDate),
        relativeDate: this.getRelativeDate(sub.nextPaymentDate),
      }));
  });

  private isWithin48Hours(dateStr: string): boolean {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    return diffMs >= 0 && diffMs <= 48 * 60 * 60 * 1000;
  }

  private getRelativeDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Manana';
    return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
  }
}
