import {
  ChangeDetectionStrategy,
  Component,
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
import { ChatsService } from '../../../../../data-access/src/lib/chats/services';
import { ActivatedRoute } from '@angular/router';

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

  // @Input()
  // valueFromFiltreComp: string = '';

  @Input()
  value!: string;

  route = inject(ActivatedRoute);

  constructor(private chatsService: ChatsService) {}

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes['valueFromFiltreComp'].currentValue) {
    //   this.toFilter();
    // }
    if (changes['value'].currentValue == '')
      this.chats$ = this.chatsService.chats$;
    if (changes['value'].currentValue) {
      this.toFilter();
    }
  }

  ngOnInit(): void {
    this.chatsService
      .getMyChats()
      .pipe
      // tap(chats => )
      ()
      .subscribe();
    this.chats$ = this.chatsService.chats$;

    // this.chats$ = this.route.data.pipe(map((v) => v['chatList']));

    this.chats$.subscribe((v) => (this.chats = v as Chat[]));
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
        // this.filteredChats = this.chats.filter((v) => {

        //   return `${v.userFrom.firstName} ${v.userFrom.lastName}`.toLowerCase().includes(
        //     this.valueFromFiltreComp.toLowerCase()
        //   )
        //     ? v
        //     : null;
        // }
      )
    );
  }
}
