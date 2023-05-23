import { Component, HostBinding, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from "@ngx-translate/core";
import { LayoutService } from './shared/services/layout/layout.service';
import { UserService } from './shared/services/user.service';
import { LoginResponse, OidcSecurityService } from 'angular-auth-oidc-client';
import { open_id_configs } from './oidc/oidc.config'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public layoutType: string = this.layout.config.settings.layout_type;
  @HostBinding('@.disabled')
  public animationsDisabled = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private translate: TranslateService,
    public layout: LayoutService, 
    public user_service: UserService, 
    public oidcSecurityService: OidcSecurityService
    ) {
      this.setLang();
  }

  ngOnInit() {
    this.oidcSecurityService.checkAuth().subscribe((loginResponse: LoginResponse) => {
      if(!loginResponse.isAuthenticated){
        this.login();
      }else{
        this.user_service.requestUser().subscribe((result: any) => {
          this.user_service.set_user_data(result.data); 
        });
      }
    });
  }

  login() {
    this.oidcSecurityService.authorize(open_id_configs.configId);
  }

  refreshSession() {
    this.oidcSecurityService.authorize();
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }


  toggleAnimations() {
    this.animationsDisabled = !this.animationsDisabled;
  }

  setLang() {
    let lang = localStorage.getItem('seu-cpm-lang') ? localStorage.getItem('seu-cpm-lang') : 'ar';

    let val = (lang == 'ar') ? 'rtl' : 'ltr';
    this.layoutType = val;
    this.layout.config.settings.layout_type = val ;

    document.getElementsByTagName('html')[0].removeAttribute('dir');
    document.body?.classList.remove('box-layout');

    lang = (lang == null) ? 'ar' : lang;

    localStorage.setItem('seu-cpm-lang', lang);
    this.translate.use(lang);
    document.getElementsByTagName('html')[0].setAttribute('dir', val);
  }
  
}
