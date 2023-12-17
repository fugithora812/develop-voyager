# 【React】ユーザが入力した文字数の表示(「コメント行」考慮つき)

ReactとMUIのTextFieldで、ユーザが入力した文字数を表示させてみる。

なお、
- アルファベット、２バイト文字といった文字の種類に関わらず「１字」を正確にカウントする
  - ただし改行文字は１字としてカウントしない
- JavaScriptのコメント行のように「//」で始まる行は「コメント行」として
文字数カウントの対象外にする
  - VSCodeのように「Ctrl+/」キー(Macなら「Cmd+/」キー)のショートカットで、カーソルが当たっている行をコメント行にする
（コメント行になっていたらそれをやめる）

という要件があった場合の実装を(ChatGPTと一緒に)考えてみた。

## 実装

まず『アルファベット、２バイト文字といった文字の種類に関わらず「１字」を正確にカウントする』という要件を満たすために、`Array.from(...).length`を用いている(上記34行目)。

`Array.from`は、引数に文字列を受け取るとUnicodeのコードポイントに基づいて１字ずつを要素とした配列に分解する。これにより、全角文字や２バイト文字も正確に1文字としてカウントできる。

（↑とChatGPTに言われたので[V8の実装](https://github.com/v8/v8/blob/main/src/builtins/array-from.tq)を調べてみたのだが本当かどうかはわからなかった、ごめん・・）

次に『「//」で始まる行は「コメント行」として
文字数カウントの対象外にする』の要件は、countCharactersの中で実現している(29〜33行目)。

具体的な処理として、`//`から始まる行を対象外にするためにテキストを行ごとに分解し(29行目)、その各行が`//`で始まるかどうかを確認する(31行目)。その上で、`//`で始まらない行だけを文字数カウントの対象としている(30〜32行目)。

```ts
const lines = str.split("\n");
const linesWithoutComments = lines.filter(
  (line) => !line.trim().startsWith("//")
);
```

最後の『「Ctrl+/」キーのショートカットで、カーソルが当たっている行をコメント行にする』要件はuseEffectを使って実現した(42〜88行目)。

まず45行目で『「Ctrl+/」キー(Macなら「Cmd+/」キー)が押された場合』に絞る。

```ts
if ((event.ctrlKey || event.metaKey) && event.key === "/") {
  ...
```

その上でブラウザにデフォルトで定義されているキーボードイベントをキャンセルする。これにより、ブラウザのデフォルトのキーボードショートカットが発火しないようにする。

```ts
event.preventDefault();
```

次にイベントのターゲットをHTMLTextAreaElementとして取得する。これにより、テキストエリアの現在の状態にアクセスできる。

```ts
const textarea = event.target as HTMLTextAreaElement;
```

そしてテキストエリア内での現在の選択範囲の開始位置と終了位置を取得する。選択範囲が存在しない場合は0を代入する。

```ts
const selectionStart = textarea.selectionStart !== null ? textarea.selectionStart : 0;
const selectionEnd = textarea.selectionEnd !== null ? textarea.selectionEnd : 0;
```

テキストエリアの現在のテキスト内容を取得した上でテキストエリアのテキスト内容をカーソル位置で分割し、カーソル前後のテキストをそれぞれ取得したら・・

```ts
const { value } = textarea;
const beforeCursor = value.substring(0, selectionStart);
const afterCursor = value.substring(selectionEnd);
```

カーソルが現在位置している行の開始位置と終了位置を計算する。行の終了位置は次の改行文字が出現する位置か、テキストの末尾（次の改行がない場合）である。

```ts
const lineStart = beforeCursor.lastIndexOf('\n') + 1;
const lineEnd = afterCursor.indexOf('\n');
const lineEndIndex = lineEnd !== -1 ? lineEnd + selectionEnd : value.length;
```

さらにテキストを現在の行の前の部分、現在の行、現在の行の後の部分に分割する。

```ts
const beforeLine = value.substring(0, lineStart);
const currentLine = value.substring(lineStart, lineEndIndex);
const afterLine = value.substring(lineEndIndex);
```

それができたら、現在の行が// で始まるかどうかを確認し、もし始まっていたら削除し、始まっていなければ追加する。また、新しいカーソルの位置を計算し、挿入または削除した文字数を反映させる。

```ts
let newValue;
let newCursorPosition;
if (currentLine.startsWith('// ')) {
  newValue = `${beforeLine}${currentLine.replace('// ', '')}${afterLine}`;
  newCursorPosition = selectionStart - 2; // account for the removed `//`
} else {
  newValue = `${beforeLine}//${currentLine}${afterLine}`;
  newCursorPosition = selectionStart + 2; // account for the inserted `//`
}
```

上記の処理で新しく生成した文字列でTextField内のテキスト内容、およびカーソルの位置を更新。カーソルを新しい位置に設定する。

```ts
setText(newValue);
textarea.value = newValue;

// Reset cursor position
textarea.setSelectionRange(newCursorPosition, newCursorPosition);
```

以上で要件全てを満たす実装ができた。

