# 【Git】refspecを世界一かみくだいて説明する

Push/Pullで実は必ず活用している、Gitにおける「refspec」の概念を紹介します。なおここでは、Gitのpush/pullについての解説はしません。

## "git push origin master"

git pushをする場合を考えます。初学者さん向けの記事では、その構文は以下のように書かれていると思います。

```bash
git push origin master
```

解説としては、「”origin”という名前で登録してあるGitHub上のリポジトリにmasterブランチをプッシュする」というかたちになるでしょうか。私も、まだ慣れてない人向けにはそういう風に言うことが多いです。

が、ここではもう少し深掘りしてみたいと思います。４語目”master”の部分です。これは正確にはrefspec（多分reference specificationの略）と呼ばれるもので、「参照元と参照先との情報」を表しています。git pushの時には参照元＝ローカルブランチで、参照先＝リモートブランチです。git pullする際にはこの関係が逆になります。

## master:master

上にあげたように”master”ひと単語で済ますのは、実はrefspecの省略記法で、以下のコマンドと同値です。

```bash
git push origin master:master
```

「ローカルのmasterブランチを、リモートのmasterブランチにプッシュする」ということですね。

こうしてみた時、何らかの事情でローカルに”master”ブランチがないにも関わらず、リモートのmasterブランチにプッシュするつもりでgit push origin masterすると、以下のようなエラーになります。

```bash
git push origin master
# error: src refspec master does not match any
```

エラーメッセージの”src”(=source)は、refspecの参照元、つまり master:masterと正式に書いたときの左側を指します（ちなみに右側が”dst”=destinationです）。つまりこのエラーは、「おいジェームズ、ローカルには”master”ブランチないのに、そこを参照するように言ってくれちゃってるぜ？」と伝えてくれているのです（ジェームズは適宜読み換えてください）。なのでこの場合、（技術的には）以下のように対応できます。

```bash
# developブランチがローカルにあるという想定
git push origin develop:master
```

## 参考

- [5分で分かるgitのrefspec](https://www.slideshare.net/ikdysfm/5gitrefspec)
- [gitをpushする際にエラー発生(error: src refspec ブランチ名 does not match any) - Qiita](https://qiita.com/kenkono/items/c488ec9559f6cca34313)
