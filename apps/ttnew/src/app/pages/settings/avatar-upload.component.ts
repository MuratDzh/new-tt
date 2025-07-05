import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { DndDirective } from '../../common-ui/directives/dnd.directive';

import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Profile } from '../../data/interfces/profile.interface';
import { ImgPipe } from '../../helpers/pipes/img.pipe';
import { ProfileService } from '../../data/services/profile.service';

@Component({
  selector: 'app-avatar-upload',
  standalone: true,
  imports: [DndDirective, CommonModule, ImgPipe],
  templateUrl: './avatar-upload.component.html',
  styleUrl: './avatar-upload.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarUploadComponent {
  _profileImg$: Observable<string | null> | undefined = undefined;

  @Input()
  set profile$(p: Observable<Profile | null>) {
    this._profileImg$ = p?.pipe(map((v) => (v ? v.avatarUrl : '')));
  }

  get profileImg$(): Observable<string | null> | undefined {
    return this._profileImg$;
  }

  cdr = inject(ChangeDetectorRef);
  profService = inject(ProfileService);
  renderer = inject(Renderer2);

  avatar!: string;
  avatarDefault: string = './../../../assets/images/Content.png';

  avatarFile?: File;

  @ViewChild('dnd', { read: ElementRef<HTMLDivElement> })
  div!: ElementRef<HTMLDivElement>;

  uploadAvatar(f: File) {
    if (!f.type.match('image')) return;

    this.toReadFile(f);
  }

  uploadImg(e: Event) {
    //@ts-ignore
    let file: File = (e.target as HTMLInputElement).files[0];

    if (!file || !file.type.match('image')) return;

    this.toReadFile(file);
    console.log(this.div);

    this.renderer.setStyle(
      this.div.nativeElement,
      'borderColor',
      'var(--primary-color-hover)'
    );
  }

  toReadFile(f: File) {
    const fileReader = new FileReader();
    fileReader.onload = (ev) => {
      this.avatar = ev.target?.result?.toString() as string;
      this.cdr.markForCheck();
    };

    fileReader.readAsDataURL(f);

    this.avatarFile = f;
    this.cdr.markForCheck();
  }
}
