import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { AdmindashboardComponent } from './admindashboard/admindashboard.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirect root to login
  { path: 'login', component: LoginComponent }, // Login route
  { path: 'menu', component: MenuComponent },
  { path: 'admin/dashboard', component: AdmindashboardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
