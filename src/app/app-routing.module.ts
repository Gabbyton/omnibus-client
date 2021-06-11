import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PreloadGuard } from './utils/guards/preload.guard';

const routes: Routes = [
  {
    path: 'home', component: HomeComponent,
    resolve: {
      uiData: PreloadGuard
    },
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
