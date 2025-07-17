import { Directive, Input, OnChanges, SimpleChanges, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Message } from '@tt/interfaces/chat';

@Directive({
  selector: '[messageGroupDate]',
  standalone: true,
})
export class MessageGroupDateDirective implements OnChanges, OnInit {
  @Input('messageGroupDate')
  messages!: Message[];

  @Input()
  messageGroupDateIndex!: number;

  currentMessageDateDay!: number;
  previousMessageDateDay!: number;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    // console.log('MessageGroupDate', this.messages);
    // console.log('index', this.messageGroupDateIndex);
    this.currentMessageDateDay = new Date(
      this.messages[this.messageGroupDateIndex].createdAt
    ).getDate();
    this.previousMessageDateDay = new Date(
      this.messages[this.messageGroupDateIndex == 0 ? this.messageGroupDateIndex : this.messageGroupDateIndex - 1].createdAt
    ).getDate();
  }

  ngOnInit(): void {
    // console.log('currentMessageDateDay', this.currentMessageDateDay);

    if (this.messageGroupDateIndex !== 0) {
      if (this.currentMessageDateDay !== this.previousMessageDateDay) {
        this.viewContainer.createEmbeddedView(this.templateRef);

      }
    } else {

      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
