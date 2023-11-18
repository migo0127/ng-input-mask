import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDynamicInputMaskOptions, IInputMaskOptions } from "src/app/model";
import { InputMaskUtilService } from './input-mask-util.service';

@Component({
  selector: 'app-input-mask',
  templateUrl: './input-mask.component.html',
  styleUrls: ['./input-mask.component.scss'],
})
export class InputMaskComponent implements OnInit {

  form: FormGroup;
  showValue: boolean;
  accMaskOptions: IInputMaskOptions;
  phoneMaskOptions: IInputMaskOptions;
  emailMaskOptions: IDynamicInputMaskOptions;
  nameMaskOptions: IDynamicInputMaskOptions;

  get accControl(): AbstractControl | null {
    return this.form.get('account');
  }

  get phoneControl(): AbstractControl | null {
    return this.form.get('phone');
  }

  get emailControl(): AbstractControl | null {
    return this.form.get('email');
  }

  get nameControl(): AbstractControl | null {
    return this.form.get('name');
  }

  constructor(
    private fb: FormBuilder,
    private inputMaskUtilService: InputMaskUtilService,
  ) {}

  ngOnInit(): void {
    this.generatorMaskOptions();
    this.buildForm();
    this.bindFormChange();
  }

  // 建立初始化 MaskOptions
  private generatorMaskOptions(): void {
    this.accMaskOptions = this.inputMaskUtilService.generatorMaskOptions('acc');
    this.phoneMaskOptions = this.inputMaskUtilService.generatorMaskOptions('phone');
    this.emailMaskOptions = this.inputMaskUtilService.generatorMaskOptions('email');
    this.nameMaskOptions = this.inputMaskUtilService.generatorMaskOptions('name');
  }

  private buildForm(): void {
    this.form = this.fb.group({
      account: ['', [ Validators.required, Validators.maxLength(10), Validators.pattern(/^[a-zA-Z0-9]+$/)]],
      phone: ['', [ Validators.required, Validators.maxLength(10), Validators.pattern(/^[\d]+$/) ]],
      email: ['', [ Validators.required, Validators.maxLength(30), Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) ]],
      name: ['', [ Validators.required, Validators.maxLength(30), Validators.pattern(/^[\u4e00-\u9fa5a-zA-Z\s]+$/) ]],
    });
  }

  private bindFormChange(): void {
    this.form.valueChanges.subscribe(() => {
      this.showValue = false;
    });
  }

  /**
   * 當使用 dynamicInputMaskD 處理明隱碼時，因需要另外傳入 Event 事件，所以不使用
   * valueChanges，改使用 (input) 事件處理。
   */
  emailChange(value: string, event: Event): void {
    const atIdx: number = value.indexOf('@') !== -1 ? value.indexOf('@') : value.length;
    this.emailMaskOptions = {...this.emailMaskOptions, cut: atIdx, event: event };
  }

  /**
   * 當使用 dynamicInputMaskD 處理明隱碼時，因需要另外傳入 Event 事件，所以不使用
   * valueChanges，改使用 (input) 事件處理。
   */
  nameChange(value: string, event: Event): void {
    const lastIdx: number = value.length > 2 ? value.length - 2 : (value.length === 2 ? 1 : 0);
    this.nameMaskOptions = {...this.nameMaskOptions, cut: lastIdx, event: event };
  }

  // 單純切換明隱碼狀態
  changeVisibility(maskOption: IInputMaskOptions | IDynamicInputMaskOptions, type: string): void {
    maskOption.show = !maskOption.show;
    switch(type){
      case 'acc':
        this.accMaskOptions = { ...maskOption };
        break;
      case 'phone':
        this.phoneMaskOptions = { ...maskOption };
        break;
      case 'email':
        // 單純切換明隱碼時，需要清除 dynamic mask 的 event，否則會再重新計算
        this.emailMaskOptions = { ...maskOption, event: null };
        break;
      case 'name':
        // 單純切換明隱碼時，需要清除 dynamic mask 的 event，否則會再重新計算
        this.nameMaskOptions = { ...maskOption, event: null };
        break;
      default:
        return;
    }
  }

  showFormValue(): void {
    this.showValue = !this.form.invalid;
  }

}
