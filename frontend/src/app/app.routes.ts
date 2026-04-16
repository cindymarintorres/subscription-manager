import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { SubscriptionsComponent } from './features/subscriptions/subscriptions.component';
import { SubscriptionFormComponent } from './features/subscription-form/subscription-form.component';
import { SubscriptionDetailComponent } from './features/subscription-detail/subscription-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'subscriptions', component: SubscriptionsComponent },
      { path: 'subscriptions/new', component: SubscriptionFormComponent },
      { path: 'subscriptions/:id', component: SubscriptionDetailComponent },
      { path: 'subscriptions/:id/edit', component: SubscriptionFormComponent },
    ]
  }
];
