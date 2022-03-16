import {NgModule} from "@angular/core";
import {DndFileDirective} from "./drag-and-drop-files/dndFile.directive";
import { ZoomImgDirective } from './zoom-img/zoom-img.directive';

@NgModule({
  declarations: [
    DndFileDirective,
    ZoomImgDirective
  ],
  exports: [
    DndFileDirective,
    ZoomImgDirective
  ],
})
export class DirectivesModule {}
