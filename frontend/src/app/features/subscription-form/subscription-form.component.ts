import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { SubscriptionService } from '../../core/services/subscription.service';
import { CATEGORIES, Subscription } from '../../core/models/subscription.model';

type SubscriptionForm = {
  name: FormControl<string>;
  price: FormControl<number>;
  billingCycle: FormControl<'monthly' | 'annual'>;
  category: FormControl<Subscription['category']>;
  nextPaymentDate: FormControl<string>;
  color: FormControl<string>;
};

@Component({
  selector: 'app-subscription-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './subscription-form.component.html',
  styleUrl: './subscription-form.component.scss'
})
export class SubscriptionFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private subscriptionService = inject(SubscriptionService);

  categories = CATEGORIES;
  editId = signal<number | null>(null);
  isSubmitting = signal(false);

  form = new FormGroup<SubscriptionForm>({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    price: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0.01)] }),
    billingCycle: new FormControl<'monthly' | 'annual'>('monthly', { nonNullable: true }),
    category: new FormControl<Subscription['category']>('software', { nonNullable: true }),
    nextPaymentDate: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    color: new FormControl('#0056D2', { nonNullable: true }),
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId.set(Number(id));
      this.subscriptionService.getById(Number(id)).subscribe({
        next: (sub) => {
          this.form.patchValue({
            name: sub.name,
            price: sub.price,
            billingCycle: sub.billingCycle,
            category: sub.category,
            nextPaymentDate: sub.nextPaymentDate.split('T')[0],
            color: sub.color,
          });
        },
        error: () => this.router.navigate(['/subscriptions']),
      });
    }
  }

  get isEditMode(): boolean {
    return this.editId() !== null;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isSubmitting.set(true);
    const value = this.form.getRawValue();
    const id = this.editId();

    const request$ = id
      ? this.subscriptionService.update(id, value)
      : this.subscriptionService.create({ ...value, icon: 'label', status: 'active' });

    request$.subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        console.error('Error guardando suscripcion:', err);
        this.isSubmitting.set(false);
      },
    });
  }

  onCancel(): void {
    this.router.navigate([this.isEditMode ? '/subscriptions' : '/subscriptions']);
  }

  hasError(field: keyof SubscriptionForm, error: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.touched && ctrl?.hasError(error));
  }
}
