"use client";

import { useEffect } from "react";

export default function StudioRedirectClient() {
  useEffect(() => {
    window.location.replace("/admin/");
  }, []);

  return (
    <p className="p-6 text-center text-slate-600">
      Redirecting to{" "}
      <a href="/admin/" className="underline">
        /admin/
      </a>
      …
    </p>
  );
}
