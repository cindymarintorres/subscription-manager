import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [],
  template: `
    <div class="overlay">
      <div class="dialog">
        <h2 class="headline-sm">{{ title() }}</h2>
        <p class="body-md">{{ message() }}</p>
        <div class="actions">
          <button class="btn-cancel" (click)="cancelled.emit()">Cancelar</button>
          <button class="btn-confirm" (click)="confirmed.emit()">Eliminar</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @use 'variables' as *;
    @use 'mixins' as *;

    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(25, 28, 29, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fade-in 0.15s ease;
    }

    .dialog {
      @include card;
      max-width: 400px;
      width: calc(100% - 2rem);
      display: flex;
      flex-direction: column;
      gap: $spacing-md;
      animation: slide-up 0.2s ease;
    }

    .headline-sm {
      font-family: 'Manrope', sans-serif;
      font-size: 1.25rem;
      font-weight: 700;
      color: $on-surface;
      margin: 0;
    }

    .body-md {
      font-family: 'Inter', sans-serif;
      font-size: 0.875rem;
      color: $on-surface-variant;
      line-height: 1.5;
      margin: 0;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: $spacing-sm;
      margin-top: $spacing-sm;
    }

    .btn-cancel {
      @include btn-secondary;
    }

    .btn-confirm {
      @include btn-primary;
      background: linear-gradient(135deg, $error, #d32f2f);
    }

    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slide-up {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ConfirmDialogComponent {
  title = input<string>('Confirmar');
  message = input<string>('¿Estás seguro?');
  confirmed = output<void>();
  cancelled = output<void>();
}
