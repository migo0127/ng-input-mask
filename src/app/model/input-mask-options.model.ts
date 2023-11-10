export interface IInputMaskOptions {
  show: boolean; // 明、隱碼切換
  sIndex: number; // 要替換的起始位置，從 0 起，
  cut: number; // 要替位幾個數字
  symbol?: string; // 替換符號 * ● ...等，默認 '*'
}

