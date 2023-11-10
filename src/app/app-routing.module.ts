import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { InputMaskComponent } from "./pages/input-mask/input-mask.component";

const routes: Routes = [
  { path: '', redirectTo: 'input-mask', pathMatch: 'full' },
  { path: 'input-mask', component: InputMaskComponent },
  { path: '**', redirectTo: 'input-mask' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports:[RouterModule]
})
export class AppRoutingModule {}
