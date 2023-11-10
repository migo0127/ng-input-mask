import { Injectable } from "@angular/core";
import { AbstractControl, ValidationErrors } from "@angular/forms";
import { IInputMaskOptions } from "src/app/model/input-mask-options.model";

@Injectable({
  providedIn: 'root'
})
export class InputMaskUtilService {

  constructor() { }

  // 建立初始化 MaskOptions
  generatorMaskOptions(type: string): IInputMaskOptions {
    switch(type) {
      case 'acc':
        return {
          show: false,
          sIndex: 3,
          rexExp: /[^a-zA-Z0-9]+$/,
          cut: 3,
        }
      case 'phone':
        return {
          show: false,
          sIndex: 4,
          cut: 4,
          rexExp: /\D+$/,
          symbol: '●'
        }
      case 'email':
        return {
          show: false,
          sIndex: 0,
          cut: 3,
        }
      case 'name':
        return {
          show: false,
          sIndex: 1,
          // rexExp: /^[!@#\$%\^&\*\(\)_\+\-=\[\]{}|;:'",.<>\/?\s\d]+$/i,
          cut: 0,
        }
      default:
        return {
          show: false,
          sIndex: 3,
          cut: 3,
        }
    }
  }

}
