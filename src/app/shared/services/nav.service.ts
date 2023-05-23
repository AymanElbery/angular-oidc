import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, fromEvent, Subject } from "rxjs";
import { takeUntil, debounceTime } from "rxjs/operators";
import { TranslateService } from '@ngx-translate/core';

export interface Menu {
  headTitle1?: string;
  headTitle2?: string;
  path?: string;
  title?: string;
  icon?: string;
  type?: string;
  badgeType?: string;
  badgeValue?: string;
  active?: boolean;
  bookmark?: boolean;
  children?: Menu[];
}
@Injectable({
  providedIn: "root",
})
export class NavService {
  private unsubscriber: Subject<any> = new Subject();
  public screenWidth: BehaviorSubject<number> = new BehaviorSubject(window.innerWidth);

  // Search Box
  public search: boolean = false;

  // Collapse Sidebar
  public collapseSidebar: boolean = window.innerWidth < 991 ? true : false;

  // For Horizontal Layout Mobile
  public horizontal: boolean = window.innerWidth < 991 ? false : true;

  // Full screen
  public fullScreen: boolean = false;

  constructor(private router: Router) {
    this.setScreenWidth(window.innerWidth);
    fromEvent(window, "resize")
      .pipe(debounceTime(1000), takeUntil(this.unsubscriber))
      .subscribe((evt: any) => {
        this.setScreenWidth(evt.target.innerWidth);
        if (evt.target.innerWidth < 991) {
          this.collapseSidebar = true;
        }
        if (evt.target.innerWidth < 1199) {
        }
      });
    if (window.innerWidth < 991) {
      // Detect Route change sidebar close
      this.router.events.subscribe((event) => {
        this.collapseSidebar = true;
      });
    }
  }

  private setScreenWidth(width: number): void {
    this.screenWidth.next(width);
  }

  MENUITEMS: Menu[] = [
    { 
      path: "/dashboard", 
      icon: "home", 
      title: "menu.dashboard", 
      type: "link", 
      active: true 
    },
    {
      title: "menu.requests_management",
      icon: "forms",
      type: "sub",
      children: [
        { 
          path: "/pending-requests", 
          title: "menu.requests.pending_requests", 
          type: "link" 
        },
        { 
          path: "/accepted-requests", 
          title: "menu.requests.accepted_requests", 
          type: "link" 
        },
        { 
          path: "/rejected-requests", 
          title: "menu.requests.rejected_requests", 
          type: "link" 
        },
      ],
    },
    {
      title: "menu.users_management",
      icon: "users",
      type: "sub",
      children: [
        { 
          path: "/users", 
          title: "menu.users.admins", 
          type: "link" 
        },
      ],
    },
  ];

  items = new BehaviorSubject<Menu[]>(this.MENUITEMS);
}
