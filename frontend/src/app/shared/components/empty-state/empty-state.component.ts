import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="empty-state">
      <span class="material-icons-outlined empty-icon">inbox</span>
      <p class="body-lg">{{ title() }}</p>
      <p class="body-md">{{ message() }}</p>
      @if (actionLabel() && actionRoute()) {
        <a class="btn-action" [routerLink]="actionRoute()">{{ actionLabel() }}</a>
      }
    </div>
  `,
  styles: [`
    @use 'variables' as *;
    @use 'mixins' as *;

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: $spacing-3xl;
      gap: $spacing-sm;
      text-align: center;
    }

    .empty-icon {
      font-size: 48px;
      color: $outline;
      margin-bottom: $spacing-sm;
    }

    .body-lg {
      font-family: 'Inter', sans-serif;
      font-size: 1rem;
      font-weight: 500;
      color: $on-surface;
    }

    .body-md {
      font-family: 'Inter', sans-serif;
      font-size: 0.875rem;
      color: $on-surface-variant;
    }

    .btn-action {
      @include btn-primary;
      margin-top: $spacing-md;
      text-decoration: none;
    }
  `]
})
export class EmptyStateComponent {
  title = input<string>('Sin datos');
  message = input<string>('No hay elementos para mostrar.');
  actionLabel = input<string>('');
  actionRoute = input<string>('');
}
