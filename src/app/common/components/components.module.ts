import { NotificheComponent } from "./notifiche/notifiche.component";
import {NgModule} from "@angular/core";
import {TreeComponent} from "./tree/tree.component";
import {AngularMaterialModule} from "../../shared/angular-material/angular-material.module";
import {CommonModule} from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import {ChatComponent} from "./chat/chat.component";

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    TreeComponent,
    ChatComponent,
  ],
  exports: [
    TreeComponent,
    ChatComponent,
  ],
})
export class ComponentsModule {}
