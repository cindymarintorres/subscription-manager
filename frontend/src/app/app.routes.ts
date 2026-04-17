import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'subscriptions', loadComponent: () => import('./features/subscriptions/subscriptions.component').then(m => m.SubscriptionsComponent) },
      { path: 'subscriptions/new', loadComponent: () => import('./features/subscription-form/subscription-form.component').then(m => m.SubscriptionFormComponent) },
      { path: 'subscriptions/:id', loadComponent: () => import('./features/subscription-detail/subscription-detail.component').then(m => m.SubscriptionDetailComponent) },
      { path: 'subscriptions/:id/edit', loadComponent: () => import('./features/subscription-form/subscription-form.component').then(m => m.SubscriptionFormComponent) },
    ]
  }
];
