import { type Metadata } from 'next';

// eslint-disable-next-line
import Favicon from '/public/favicon.ico';

const siteName = 'DevelopVoyager';
const description = '技術の旅の紀行文。';
const url = 'https://d3fb068sqi1zbm.cloudfront.net/';

export const SEO_DEFAULT: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description,
  icons: [{ rel: 'icon', url: Favicon.src }],
  openGraph: {
    title: siteName,
    description,
    url,
    siteName,
    locale: 'ja_JP',
    type: 'website',
    images: '/opengraph-image.png',
  },
};
