# Goで文字列を比較する手法あれこれ（完全一致／部分一致）

Go言語で文字列を比較する方法をまとめていく。

## 完全一致：大文字／小文字も区別

まずは大文字／小文字を区別する完全一致から。これは素直に比較演算子"=="で行える。「一致しない」ことをみたいなら"!="演算子で。

```go
package main

import "fmt"

func main(){
    x := "Hello"
    y := "Hello"
    z := "heLLo"
    
    fmt.Println(x == y) // true
    fmt.Println(x == z) // false
    fmt.Println(x != z) // true
}
```

ちなみにgolangにおいて文字は技術的にはUnicodeのコードポイント、つまり「コンピューテーショナルな（計算可能な）数値」として扱われるので、文字に対して不等号も使える。

## 完全一致：ただし大／小文字は区別しない

大文字、小文字を区別せずに一致判定を行いたいときは、strings.EqualFoldが利用できる。ただし、全角と半角とはこの方法でも区別される。

```go
package main

import(
    "fmt"
    "strings"
)

func main(){
    x := "Hello"
    y := "Hello"
    z := "heLLo"
    
    n := "Ｈｅｌｌо" // 全角のHello
    
    fmt.Println(strings.EqualFold(x, y)) // true
    fmt.Println(strings.EqualFold(x, z)) // true (大／小文字区別なし)
    fmt.Println(strings.EqualFold(x, n)) // false (全／半角区別あり)
}
```

## 部分一致

文字列がある別の文字列を含んでいるかを判定するには、２つほど方法がある。

```go
package main
import (
    "fmt"
    "strings"
)

func main(){
    parent := "Hello, world."
    child  := "llo"
    non_child := "abc"
    
    fmt.Println(strings.Index(parent, child))     // 2（「0文字目」始まりの「2文字目」）
    fmt.Println(strings.Index(parent, non_child)) // -1
    
    fmt.Println(strings.Contains(parent, child))     // true
    fmt.Println(strings.Contains(parent, non_child)) // false
}
```

まずstrings.Index関数。これは本来、与えた部分文字列が何文字目から始まっているかを知るための関数だが、「存在しない部分文字列」を与えた時には-1を返すという挙動をする。この仕様は、特定の文字列を含むかどうか調べるという目的に応用できる。

２つ目はstrings.Contains関数だ。こちらは第２引数に与えた文字列を第１引数の文字列が含むならばtrueを、含まなければfalseを返す。より「素直」な判定だろう。if節の分岐条件等、一般的な用途であれば、こちらで申し分ないかと思う。

## 大文字／小文字を区別しない部分一致は・・？

大文字／小文字を区別しない部分一致を行いたい場合について、あまり自信はないのだが、strings.ToLower関数で両方とも「全て小文字」にしてから比較すると良いのではと思う。

```go
package main
import (
    "fmt"
    "strings"
)

func main(){
    parent := "helLO, world."
    child  := "LLo"
    
    fmt.Println(strings.Contains(parent, child))     // false
    fmt.Println(strings.Contains(strings.ToLower(parent), strings.ToLower(child))) // true
}
```

## 参考

- [[Golang] String（文字列） - GolangでString（文字列）を宣言して使う方法に説明します。](https://dev-yakuza.posstree.com/golang/string/)
- [strings.EqualFold 関数を使え | text.Baldanders.info](https://text.baldanders.info/golang/use-equalfold-function/)
- [文字列の前方／後方一致と置換](https://tubuyaki-tech.com/tubu-go-strings-1/)
