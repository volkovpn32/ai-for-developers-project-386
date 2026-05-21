import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { BookComponent } from './components/book/book.component';
import { AdminComponent } from './components/admin/admin.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'book/:eventTypeId', component: BookComponent },
  { path: 'admin', component: AdminComponent },
];
