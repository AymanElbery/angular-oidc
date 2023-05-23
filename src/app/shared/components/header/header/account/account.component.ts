import { Component, OnInit } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { open_id_configs } from 'src/app/oidc/oidc.config';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  public userName: string;
  public profileImg: 'assets/images/dashboard/profile.jpg';

  constructor(
    public oidcSecurityService: OidcSecurityService
  ) {

  }

  ngOnInit(): void {
  }

  logout() {
    // sessionStorage.clear();
    // localStorage.clear();
    //window.location.href = "https://iam.seu.edu.sa/oam/server/logout?end_url=https://iam.seu.edu.sa/SEUSSO/pages/Logout.jsp";
    this.oidcSecurityService.logoffAndRevokeTokens(open_id_configs.configId).subscribe((result) => {
      console.log(result);
    });
  }

}
