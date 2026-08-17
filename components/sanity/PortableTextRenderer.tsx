"use client";

import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { imageUrl } from "@/lib/sanity/image";
import type { SanityImage } from "@/lib/sanity/types";

type Props = {
  value?: unknown[] | null;
  className?: string;
};

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="mt-10 text-2xl font-bold tracking-tight text-slate-900">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 text-xl font-semibold text-slate-900">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-6 text-lg font-semibold text-slate-800">{children}</h4>
    ),
    normal: ({ children }) => (
      <p className="mt-4 text-base leading-relaxed text-slate-600">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-6 border-l-4 border-slate-300 pl-4 italic text-slate-600">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-600">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mt-4 list-decimal space-y-2 pl-6 text-slate-600">
        {children}
      </ol>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href = value?.href || "#";
      const blank = value?.blank !== false;
      return (
        <a
          href={href}
          className="font-medium text-slate-900 underline underline-offset-2 hover:text-slate-700"
          {...(blank
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {children}
        </a>
      );
    },
    code: ({ children }) => (
      <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm text-slate-800">
        {children}
      </code>
    ),
  },
  types: {
    image: ({ value }: { value: SanityImage & { alt?: string; caption?: string } }) => {
      const src = imageUrl(value, 1200);
      if (!src) return null;
      return (
        <figure className="my-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={value.alt || ""}
            className="w-full rounded-2xl border border-slate-200/60 object-cover"
          />
          {value.caption ? (
            <figcaption className="mt-2 text-center text-sm text-slate-500">
              {value.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },
  },
};

export function PortableTextRenderer({ value, className = "" }: Props) {
  if (!value?.length) return null;
  return (
    <div className={`max-w-none ${className}`}>
      <PortableText
        value={value as Parameters<typeof PortableText>[0]["value"]}
        components={components}
      />
    </div>
  );
}
