import { Routes } from '@angular/router';
import { AuthorListComponent } from './components/author/author-list/author-list.component';
import { AuthorFormComponent } from './components/author/author-form/author-form.component';
import { BookListComponent } from './components/book/book-list/book-list.component';
import { BookFormComponent } from './components/book/book-form/book-form.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegistreComponent } from './components/user/registre/registre.component';
import { AuthGuard } from './guards/auth.guard';
import { UserListComponent } from './components/user/userList/user-list/user-list.component';
import { AdminGuard } from './guards/admin/admin.guard';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { StatisticComponent } from './components/statistic/statistic/statistic.component';



export const routes: Routes = [
    { path: '', redirectTo: 'Login', pathMatch: 'full' },
    { path: 'Login', component: LoginComponent },
    { path: 'Registre', component: RegistreComponent, canActivate: [AuthGuard]},
    { path: 'Home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'AuthorList', component: AuthorListComponent, canActivate: [AuthGuard] },
    { path: 'AuthorForm', component: AuthorFormComponent, canActivate: [AuthGuard] },
    { path: 'BookList', component: BookListComponent, canActivate: [AuthGuard]},
    { path: 'BookForm', component: BookFormComponent, canActivate: [AuthGuard]},
    { path: 'UserList', component: UserListComponent, canActivate: [AuthGuard, AdminGuard]},
    { path: 'Statistic', component: StatisticComponent, canActivate: [AuthGuard]}
];
