import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective {

  constructor(private elementRef: ElementRef) { }

  @Output() public appClickOutside = new EventEmitter<MouseEvent>();

  @HostListener("document:click", ["$event", "$event.target"])
  public onClick(event: MouseEvent, target: HTMLElement) {
    if (!target) return;

    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside) {
      this.appClickOutside.emit(event);
    }
  }

}
