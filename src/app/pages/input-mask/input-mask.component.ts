import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IInputMaskOptions } from 'src/app/model/input-mask-options.model';
import { InputMaskUtilService } from './input-mask-util.service';

@Component({
  selector: 'app-input-mask',
  templateUrl: './input-mask.component.html',
  styleUrls: ['./input-mask.component.scss'],
})
export class InputMaskComponent implements OnInit {

  form: FormGroup;
  accMaskOptions: IInputMaskOptions;
  phoneMaskOptions: IInputMaskOptions;
  nameMaskOptions: IInputMaskOptions;
  emailMaskOptions: IInputMaskOptions;

  get accControl(): AbstractControl | null {
    return this.form.get('account');
  }

  get phoneControl(): AbstractControl | null {
    return this.form.get('phone');
  }

  get nameControl(): AbstractControl | null {
    return this.form.get('name');
  }

  get emailControl(): AbstractControl | null {
    return this.form.get('email');
  }

  constructor(
    private fb: FormBuilder,
    private renderer2: Renderer2,
    private inputMaskUtilService: InputMaskUtilService,
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.generatorMaskOptions();
    this.bindValueChange();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      account: ['', [ Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/ig) ]],
      phone: ['', [ Validators.required ]],
      name: ['', [ Validators.required ]],
      email: ['', [ Validators.required ]]
    });
  }

  // 建立初始化 MaskOptions
  private generatorMaskOptions(): void {
    this.accMaskOptions = this.inputMaskUtilService.generatorMaskOptions('acc');
    this.phoneMaskOptions = this.inputMaskUtilService.generatorMaskOptions('phone');
    this.nameMaskOptions = this.inputMaskUtilService.generatorMaskOptions('name');
    this.emailMaskOptions = this.inputMaskUtilService.generatorMaskOptions('email');
  }

  private bindValueChange(): void {
    this.nameControl?.valueChanges?.subscribe((value: string) => {
      // name: 王*、王*明、王**明、A*、A*n、A**y
      const lastIdx: number = value.length > 2 ? value.length - 2 : (value.length === 2 ? 1 : 0);
      this.nameMaskOptions.cut = lastIdx;
      this.nameMaskOptions = {...this.nameMaskOptions, cut: lastIdx};
    });

    this.emailControl?.valueChanges?.subscribe((value: string) => {
      // @前的全部隱碼
      const atIdx: number = value.indexOf('@') !== -1 ? value.indexOf('@') : value.length;
      this.emailMaskOptions = {...this.emailMaskOptions, cut: atIdx};
    });
  }

  private setValue(e: HTMLInputElement, control: AbstractControl, value: string): void {
    this.renderer2.setProperty(e, 'value', value);
    control.patchValue(value, { emitEvent: false });
    console.log(e.value)
  }

  // 切換明隱碼狀態
  changeVisibility(maskOption: IInputMaskOptions, type: string): void {
    maskOption.show = !maskOption.show;
    switch(type){
      case 'acc':
        this.accMaskOptions = { ...maskOption };
        break;
      case 'phone':
        this.phoneMaskOptions = { ...maskOption };
        break;
      case 'name':
        this.nameMaskOptions = { ...maskOption };
        break;
      case 'email':
        this.emailMaskOptions = { ...maskOption };
        break;
      default:
        return;
    }
  }


}
