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

  form: FormGroup;
  showValue: boolean;
  accMaskOptions: IInputMaskOptions;
  phoneMaskOptions: IInputMaskOptions;

  get accControl(): AbstractControl | null {
    return this.form.get('account');
  }

  get phoneControl(): AbstractControl | null {
    return this.form.get('phone');
  }

  constructor(
    private fb: FormBuilder,
    private inputMaskUtilService: InputMaskUtilService,
  ) {}

  ngOnInit(): void {
    this.generatorMaskOptions();
    this.buildForm();
  }

  // 建立初始化 MaskOptions
  private generatorMaskOptions(): void {
    this.accMaskOptions = this.inputMaskUtilService.generatorMaskOptions('acc');
    this.phoneMaskOptions = this.inputMaskUtilService.generatorMaskOptions('phone');
  }

  private buildForm(): void {
    this.form = this.fb.group({
      account: ['', [ Validators.required, Validators.maxLength(10), Validators.pattern(/^[a-zA-Z0-9]+$/)]],
      phone: ['', [ Validators.required, Validators.maxLength(10), Validators.pattern(/^[\d]+$/) ]],
    });
    this.bindFormChange();
  }

  private bindFormChange(): void {
    this.form.valueChanges.subscribe(() => {
      this.showValue = false;
    });
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

  showFormValue(): void {
    this.showValue = !this.form.invalid;
  }
}
