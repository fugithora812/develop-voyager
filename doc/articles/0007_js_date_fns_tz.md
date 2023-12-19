# 【JS】 date-fns-tzでタイムゾーンを考慮しつつ時刻をformatする

JavaScriptで、タイムゾーンを考慮しつつ時刻formatする際にdate-fns-tzが便利だったので紹介します。

## date-fns-tz

date-fns-tzは、タイムゾーンを考慮した日時の「やりくり」に関する機能を提供するライブラリです。下のように実装することで、タイムゾーンに合わせた日時をフォーマットできます。

```js
import { formatInTimeZone } from 'date-fns-tz'

const currentDate = Date.now()

// format by date-fns-tz
formatInTimeZone(currentDate, "Asia/Tokyo", "yyyy-MM-dd_HH:mm:ss")
```

`formatInTimeZone`の第２引数にタイムゾーンを文字列で指定、第３引数でどのような形式でフォーマットするかを指定しています。

ちなみに、指定できるタイムゾーンの一覧は[こちら](https://www.hulft.com/help/ja-jp/WebFT-V3/COM-ADM/Content/WEBFT_ADM_COM/TimeZone/timezonelist.htm)、フォーマットにあたっての書式（ISO 8601形式）の一覧は[こちら](https://blog.capilano-fw.com/?p=908)などから確認できます。

## 参考

- https://blog.capilano-fw.com/?p=908
- https://github.com/marnusw/date-fns-tz
- https://www.hulft.com/help/ja-jp/WebFT-V3/COM-ADM/Content/WEBFT_ADM_COM/TimeZone/timezonelist.htm
- https://tc39.es/ecma262/#sec-date-time-string-format
