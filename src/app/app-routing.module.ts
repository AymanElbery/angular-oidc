import  { NgModule } from '@angular/core';var routingAnimation = localStorage.getItem('animate') 
import { RouterModule, Routes } from '@angular/router';
import { AutoLoginPartialRoutesGuard } from 'angular-auth-oidc-client';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { ContentComponent } from './shared/components/layout/content/content.component';
import { content } from "./shared/routes/routes/routers";

const routes: Routes = [
  {
    path: '',
    component: ContentComponent,
    children: content,
  },
  // {
  //   path: '**',
  //   redirectTo: 'home'
  // },
  { path: 'forbidden', component: ForbiddenComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes ,{
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled',
    relativeLinkResolution: 'legacy'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
