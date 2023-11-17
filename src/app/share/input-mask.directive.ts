import { Directive, ElementRef, HostListener, Input, OnChanges, Renderer2, Self } from "@angular/core";
import { IInputMaskOptions } from "../model/input-mask-options.model";
import { ControlValueAccessor, NgControl } from "@angular/forms";

interface IReplaceValueData {
  displayValue: string;
  maskValue: string;
}

@Directive({
  selector: '[inputMaskD]',
})
export class InputMaskDirective implements ControlValueAccessor, OnChanges {

  @Input('inputMaskD') maskOptions: IInputMaskOptions;

  tempMask: string[] = [];

  ngOnChanges(): void {
    // console.log('ngOnChanges: ', this.maskOptions);
    const replaceValue: IReplaceValueData = this.replaceText(this.erf.nativeElement, 'change');
    if(this.erf.nativeElement && replaceValue){
      this.setValue(this.erf.nativeElement, replaceValue);
    }
  }

  onChange: (value: string) => { };
  onTouched: () => {};

  constructor(
    private erf: ElementRef,
    private renderer2: Renderer2,
    @Self() private ngControl: NgControl,
  ) {
    ngControl.valueAccessor = this;
  }

  ngOnInit(): void {}

  writeValue(value: string): void {
    // console.log('writeValue',value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  @HostListener('input', ['$event'])
  onInput(e: Event): void{
    // console.log('onInput', this.maskOptions?.update);
    // 當 maskOptions 值變動時，會同時觸發 onInput 及 ngOnChanges，但需要依 ngOnChanges 的值為準，所以當 maskOptions?.update 是 true 時，不觸發 onInput
    if(this.maskOptions?.update) return;
    const replaceValue: IReplaceValueData = this.replaceText(e, 'input');
    if(e && replaceValue){
      this.setValue(e, replaceValue);
    }
  }

  private replaceText(e: Event | ElementRef<HTMLInputElement> | null, active: string): IReplaceValueData {
    this.maskOptions.symbol = this.maskOptions?.symbol ? this.maskOptions.symbol : '*';
    const inpElement: HTMLInputElement | null = this.getElement(e);
    const selectionEnd = inpElement?.selectionEnd || 0;
    const isDelete: boolean = (e as InputEvent)?.inputType?.includes('Backward');
    const isInert: boolean = !isDelete && (this.maskOptions.sIndex >= selectionEnd - this.maskOptions.cut &&
      selectionEnd - this.maskOptions.cut < this.maskOptions.sIndex + this.maskOptions.cut);
    let displayValue: string = '';
    if(this.maskOptions?.rexExp && inpElement?.value && (active === 'input' || this.maskOptions.update)){
      displayValue = inpElement?.value.replace(this.maskOptions.rexExp, '') || '';
    }else{
      displayValue = inpElement?.value ?? '';
    }

    const isMaskAreaEntry: boolean = selectionEnd !== 0 && selectionEnd !== displayValue.length;
    const text: string[] = Array.from(displayValue);
    let temp: string = '';

    // console.log(isMiddleSelection, selectionEnd, displayValue.length, isDelete, isInert)

    if(displayValue){
      if(isMaskAreaEntry){
        if(isDelete){
          this.tempMask.splice(selectionEnd - this.maskOptions.cut, 1);
        }else if(isInert){
          this.tempMask.splice((this.maskOptions.sIndex + this.maskOptions.cut) - selectionEnd  , 0, (e as InputEvent)?.data || '');
          for(let i = 0; i < displayValue.length; i++){
            if(i >= this.maskOptions.sIndex && i <= this.maskOptions.sIndex + this.maskOptions.cut){
                text.splice(i, 1, this.tempMask[i - this.maskOptions.sIndex]);
            }
          }
          this.tempMask.splice(this.tempMask.length - 1, 1);
        }
      }

      // 提取要被改成 symbol 的文字，暫存在 tempMask 裡
      for (let i = 0; i < this.maskOptions.cut; i++) {
        if (text[this.maskOptions.sIndex + i] != this.maskOptions.symbol) {
          this.tempMask[i] = <string>text[this.maskOptions.sIndex + i];
        }
      }

      this.tempMask = this.tempMask.filter((v: string) => v);
      // console.log('tempMask: ', this.tempMask);

      // 提取 symbol 前後區域的明碼
      const front = displayValue.substring(0, this.maskOptions.sIndex) || '';
      const back = displayValue.substring(this.maskOptions.sIndex + this.maskOptions.cut) || '';
      // 重新組合名碼文字
      temp = front + this.tempMask.join('') + back;

      // 將只定區域的文字改成 symbol
      for (let i = 0; i < this.maskOptions.cut; i++) {
        if (text[this.maskOptions.sIndex + i]) {
          text[this.maskOptions.sIndex + i] = this.maskOptions.symbol
        }
      }
    }else{
      this.tempMask = [];
    }

    return {
      displayValue: temp,
      maskValue: text.join('')
    }
  }

  private setValue(e: ElementRef<HTMLInputElement> | Event, replaceValue: IReplaceValueData): void {
    const inpElement: HTMLInputElement | null = this.getElement(e);

    // 將值塞入 element 的 value 屬性裡，這裡只會顯示，不會連動到 formControl 的值
    if(this.maskOptions.show){
      this.renderer2.setProperty(
        inpElement,
        'value',
        replaceValue.displayValue
      );
    }else{
      this.renderer2.setProperty(
        inpElement,
        'value',
        replaceValue.maskValue
      );
    }

    // this.onChange 賦值給 formControl 的值，不會連動到 HTMLInputElement 的 value
    if(replaceValue.displayValue !== this.ngControl.value){
      // console.log('onChange', [replaceValue.displayValue, this.ngControl.value]);
      this.onChange(replaceValue.displayValue);
    }
  }

  private getElement(e: Event | ElementRef<HTMLInputElement> | null): HTMLInputElement | null {
    return (e instanceof HTMLInputElement) ? e : (e as Event).target as HTMLInputElement;
  }

}
