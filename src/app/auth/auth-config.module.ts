import { NgModule } from '@angular/core';
import { AuthModule } from 'angular-auth-oidc-client';
import { open_id_configs } from '../oidc/oidc.config'

@NgModule({
  imports: [
    AuthModule.forRoot({
      config: open_id_configs,
    }),
  ],
  exports: [AuthModule],
})
export class AuthConfigModule {}