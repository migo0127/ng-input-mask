import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IInputMaskOptions } from 'src/app/model/input-mask-options.model';
import { InputMaskUtilService } from './input-mask-util.service';

@Component({
  selector: 'app-input-mask',
  templateUrl: './input-mask.component.html',
  styleUrls: ['./input-mask.component.scss'],
})
export class InputMaskComponent implements OnInit {

  // for config
  // @ViewChild('accInp') accInp: ElementRef<HTMLInputElement>;

  // for config
  // configForm: FormGroup;
  // showValue: boolean;

  form: FormGroup;
  accMaskOptions: IInputMaskOptions;
  phoneMaskOptions: IInputMaskOptions;

  // for config
  // get accSIndxControl(): AbstractControl | null {
  //   return this.configForm.get('accSIndex');
  // }

  // // for config
  // get accSymbolControl(): AbstractControl | null {
  //   return this.configForm.get('accSymbol');
  // }

  get accControl(): AbstractControl | null {
    return this.form.get('account');
  }

  get phoneControl(): AbstractControl | null {
    return this.form.get('phone');
  }

  constructor(
    private fb: FormBuilder,
    private inputMaskUtilService: InputMaskUtilService,
  ) {
    this.buildForm();

  }

  ngOnInit(): void {
    this.generatorMaskOptions();
    // this.bindFormValueChange();
  }

  private buildForm(): void {
    // this.configForm = this.fb.group({
    //   accSIndex: [null, [ Validators.min(1), Validators.max(10)]],
    //   accSymbol: [null, [ Validators.maxLength(1), Validators.pattern(/^[^\u4e00-\u9fa5\da-zA-z]*$/) ]],
    // })
    this.form = this.fb.group({
      account: ['', [ Validators.required, Validators.maxLength(10) ]],
      phone: ['', [ Validators.required, Validators.maxLength(10) ]],
    });
  }

  // 建立初始化 MaskOptions
  private generatorMaskOptions(): void {
    this.accMaskOptions = this.inputMaskUtilService.generatorMaskOptions('acc');
    this.phoneMaskOptions = this.inputMaskUtilService.generatorMaskOptions('phone');
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
      default:
        return;
    }
  }

  // defaultMaskOptions(): void {
  //   this.accSIndxControl?.patchValue(null, {emitEvent: false});
  //   this.accSymbolControl?.patchValue(null, {emitEvent: false});
  //   this.setAccElementValue();
  //   this.accMaskOptions = this.inputMaskUtilService.generatorMaskOptions('acc');
  // }

  // for config
  // private setAccElementValue(): void {
  //   // 將 HTMLInputElement 的 value 重新設定，該值主要於頁面上顯示用
  //   this.renderer2.setProperty(this.accInp.nativeElement, 'value', this.accControl?.value);
  // }

  // // for config
  showFormValue(): void {

  }
}
