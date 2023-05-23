import { Component, HostBinding, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/shared/services/layout/layout.service';

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.scss']
})
export class ColorComponent implements OnInit {
  public MIXLayout: string = 'default';
  @HostBinding('@.disabled')


  public selectedValue: any
  public primary_color: string = '#6362E7';
  public secondary_color: string = '#FFC500';

  constructor(public layout:LayoutService) {
  }

  ngOnInit(): void {
  }

  applyColor() {
    document.documentElement.style.setProperty('--theme-deafult', this.primary_color);
    document.documentElement.style.setProperty('--theme-secondary', this.secondary_color);
    this.layout.config.color.primary_color = this.primary_color;
    this.layout.config.color.secondary_color = this.secondary_color;
  }

  customizeMixLayout(val: any) {
    this.MIXLayout = val;
    this.layout.config.settings.layout_version = val;
  }
}
