# 作品說明

使用 Angular 框架製作客制化 Input mask value：

- Account Input：
  - 使用者可自行配置從第 N 位及自定義隱碼符號（ex：'*'、 '●'...等）開始隱碼。
  - Users can customize the starting position (Nth position) and use a custom masking symbol (e.g., '*', '●', etc.) for masking.
  - 默認：將第 3 ~ 5 位字元進行隱碼，隱碼符號 '*'。
  - Default: Mask characters from the 3rd to the 5th position with the masking symbol '*'..

- Phone Input：
  - 將第 5 ~ 8 位字元進行隱碼，隱碼符號 '●'。
  - Masking digits 5 to 8 of the Phone with the symbol '●'.

- Name Input：。
  - 值為二字元時隱碼最後一字元，超過二字以上隱碼中間字元，隱碼符號 '*'。
  - Mask last character for two-letter names and use '*' for middle characters in longer names.

- Email Input：。
  - '@' 前所有字元隱碼，隱碼符號 '*'。
  - Mask all characters before '@' with the symbol '*'.


# 系統說明

專案運行方式：ng serve 或 npm start

網站連結：https://migo0127.github.io/ng-input-mask/ng-input-mask

