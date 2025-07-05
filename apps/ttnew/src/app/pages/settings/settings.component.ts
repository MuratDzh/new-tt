import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  OnInit,
  Renderer2,
  signal,
  ViewChild,
} from '@angular/core';

import {
  concatMap,
  map,
  Observable,
  of,
  startWith,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { Profile } from '../../data/interfces/profile.interface';
import { ProfileService } from '../../data/services/profile.service';
import { CommonModule } from '@angular/common';
import { ImgPipe } from '../../helpers/pipes/img.pipe';
import { TextareaDirective } from '../../helpers/directives/textarea.directive';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AvatarUploadComponent } from './avatar-upload.component';
import { Store } from '@ngrx/store';
import { selectMe } from '../../data/currentUserStore/current-user.reducer';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ImgPipe,
    TextareaDirective,
    FormsModule,
    ReactiveFormsModule,
    AvatarUploadComponent,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit {
  me$!: Observable<Profile | null>;
  me1 = signal<Partial<Profile>>({});

  @ViewChild(AvatarUploadComponent)
  avatarUpload!: AvatarUploadComponent;

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: [{ value: '', disabled: true }],
    description: [''],
    stack: <string[]>[],
  });

  constructor(
    private profService: ProfileService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.me$ = this.store.select(selectMe);

    this.me$
      .pipe(
        switchMap((v) => {
          //@ts-ignore
          return of(this.form.patchValue(v)).pipe(
            tap(() => console.log('TAP')),
            take(1)
          );
        })
      )
      .subscribe();
  }

  onSave() {
    let avatarFile = this.avatarUpload.avatarFile;

    let value = {
      ...this.form.value,
      stack: this.splitStac(this.form.value.stack),
    };

    if (avatarFile) {
      //@ts-ignore
      this.profService
        //@ts-ignore
        .uploadImg(avatarFile)
        .pipe(
          switchMap(() => {
            //@ts-ignore
            return this.profService.patchMe(value).pipe(
              tap((v) => {
                (this.me$ = of(v)), this.cdr.detectChanges();
                // return setTimeout(() => {
                //   (this.me$ = of(v)), this.cdr.markForCheck();
                // }, 0);
              })
            );
          })
        )
        .subscribe();
    } else {
      this.profService
        //@ts-ignore
        .patchMe(value)
        .pipe(
          map((v) => {
            return setTimeout(() => {
              (this.me$ = of(v)), this.cdr.markForCheck();
            }, 0);
          })
        )
        .subscribe();
    }

    this.renderer.setStyle(
      this.avatarUpload.div.nativeElement,
      'borderColor',
      'var(--light-color)'
    );
  }

  splitStac(stac: string | null | string[] | undefined): string[] {
    if (stac == null || undefined) return [];
    if (Array.isArray(stac)) return stac;
    return stac?.split(',');
  }

  mergeStac(stac: string[]): string {
    return stac.join();
  }
}
