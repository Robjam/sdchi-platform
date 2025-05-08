import { PropsWithChildren } from 'hono/jsx/dom'
export type Props = {
  title: string;
  description: string;
  keywords?: string;
};
export function Page({children} : PropsWithChildren<Props>) {
  return (
    <html lang="ja" class="h-full bg-white">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/style.css" />
        <title>SDCHI Auth</title>
      </head>
      <body class="h-full">
        {children}
      </body>
    </html>
  );
}