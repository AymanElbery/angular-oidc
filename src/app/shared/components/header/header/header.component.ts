import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/shared/services/layout/layout.service';
import { NavService } from 'src/app/shared/services/nav.service';
import {TranslateService} from "@ngx-translate/core";
import { UserService } from '../../../services/user.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public dark: boolean = this.layout.config.settings.layout_version == 'dark-only' ? true : false;
  public lang : any;
  public layoutType: string = this.layout.config.settings.layout_type;
  collapseSidebar: boolean = true;
  username: string;
  constructor(
    private navServices: NavService, 
    public layout: LayoutService,
    private translate: TranslateService,
    public user_service: UserService
  ) {
    this.lang = localStorage.getItem('seu-cpm-lang');
  }

  sidebarToggle( ) {
    this.navServices.collapseSidebar = !this.navServices.collapseSidebar;
  }

  layoutToggle() {
    this.dark = !this.dark;
    this.layout.config.settings.layout_version = this.dark ? 'dark-only' : 'light';
  }

  searchToggle(){
    this.navServices.search = true;
  }

  ngOnInit(): void {
    this.username = this.user_service.get_first_last_name();
  }
 
  change_lang(){
    let val = (this.lang == 'ar') ? 'ltr' : 'rtl';
    this.layoutType = val;
    this.layout.config.settings.layout_type = val;
    document.getElementsByTagName('html')[0].removeAttribute('dir');
    document.body?.classList.remove('box-layout')
    if(val == 'rtl' || val == 'ltr'){
      this.lang = (val == 'rtl') ? 'ar' : 'en';
      localStorage.setItem('seu-cpm-lang', this.lang);
      this.translate.use(this.lang);
      document.getElementsByTagName('html')[0].setAttribute('dir', val);
    }else{
      document.body?.classList.add('box-layout')
    }

    // To Do subscribe ...
    this.username = this.user_service.get_first_last_name();
  }
}
