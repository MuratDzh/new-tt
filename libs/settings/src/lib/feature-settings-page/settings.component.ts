import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  Renderer2,
  signal,
  ViewChild,
} from '@angular/core';

import {
  map,
  Observable,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { Profile } from '@tt/interfaces/profile';
import { ProfileService, selectMe } from '@tt/shared';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AvatarUploadComponent } from '../feature-avatar-upload/avatar-upload.component';
import { Store } from '@ngrx/store';
import { ImgPipe, TextareaDirective } from '@tt/common-ui';
import {StackInputComponent} from "./../stack-input/stack-input.component";
import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
    StackInputComponent
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

  fb = inject(FormBuilder);

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: [{ value: '', disabled: true }],
    description: [''],
    stack: <string[]>[],
  });

  destroyRef=inject(DestroyRef)

  constructor(
    private profService: ProfileService,

    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.me$ = this.store.select(selectMe);

    this.me$
      .pipe(
        switchMap((v) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-expect-error
          return of(this.form.patchValue(v)).pipe(
            take(1)
          );
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  onSave() {
    const avatarFile = this.avatarUpload.avatarFile;

    const value = {
      ...this.form.value,
      stack: this.splitStac(this.form.value.stack),
    };

    if (avatarFile) {
     
      this.profService

        .uploadImg(avatarFile)
        .pipe(
          switchMap(() => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
            return this.profService.patchMe(value).pipe(
              tap((v) => {
                (this.me$ = of(v)), this.cdr.detectChanges();
                // return setTimeout(() => {
                //   (this.me$ = of(v)), this.cdr.markForCheck();
                // }, 0);
              })
            );
          }),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe();
    } else {
      this.profService
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        .patchMe(value)
        .pipe(
          map((v) => {
            return setTimeout(() => {
              (this.me$ = of(v)), this.cdr.markForCheck();
            }, 0);
          }),
          takeUntilDestroyed(this.destroyRef)
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
