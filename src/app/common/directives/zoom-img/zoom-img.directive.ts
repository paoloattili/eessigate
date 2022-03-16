import { Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output } from "@angular/core";

@Directive({
  selector: '[zoomImg]'
})
export class ZoomImgDirective {
  @Input() cssInput: any;
  @Output() ingrandito: EventEmitter<boolean> = new EventEmitter<boolean>();
  imgElement: ElementRef;

  constructor(private el: ElementRef) { 
    this.imgElement = el;
  }

  // Click img
  @HostListener('document:click', ['$event']) 
  public onZoom(event: MouseEvent) {
    console.warn('cssInput',this.cssInput);
    console.warn('this.imgElement',this.imgElement);
    console.warn('event.target',event.target);
    if (!event.target) {
      return;
    }

    const clickedInside = this.imgElement.nativeElement === event.target;
    console.warn('clickedInside',clickedInside);
    if (!clickedInside) {
      console.warn('elemento diverso');
      this.imgElement.nativeElement.style.position = 'relative';
      this.imgElement.nativeElement.style.transform = 'translate(0,0)';
      this.imgElement.nativeElement.style.transition = '1s';
      this.imgElement.nativeElement.style.border = 'none';
      this.imgElement.nativeElement.style.zIndex = '0';
      this.ingrandito.emit(false);
    } else {
      let css = JSON.parse(JSON.stringify(this.cssInput));
      console.warn('css',css);
      if(css) {
        this.imgElement.nativeElement.style.position = css.position?.toString();
        this.imgElement.nativeElement.style.top = css.top?.toString();
        this.imgElement.nativeElement.style.left = css.left?.toString();
        // this.imgElement.nativeElement.style.right = css.right?.toString();
        this.imgElement.nativeElement.style.transform = css.transform?.toString();
        this.imgElement.nativeElement.style.transition = css.transition?.toString();
        this.imgElement.nativeElement.style.zIndex = css.z_index?.toString();
        this.imgElement.nativeElement.style.border = css.border?.toString();
        this.imgElement.nativeElement.style.backgroundColor = css.background_color?.toString();
        this.ingrandito.emit(true);
      }
    }

  }

}
