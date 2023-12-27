# 【Vitest】利用しているライブラリの一部をモックする

## やりたいこと

Vitest×RTLでReactのテストを書いていて、「react-router-domのuseParamsをモックして決まった返り値を返したい」というニーズが出てきました。

ネットで調べてよく出てくるjestなら[jest.requireActual(moduleName)](https://jestjs.io/ja/docs/jest-object#jestrequireactualmodulename)が使えそうなのですが、Vitestには同名のメソッドがありません。

さて、どうしたものか・・

## vi.importActualを使う

Vitest（Vi）のドキュメントを見てみると、同じ目的で使える[vi.importActual](https://vitest.dev/api/vi.html#vi-importactual)がありました。

```tsx:sample.text.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';


describe('SampleComponent', () => {
  ...

  const renderComponent = (): void => {
    // useParamsのみモックする
    vi.mock('react-router-dom', async () => {
      // awaitし忘れるとテスト通らなくなったりするので注意
      const actual: any = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useParams: vi.fn(() => ({ pageId: '1' })),
      };
    });
    render(<SampleComponent />);
  };
  ...
```

## 参考

- [Vi | Vitest](https://vitest.dev/api/vi.html#vi-importactual)
