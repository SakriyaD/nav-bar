import { Routes } from '@angular/router';
import { Products } from './products/products';
import { Dashboard } from './dashboard/dashboard';
import { App } from './app';
import { Salesman } from './salesman/salesman';
import { Category } from './category/category';
import { Sales } from './sales-feature/sales/sales';
import { SalesList } from './sales-feature/sales-list/sales-list';
import { SalesCustomerDetails } from './sales-feature/sales-customer-details/sales-customer-details';
import { SalesProductAddRemove } from './sales-feature/sales-product-add-remove/sales-product-add-remove';
import { SalesTotal } from './sales-feature/sales-total/sales-total';
import { SalesAdd } from './sales-feature/sales-add/sales-add';
import { LoginPage } from './login-page/login-page';
import { SignupPage } from './signup-page/signup-page';
import { AuthGuard } from './auth.guard'; // Import AuthGuard

export const routes: Routes = [
    // 1. Redirect root to sales (or dashboard) immediately
    { path: '', redirectTo: 'sales', pathMatch: 'full' }, 
    { path: 'login', component: LoginPage },
    { path: 'signup', component: SignupPage },    
    { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
    { path: 'products', component: Products, canActivate: [AuthGuard] },
    { path: 'salesman', component: Salesman, canActivate: [AuthGuard] },
    { path: 'category', component: Category, canActivate: [AuthGuard] },
    {
        path: 'sales',
        component: Sales,
        canActivate: [AuthGuard], // Protect the parent sales route
        children: [
            { path: '', redirectTo: 'list', pathMatch: 'full' },
            { path: 'list', component: SalesList },
            { path: 'add', component: SalesAdd },
            { path: 'customer-details', component: SalesCustomerDetails },
            { path: 'product-add-remove', component: SalesProductAddRemove },
            { path: 'total', component: SalesTotal },  
        ],
    },
    // 2. The Catch-all safety net
    { path: '**', redirectTo: 'sales' } 
];