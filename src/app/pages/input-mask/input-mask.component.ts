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

  // for config
  @ViewChild('accInp') accInp: ElementRef<HTMLInputElement>;

  // for config
  configForm: FormGroup;
  showValue: boolean;

  form: FormGroup;
  accMaskOptions: IInputMaskOptions;
  phoneMaskOptions: IInputMaskOptions;
  nameMaskOptions: IInputMaskOptions;
  emailMaskOptions: IInputMaskOptions;

  // for config
  get accSIndxControl(): AbstractControl | null {
    return this.configForm.get('accSIndex');
  }

  // for config
  get accSymbolControl(): AbstractControl | null {
    return this.configForm.get('accSymbol');
  }

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
    // for config
    private renderer2: Renderer2,
    private inputMaskUtilService: InputMaskUtilService,
  ) {
    this.buildForm();

  }

  ngOnInit(): void {
    this.generatorMaskOptions();
    this.bindFormValueChange();
    this.showValue = false;
  }

  private buildForm(): void {
    this.configForm = this.fb.group({
      accSIndex: [null, [ Validators.min(1), Validators.max(10)]],
      accSymbol: [null, [ Validators.maxLength(1), Validators.pattern(/^[^\u4e00-\u9fa5\da-zA-z]*$/) ]],
    })
    this.form = this.fb.group({
      account: ['', [ Validators.required, Validators.maxLength(10) ]],
      phone: ['', [ Validators.required, Validators.maxLength(10) ]],
      email: ['', [ Validators.required, Validators.maxLength(30), Validators.email ]],
      name: ['', [ Validators.required, Validators.maxLength(30) ]],
    });
  }

  // 建立初始化 MaskOptions
  private generatorMaskOptions(): void {
    this.accMaskOptions = this.inputMaskUtilService.generatorMaskOptions('acc');
    this.phoneMaskOptions = this.inputMaskUtilService.generatorMaskOptions('phone');
    this.emailMaskOptions = this.inputMaskUtilService.generatorMaskOptions('email');
    this.nameMaskOptions = this.inputMaskUtilService.generatorMaskOptions('name');
  }

  // for config
  private bindFormValueChange(): void {
    this.form.valueChanges.subscribe(() => {
      this.showValue = false;
    });

    // this.emailControl?.valueChanges?.pipe(
    //   skip(1) // 略過初始值
    // ).subscribe((value: string) => {
    //   if(!value) return;
    //   // @ 前的全部隱碼
    //   const atIdx: number = value.indexOf('@') !== -1 ? value.indexOf('@') : value.length;
    //   this.emailMaskOptions = {...this.emailMaskOptions, cut: atIdx, update: true };
    // });

    // this.nameControl?.valueChanges?.pipe(
    //   skip(1)
    // ).subscribe((value: string) => {
    //    // name: 王*、王*明、王**明、A*、A*n、A**y
    //   const lastIdx: number = value.length > 1 ? value.length - 1 : (value.length === 1 ? 1 : 0);
    //   this.nameMaskOptions = {...this.nameMaskOptions, cut: lastIdx, update: true };
    // });
  }

  /**
   * emailChange：用來隨時偵測 @ 的Index，在來修改 sIndex 的值
   *
   * ※ 不可使用 valueChanges 及 ngModuleChange，會導至 InputMaskDirective 的
   * ngOnChanges 重覆偵測問題：
   *
   * 因為 InputMaskDirective 使用 ControlValueAccessor 的 this.onChange 來更新 Form
   * 的值，會導致重新觸發 valueChanges，造成多次呼叫問題。
   *
   */
  emailChange(value: string): void {
    if(!value) return;
    // @ 前的全部隱碼
    const atIdx: number = value.indexOf('@') !== -1 ? value.indexOf('@') : value.length;
    this.emailMaskOptions = {...this.emailMaskOptions, cut: atIdx, update: true };
  }

  /**
   * nameChange ：用來隨時偵測姓名的長度，在來修改 sIndex 的值
   *
   * ※ 不可使用 valueChanges 及 ngModuleChange，會導至 InputMaskDirective 的
   * ngOnChanges 重覆偵測問題：
   *
   * 因為 InputMaskDirective 使用 ControlValueAccessor 的 this.onChange 來更新 Form
   * 的值，會導致重新觸發 valueChanges，造成多次呼叫問題。
   *
   */
  nameChange(value: string): void {
    // name: 王*、王*明、王**明、A*、A*n、A**y
    const lastIdx: number = value.length > 2 ? value.length - 2 : (value.length === 2 ? 1 : 0);
    this.nameMaskOptions = {...this.nameMaskOptions, cut: lastIdx, update: true };
  }

  // 配置自定義帳號 sIndex 及 symbol 設定，for config
  accConfig(): void {
    this.setAccElementValue();
    this.showValue = false;
    const setSIndex: number = typeof this.accSIndxControl?.value === 'number' ?  this.accSIndxControl?.value - 1 : this.accMaskOptions.sIndex;
    const setSymbol: string = this.accSymbolControl?.value ? this.accSymbolControl?.value : (this.accMaskOptions?.symbol ?? '*');
    this.accMaskOptions = {...this.accMaskOptions, sIndex: setSIndex, symbol: setSymbol };
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
      case 'email':
        this.emailMaskOptions = { ...maskOption };
        break;
      case 'name':
        this.nameMaskOptions = { ...maskOption };
        break;
      default:
        return;
    }
  }

  defaultMaskOptions(): void {
    this.accSIndxControl?.patchValue(null, {emitEvent: false});
    this.accSymbolControl?.patchValue(null, {emitEvent: false});
    this.setAccElementValue();
    this.accMaskOptions = this.inputMaskUtilService.generatorMaskOptions('acc');
  }

  // for config
  private setAccElementValue(): void {
    // 將 HTMLInputElement 的 value 重新設定，該值主要於頁面上顯示用
    this.renderer2.setProperty(this.accInp.nativeElement, 'value', this.accControl?.value);
  }

  // for config
  showFormValue(): void {
    if(this.form?.valid){
      this.showValue = true;
    }
  }
}
