import { Routes } from "@angular/router";

export const content: Routes = [
  {
    path: "",
    loadChildren: () => import("../../../components/home-page/home-page.module").then((m) => m.HomePageModule),
  },
];
