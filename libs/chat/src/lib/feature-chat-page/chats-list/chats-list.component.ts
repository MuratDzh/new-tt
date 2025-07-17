import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

import { Observable, of } from 'rxjs';

import { CommonModule } from '@angular/common';
import { ChatsBtnComponent } from '../../ui/chats-btn/chats-btn.component';
import { Chat } from '@tt/interfaces/chat';
import { ChatsService } from '@tt/data-access';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-chats-list',
  standalone: true,
  imports: [CommonModule, ChatsBtnComponent],
  templateUrl: './chats-list.component.html',
  styleUrl: './chats-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatsListComponent implements OnInit, OnChanges {
  chats$!: Observable<Chat[] | null>;
  chats!: Chat[];
  filteredChats!: Chat[] | null;

  @Input()
  value!: string;

  route = inject(ActivatedRoute);
  chatsService = inject(ChatsService);
  destroyRef=inject(DestroyRef)
  

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'].currentValue == '')
      this.chats$ = this.chatsService.chats$;
    if (changes['value'].currentValue) {
      this.toFilter();
    }
  }

  ngOnInit(): void {
    this.chatsService.getMyChats().subscribe();
    this.chats$ = this.chatsService.chats$;

    this.chats$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((v) => (this.chats = v as Chat[]));
  }
  toFilter() {
    this.chats$ = of(
      this.chats.filter(
        (v) => {
          return `${v.userFrom.firstName} ${v.userFrom.lastName}`
            .toLowerCase()
            .includes(this.value.toLowerCase())
            ? v
            : null;
        }
        
      )
    );
  }
}
