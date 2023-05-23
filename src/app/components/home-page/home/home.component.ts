import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sample-page1',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomePageComponent implements OnInit {

  @Input() data: any

  title: string;
  constructor(
    private translate: TranslateService
  ) {
    
  }

  ngOnInit(): void {
    this.translate.get("menu.dashboard").subscribe((text:string) => {
      this.title = text;
      console.log(this.title);
    });
  }
}
