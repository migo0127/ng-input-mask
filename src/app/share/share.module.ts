import { NgModule } from "@angular/core";
import { InputMaskDirective } from "./input-mask.directive";
import { DynamicInputMaskDirective } from "./dynamic-input-mask.directive";

const shares: any[] = [
  InputMaskDirective,
  DynamicInputMaskDirective,
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
