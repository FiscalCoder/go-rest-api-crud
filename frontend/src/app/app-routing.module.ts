import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { UsersComponent } from './users/users.component';
import { PostsComponent } from './posts/posts.component';


const routes: Routes = [
	{ path: '', component: HomeComponent },
  { path: 'users', component: UsersComponent },
	{ path: 'posts', component: PostsComponent },
  { path: 'not-found', component: NotFoundComponent },
	{ path: '**', redirectTo: 'not-found' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
