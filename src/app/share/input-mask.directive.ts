import { Directive, ElementRef, HostListener, Input, OnChanges, Renderer2, Self } from "@angular/core";
import { IInputMaskOptions, IReplaceValueData } from "src/app/model";
import { ControlValueAccessor, NgControl } from "@angular/forms";

/**
 * inputMaskD 與 dynamicInputMaskD 主要差別僅在第 22 行及 54 行，
 * 拆成兩支 Directive 只是單純先分開動態與固定 mask 的邏輯，固定
 * 也可直接使用 dynamicInputMaskD。
 */

@Directive({
  selector: '[inputMaskD]',
})
export class InputMaskDirective implements ControlValueAccessor, OnChanges {

  @Input('inputMaskD') maskOptions: IInputMaskOptions;

  temp: string[] = [];

  ngOnChanges(): void {
    // console.log('ngOnChanges: ', this.maskOptions);
    const replaceValue: IReplaceValueData = this.replaceText(this.erf.nativeElement);
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
    // console.log('onInput', this.maskOptions);
    const replaceValue: IReplaceValueData = this.replaceText(e);
    if(e && replaceValue){
      this.setValue(e, replaceValue);
    }
  }

  // 保存暫存的明碼及替換成隱碼
  private replaceText(e: Event | ElementRef<HTMLInputElement> | null): IReplaceValueData {
    // 默認 symbol 為 '*'
    const { symbol = '*', rexExp, sIndex, cut } = this.maskOptions;
    const inpElement: HTMLInputElement | null = this.getHTMLInputElement(e);
    let inputValue: string = inpElement?.value ?? '';
    if(rexExp){
      inputValue.replace(rexExp, '');
    }
    // 取得滑鼠當前所在位置
    const selectionEnd: number = inpElement?.selectionEnd || 0;

    // 取得 delete 及 insert 事件，並保存該值 data
    const inputEvent: InputEvent | null = e as InputEvent || null;
    const data: string | null = inputEvent ? inputEvent.data : null;
    const isDelete: boolean = inputEvent?.inputType?.includes('delete');
    const isInsert: boolean = inputEvent?.inputType?.includes('insert');

    // 將當前輸入框的值轉成 array
    const text: string[] = Array.from(inputValue);
    let maskValue: string[] = [];

    // console.log('status: ', {selectionEnd, data, isDelete, isInsert});

    if(inputValue){
      if(isDelete){
        // 當點擊刪除時，將暫存的相對位置的值刪除
        this.temp.splice(selectionEnd, 1);
      }else if(isInsert && data) {
        // 當新增字元時，將值新增進暫存的相對位置
        this.temp.splice(selectionEnd - 1, 0, data);
      }

      for(let i = 0; i < text.length; i++){
        if(text[i] !== symbol){
          // 將明碼全部暫存起來
          this.temp[i] = text[i];
        }
      }

      // 將明碼賦值給隱碼變數
      maskValue = [...this.temp];

      // 將隱碼變數指定區域的文字改成 symbol
      maskValue.fill(symbol, sIndex, sIndex + cut);

    }else{
      this.temp = [];
    }

    // console.log('value: ', { temp: [...this.temp], text: [...text], maskValue: [...maskValue] });

    return {
      displayValue: this.temp.join(''),
      maskValue: maskValue.join('')
    }
  }

  // 分別將明碼及隱碼的值賦值 formControl(明) 及 HTMLInputElement(明/隱)
  private setValue(e: ElementRef<HTMLInputElement> | Event, replaceValue: IReplaceValueData): void {
    const inpElement: HTMLInputElement | null = this.getHTMLInputElement(e);

    /**
     *  將值塞入 element 的 value 屬性裡，這裡只會顯示，不會連動到 formControl 的值，
     *  另 HTML 上每一個 HTML的 input 事件都要加上 $event.preventDefault，來阻止 value
     *  變動時，又觸發了 HostListener 事件 (chrome、edge 會發生)。
     */
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

    // console.log('onChange', [replaceValue.displayValue, this.ngControl.value]);

    // 當點擊顯隱碼時，不需要觸發 formControl 賦值
    if(replaceValue.displayValue !== this.ngControl.value){
      //  console.log('onChange', [replaceValue.displayValue, this.ngControl.value]);
      /**
       * - this.onChange 是賦值給 formControl 的值，不會連動到 HTMLInputElement 的 value。
       * - 使用 setTimeout 避免 ExpressionChangedAfterItHasBeenCheckedError 問題。
       */
      setTimeout(() => {
        this.onChange(replaceValue.displayValue);
      }, 0);
    }
  }

  private getHTMLInputElement(e: Event | ElementRef<HTMLInputElement> | null): HTMLInputElement | null {
    return (e instanceof HTMLInputElement) ? e : (e as Event).target as HTMLInputElement;
  }

}
