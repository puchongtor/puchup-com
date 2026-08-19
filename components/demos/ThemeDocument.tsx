"use client";

type Props = {
  title: string;
  srcDoc: string;
};

/**
 * Full-document theme (Tailwind CDN + vanilla JS) isolated in an iframe
 * so the Next.js tree never hydrates the prototype markup.
 */
export function ThemeDocument({ title, srcDoc }: Props) {
  return (
    <iframe
      title={title}
      srcDoc={srcDoc}
      className="block h-dvh w-full border-0"
      sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-popups-to-escape-sandbox"
    />
  );
}
