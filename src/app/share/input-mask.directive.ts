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

    // console.log(isMaskAreaEntry, selectionEnd, displayValue.length, isDelete, isInert);

    if(displayValue){
      // 當輸入的字元位於隱碼區域內
      if(isMaskAreaEntry && active === 'input'){
        if(isDelete){
          // 將隱碼刪除
          this.tempMask.splice(selectionEnd - this.maskOptions.cut, 1);
        }else if(isInert){
          // 在隱碼區域新增字元
          // 須先將新增字元加入對應的暫存的 tempMask 裡
          const idx: number = selectionEnd - this.maskOptions.sIndex - 1;
          this.tempMask.splice(idx, 0, (e as InputEvent)?.data || '');
          // 在將所有暫存的字元（tempMask）替換回 text 裡，使 text 變成全明碼的狀態
          this.updateTextWithMask(displayValue, text);
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

  // 在將所有暫存的字元（tempMask）替換回 text 裡，使 text 變成全明碼的狀態
  private updateTextWithMask(displayValue: string, text: string[]): void {
    for(let i = 0; i < displayValue.length; i++){
      if(i >= this.maskOptions.sIndex && i <= this.maskOptions.sIndex + this.maskOptions.cut){
          text.splice(i, 1, this.tempMask[i - this.maskOptions.sIndex]);
      }
    }
    // 在將多暫存的字元移除，保持相對應的 cut 所儲存的 N 位
    this.tempMask.splice(this.tempMask.length - 1, 1);
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
