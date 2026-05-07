import { Routes } from '@angular/router';
import { HomePage } from './pages/home-page/home-page';
import { CalculatorPage } from './pages/calculator-page/calculator-page';
import { TodoPage } from './pages/todo-page/todo-page';
import { Reports } from './pages/reports/reports';
import { Add } from './pages/add/add';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomePage,
  },
  {
    path: 'calculator',
    component: CalculatorPage,
  },
  {
    path: 'todo',
    component: TodoPage,
  },
  {
    path: 'reports',
    component: Reports,
  },
  {
    path: 'add',
    component: Add,
  },
  {
    path: 'update/:id',
    component: Add,
  },
];
