"use client";

import { useEffect } from "react";

export default function ProjectOneDemoRedirect() {
  useEffect(() => {
    window.location.replace("/demo/");
  }, []);

  return (
    <p className="p-8 text-center text-slate-600">
      กำลังไป Showroom ที่{" "}
      <a href="/demo/" className="underline">
        /demo/
      </a>
    </p>
  );
}
