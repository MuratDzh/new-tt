import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'svg[appSvg]',
  standalone: true,
  imports: [],
  template: `<svg>
    <use [attr.href]="href"></use>
  </svg>`,
  styleUrl: './svg.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgComponent {
  @Input()
  appSvg!: string;

  get href() {
    return `./../../../assets/svg/${this.appSvg}.svg#${this.appSvg}`;
  }
}
