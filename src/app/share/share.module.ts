import { NgModule } from "@angular/core";
import { InputMaskDirective } from "./input-mask.directive";

const shares: any[] = [
  InputMaskDirective,
];

@NgModule({
  imports: [],
  declarations: [
    ...shares
  ],
  exports: [
    ...shares
  ],
})
export class ShareModule {}
