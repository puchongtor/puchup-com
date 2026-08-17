import { defineField, defineType } from "sanity";

export const codeEmbed = defineType({
  name: "codeEmbed",
  title: "Code Embed",
  type: "object",
  description:
    "Custom HTML/CSS/JS or component payload rendered inside a sandboxed iframe",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "html",
      title: "HTML",
      type: "text",
      rows: 8,
      description: "Body markup injected into the sandboxed document",
    }),
    defineField({
      name: "css",
      title: "CSS",
      type: "text",
      rows: 6,
    }),
    defineField({
      name: "javascript",
      title: "JavaScript",
      type: "text",
      rows: 6,
      description: "Runs inside the sandbox (allow-scripts only; no parent access)",
    }),
    defineField({
      name: "componentPayload",
      title: "Custom Component Payload (JSON)",
      type: "text",
      rows: 6,
      description:
        "Optional JSON payload for host-side custom renderers. Not executed as code.",
    }),
    defineField({
      name: "minHeight",
      title: "Min Height (px)",
      type: "number",
      initialValue: 480,
    }),
    defineField({
      name: "fullPage",
      title: "Full-page embed",
      type: "boolean",
      description:
        "Render edge-to-edge (no site chrome). Use for complete demo HTML documents.",
      initialValue: false,
    }),
  ],
});
