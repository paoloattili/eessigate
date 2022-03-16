import {NgModule} from "@angular/core";
import {AngularMaterialModule} from "./angular-material/angular-material.module";
import {CommonModule} from "@angular/common";
import {ExtendedModule, FlexModule} from "@angular/flex-layout";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { EditorModule } from '@tinymce/tinymce-angular';
import {DragDropModule} from '@angular/cdk/drag-drop';

@NgModule({
  imports: [
    AngularMaterialModule,
    CommonModule,
    FlexModule,
    ReactiveFormsModule,
    FormsModule,
    EditorModule,
    DragDropModule,
    ExtendedModule,
  ],
  exports: [
    AngularMaterialModule,
    CommonModule,
    FlexModule,
    ReactiveFormsModule,
    FormsModule,
    EditorModule,
    DragDropModule,
    ExtendedModule,
  ],
})
export class SharedModule {}
