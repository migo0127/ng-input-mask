import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputMaskComponent } from './pages/input-mask/input-mask.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './share/material.module';
import { ShareModule } from './share/share.module';

@NgModule({
  declarations: [
    AppComponent,
    InputMaskComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    BrowserAnimationsModule,
    MaterialModule,
    ShareModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
