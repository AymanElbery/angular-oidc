import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { open_id_configs } from 'src/app/oidc/oidc.config';
import { UserData } from '../models/user-data';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    access_token: string;
    public user_data: UserData = {
        name_ar: "",
        name_en: "",
        gender: "",
        id: "",
        ssn: "",
        username: "",
        role: "",
        email: "",
        activeRole: ""
    };

    constructor(
        protected http: HttpClient,
        public oidcSecurityService: OidcSecurityService
    ) {
        this.oidcSecurityService.getAccessToken().subscribe(result => {
            this.access_token = result;
        });
    }

    requestUser() {
        const url = environment.whoami_service;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'sid': this.access_token,
            'domain': open_id_configs.customParamsAuthRequest.domain,
        });
        return this.http.get(url, { headers });
    }

    set_user_data(data: any){
        let obj : any = {};
        for (const [key, value] of Object.entries(this.user_data)) {
            obj[key] = data[key];
        }
        let all_data = sessionStorage.getItem(open_id_configs.configId);
        if(all_data !== null){
            let res = JSON.parse(all_data);
            res.userData = obj;
            sessionStorage.setItem(open_id_configs.configId, JSON.stringify(res));
        }
    }

    get_user_data(){
        let all_data = sessionStorage.getItem(open_id_configs.configId);
        if(all_data !== null){
            let res = JSON.parse(all_data);
            return res.userData;
        }
    }

    get_first_last_name(){
        let data = this.get_user_data();
        let name_arr = [];
        if(localStorage.getItem('seu-cpm-lang') == 'ar'){
            name_arr = data.name_ar.split(" ");
        }else{
            name_arr = data.name_en.split(" ");
        }
        let length = name_arr.length;
        return name_arr[0] + " " + name_arr[length - 1];
    }

    getActiveRoleDetails() {
        //return this.userData.activeRole;
    }

//   get_seu_structure(){
//     var url = environment.baselink + environment.servicesprefix + environment.common + "/seu_structure/";
//     var auth =`Basic ${window.btoa(environment.basicAuth)}`;
//     var headers = new HttpHeaders({
//       'Content-Type': 'application/json',
//       'Authorization': auth,
//       'sessionid': this.globalService.getSID(),
//     });

//     return this.http.get(url + "emp/lookups", {
//       headers: headers
//     });
//   }
}
