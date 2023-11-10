export interface IInputMaskOptions {
  show: boolean; // 明、隱碼切換
  sIndex: number; // 要替換的起始位置，從 0 起，
  cut: number; // 要替位幾個數字
  rexExp?: RegExp; // 不符合格式的正規，ex: 只可輸入數字時，要匯入 /\D+$/
  symbol?: string; // 替換符號 * ● ...等，默認 '*'
}

