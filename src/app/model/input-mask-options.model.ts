export interface IInputMaskOptions {
  show: boolean; // 明、隱碼切換
  sIndex: number; // 要替換的起始位置，從 1 起
  cut: number; // 要替位幾個數字
  rexExp?: RegExp; // 不符合格式的正規，ex: 只可輸入數字時，要匯入 /\D+$/
  symbol?: string; // 替換符號 * ● ...等，默認 '*'
}

export interface IDynamicInputMaskOptions extends IInputMaskOptions{
  dynamic?: boolean; // 動態變更 cut 的值，需要同時設定 event
  /**
   * 當該 Input 的 dynamic 為 true 時，在偵測動態Input事件(ex:emailChange)時，
   * 需要多拋 Event 事件，而在單純切換明隱碼時，需要清除 dynamic mask 的 event，
   * 否則會再重新計算
   */
  event?: Event | null;
}

export interface IReplaceValueData {
  displayValue: string;
  maskValue: string;
}
