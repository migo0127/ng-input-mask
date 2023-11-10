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
          cut: 3,
        }
      case 'phone':
        return {
          show: false,
          sIndex: 4,
          cut: 4,
          symbol: '●'
        }
      case 'name':
        return {
          show: false,
          sIndex: 1,
          cut: 0,
        }
      case 'email':
        return {
          show: false,
          sIndex: 0,
          cut: 3,
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
