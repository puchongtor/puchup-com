/** โลโก้จำลอง Your Company — ไม่เกี่ยวกับ Advance */

type Props = {
  size?: number;
  tone?: "light" | "dark";
};

export function YourCompanyMark({ size = 36, tone = "dark" }: Props) {
  const bg = tone === "dark" ? "#0d182c" : "#ffffff";
  const fg = tone === "dark" ? "#f5eedc" : "#0d182c";
  const ring = tone === "dark" ? "rgba(245,238,220,0.35)" : "rgba(13,24,44,0.2)";

  return (
    <span className="inline-flex items-center gap-2.5" aria-label="Your Company">
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden
      >
        <rect width="40" height="40" rx="10" fill={bg} />
        <rect
          x="1.5"
          y="1.5"
          width="37"
          height="37"
          rx="8.5"
          stroke={ring}
          strokeWidth="1.5"
        />
        <text
          x="20"
          y="25"
          textAnchor="middle"
          fill={fg}
          style={{
            fontFamily: "ui-sans-serif, system-ui, sans-serif",
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "0.04em",
          }}
        >
          YC
        </text>
      </svg>
      <span className="leading-tight">
        <span
          className="block text-[14px] font-semibold"
          style={{ color: tone === "dark" ? "#0d182c" : "#fcfaf5" }}
        >
          Your Company
        </span>
        <span
          className="block text-[10px]"
          style={{ color: tone === "dark" ? "#596273" : "rgba(252,250,245,0.7)" }}
        >
          SaleDesk demo
        </span>
      </span>
    </span>
  );
}
