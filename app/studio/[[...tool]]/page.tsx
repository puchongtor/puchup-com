import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sanity Studio",
  robots: { index: false, follow: false },
};

/**
 * Embedded NextStudio requires Next.js 16+. Until then, run Studio via
 * `npm run sanity` (port 3333) or deploy with `npm run sanity:deploy`.
 */
export default function StudioPage() {
  const hosted = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL;
  const id = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
  const manageCors = id
    ? `https://www.sanity.io/manage/project/${id}/api?cors=add&origin=${encodeURIComponent("http://localhost:3333")}&credentials=`
    : "https://www.sanity.io/manage";
  const manageStudios = id
    ? `https://www.sanity.io/manage/project/${id}/studios?studio=add&origin=${encodeURIComponent("http://localhost:3333")}`
    : "https://www.sanity.io/manage";

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-6 px-4 py-16 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
          PuchUp CMS
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Sanity Studio
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          If Studio shows &quot;Connect this studio to your project&quot;, add the
          development host / CORS origin for{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">
            http://localhost:3333
          </code>{" "}
          (Allow credentials), then reload Studio.
        </p>
      </div>

      <ol className="list-decimal space-y-2 pl-5 text-slate-700">
        <li>
          Confirm{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">
            NEXT_PUBLIC_SANITY_PROJECT_ID
          </code>{" "}
          in{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">
            .env.local
          </code>
        </li>
        <li>
          Run{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">
            npm run sanity:cors
          </code>{" "}
          (or use the Manage links below)
        </li>
        <li>
          Run{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">
            npm run sanity
          </code>{" "}
          → open{" "}
          <a
            className="font-medium underline underline-offset-2"
            href="http://localhost:3333"
          >
            http://localhost:3333
          </a>
        </li>
        <li>
          On the connect screen, click{" "}
          <strong>Add development host</strong>, approve, then return — Studio
          reloads automatically
        </li>
      </ol>

      <div className="flex flex-wrap gap-3">
        <a
          href="http://localhost:3333"
          className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
        >
          Open local Studio
        </a>
        <a
          href={manageCors}
          className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50"
          target="_blank"
          rel="noopener noreferrer"
        >
          Fix CORS in Manage
        </a>
        <a
          href={manageStudios}
          className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50"
          target="_blank"
          rel="noopener noreferrer"
        >
          Add development host
        </a>
        {hosted ? (
          <a
            href={hosted}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open hosted Studio
          </a>
        ) : null}
      </div>
    </div>
  );
}
