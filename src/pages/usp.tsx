import { useState, useRef, useEffect } from "react";
import { Download, Printer, RotateCcw, Palette, Sun, Moon } from "lucide-react";
import { Link } from "wouter";
import { Footer } from "@/components/layout/footer";
import { UspIcon } from "@/components/icons/usp-icon";
import { FrameworkStationIcon } from "@/components/icons/framework-station-icon";
import { Button } from "@/components/ui/button";
import { ColorPickerPopover } from "@/components/shared/color-picker-popover";
import html2canvas from "html2canvas";

/* ── Zone icons for analysis sections ────────────────── */
function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 51 51" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="25.9873" cy="25.9856" r="20.559" fill="white" />
      <mask id="mask_check_zone" style={{ maskType: "luminance" as const }} maskUnits="userSpaceOnUse" x="0" y="0" width="51" height="51">
        <path d="M2 25.1289C2 37.903 12.3548 48.2578 25.1289 48.2578C37.903 48.2578 48.2578 37.903 48.2578 25.1289C48.2578 12.3548 37.903 2 25.1289 2C12.3548 2 2 12.3548 2 25.1289Z" fill="white" stroke="white" strokeWidth="4" strokeLinejoin="round" />
        <path d="M14.7187 21.6594L25.1267 32.0674L35.5347 21.6594" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </mask>
      <g mask="url(#mask_check_zone)">
        <path d="M52.8804 -2.62592L52.8804 52.8835L-2.62901 52.8835L-2.62901 -2.62592L52.8804 -2.62592Z" fill="#58A904" />
      </g>
    </svg>
  );
}

function PersonIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M11.3203 14.9297C9.60677 13.2161 8.75 11.1562 8.75 8.75C8.75 6.34375 9.60677 4.28385 11.3203 2.57031C13.0339 0.856771 15.0937 0 17.5 0C19.9062 0 21.9661 0.856771 23.6797 2.57031C25.3932 4.28385 26.25 6.34375 26.25 8.75C26.25 11.1562 25.3932 13.2161 23.6797 14.9297C21.9661 16.6432 19.9062 17.5 17.5 17.5C15.0937 17.5 13.0339 16.6432 11.3203 14.9297ZM0 30.625V28.875C0 27.6354 0.319375 26.4965 0.958125 25.4581C1.59688 24.4198 2.44417 23.6265 3.5 23.0781C5.76042 21.9479 8.05729 21.1006 10.3906 20.5362C12.724 19.9719 15.0937 19.689 17.5 19.6875C19.9062 19.686 22.276 19.969 24.6094 20.5362C26.9427 21.1035 29.2396 21.9508 31.5 23.0781C32.5573 23.625 33.4053 24.4183 34.0441 25.4581C34.6828 26.4979 35.0015 27.6369 35 28.875V30.625C35 31.8281 34.572 32.8584 33.7159 33.7159C32.8599 34.5734 31.8296 35.0015 30.625 35H4.375C3.17187 35 2.14229 34.572 1.28625 33.7159C0.430208 32.8599 0.00145833 31.8296 0 30.625Z" fill="#0088FF" />
    </svg>
  );
}

function XCircleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="18" cy="18" r="14" fill="white" />
      <path d="M18 0C19.6523 0 21.2461 0.210938 22.7812 0.632812C24.3164 1.05469 25.7461 1.66406 27.0703 2.46094C28.3945 3.25781 29.6074 4.19531 30.709 5.27344C31.8105 6.35156 32.7539 7.56445 33.5391 8.91211C34.3242 10.2598 34.9277 11.6953 35.3496 13.2188C35.7715 14.7422 35.9883 16.3359 36 18C36 19.6523 35.7891 21.2461 35.3672 22.7812C34.9453 24.3164 34.3359 25.7461 33.5391 27.0703C32.7422 28.3945 31.8047 29.6074 30.7266 30.709C29.6484 31.8105 28.4355 32.7539 27.0879 33.5391C25.7402 34.3242 24.3047 34.9277 22.7812 35.3496C21.2578 35.7715 19.6641 35.9883 18 36C16.3477 36 14.7539 35.7891 13.2188 35.3672C11.6836 34.9453 10.2539 34.3359 8.92969 33.5391C7.60547 32.7422 6.39258 31.8047 5.29102 30.7266C4.18945 29.6484 3.24609 28.4355 2.46094 27.0879C1.67578 25.7402 1.07227 24.3047 0.650391 22.7812C0.228516 21.2578 0.0117188 19.6641 0 18C0 16.3477 0.210938 14.7539 0.632812 13.2188C1.05469 11.6836 1.66406 10.2539 2.46094 8.92969C3.25781 7.60547 4.19531 6.39258 5.27344 5.29102C6.35156 4.18945 7.56445 3.24609 8.91211 2.46094C10.2598 1.67578 11.6953 1.07227 13.2188 0.650391C14.7422 0.228516 16.3359 0.0117188 18 0ZM19.9863 18L25.998 11.9883L24.0117 10.002L18 16.0137L11.9883 10.002L10.002 11.9883L16.0137 18L10.002 24.0117L11.9883 25.998L18 19.9863L24.0117 25.998L25.998 24.0117L19.9863 18Z" fill="#E64344" />
    </svg>
  );
}

function WarningCircleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="16.9999" cy="17" r="12.3636" fill="white" />
      <path d="M17 0C7.61077 0 0 7.61077 0 17C0 26.3892 7.61077 34 17 34C26.3892 34 34 26.3892 34 17C34 7.61077 26.3892 0 17 0ZM17 8.06759C17.3468 8.06759 17.6794 8.20536 17.9247 8.4506C18.1699 8.69584 18.3077 9.02846 18.3077 9.37528V18.965C18.3077 19.3118 18.1699 19.6445 17.9247 19.8897C17.6794 20.1349 17.3468 20.2727 17 20.2727C16.6532 20.2727 16.3206 20.1349 16.0753 19.8897C15.8301 19.6445 15.6923 19.3118 15.6923 18.965V9.37528C15.6923 9.02846 15.8301 8.69584 16.0753 8.4506C16.3206 8.20536 16.6532 8.06759 17 8.06759ZM18.3077 23.7529V24.6247C18.3077 24.9715 18.1699 25.3042 17.9247 25.5494C17.6794 25.7946 17.3468 25.9324 17 25.9324C16.6532 25.9324 16.3206 25.7946 16.0753 25.5494C15.8301 25.3042 15.6923 24.9715 15.6923 24.6247V23.7529C15.6923 23.4061 15.8301 23.0735 16.0753 22.8282C16.3206 22.583 16.6532 22.4452 17 22.4452C17.3468 22.4452 17.6794 22.583 17.9247 22.8282C18.1699 23.0735 18.3077 23.4061 18.3077 23.7529Z" fill="#FFC800" />
    </svg>
  );
}

/* ── Data types ─────────────────────────────────────── */
interface UspData {
  brandStrengths: string;
  clientDesires: string;
  competitorStrengths: string;
  winningZone: string;
  loosingZone: string;
  risky: string;
  whoCares: string;
}

const DEFAULT_DATA: UspData = {
  brandStrengths: "",
  clientDesires: "",
  competitorStrengths: "",
  winningZone: "",
  loosingZone: "",
  risky: "",
  whoCares: "",
};

const BG_COLORS = [
  "#1e293b", "#2d3748", "#334155", "#1a1a2e",
  "#16213e", "#0f3460", "#2d1b69", "#1b2d1b",
  "#2d1b1b", "#1b1b2d", "#0a0a0a", "#374151",
  "#1f2937", "#111827", "#0c0c1d", "#2a2a3d",
];

/* ── Main Component ─────────────────────────────────── */
export function UspPage() {
  const [data, setData] = useState<UspData>(() => {
    try {
      const saved = localStorage.getItem("fs_usp_data_v2");
      return saved ? JSON.parse(saved) : DEFAULT_DATA;
    } catch {
      return DEFAULT_DATA;
    }
  });
  const [darkMode, setDarkMode] = useState(true);
  const [bgColor, setBgColor] = useState("#1e293b");
  const [showBgPicker, setShowBgPicker] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "USP - Unique Selling Proposition - Framework Station";
  }, []);

  useEffect(() => {
    localStorage.setItem("fs_usp_data_v2", JSON.stringify(data));
  }, [data]);

  const pageBgColor = darkMode ? "#0f0f1a" : "#f5f5f5";
  const textColor = darkMode ? "text-white" : "text-gray-900";
  const btnBg = darkMode
    ? "bg-white/10 text-white border-white/20 hover:bg-white/20"
    : "bg-black/5 text-gray-800 border-gray-300 hover:bg-black/10";

  const update = (field: keyof UspData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.target;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  const handleReset = () => {
    setData(DEFAULT_DATA);
    setBgColor("#1e293b");
    // Reset textarea heights back to default
    if (canvasRef.current) {
      canvasRef.current.querySelectorAll("textarea").forEach((ta) => {
        ta.style.height = "auto";
      });
    }
  };

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    try {
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: bgColor,
        useCORS: true,
        scale: 2,
        width: canvasRef.current.scrollWidth,
        onclone: (doc: Document, clonedEl: HTMLElement) => {
          // Force the cloned element to match the current rendered width
          clonedEl.style.width = canvasRef.current!.scrollWidth + "px";
          // Force the 2-column grid (the lg: breakpoint won't apply in the clone)
          const gridEl = clonedEl.querySelector(".usp-grid") as HTMLElement | null;
          if (gridEl) {
            gridEl.style.display = "grid";
            gridEl.style.gridTemplateColumns = "1fr 1fr";
            gridEl.style.gap = "2rem";
          }
          // Replace textareas with divs (html2canvas doesn't render textarea content well)
          const textareas = clonedEl.querySelectorAll("textarea");
          textareas.forEach((ta) => {
            const div = doc.createElement("div");
            div.textContent = ta.value || ta.placeholder;
            div.style.cssText = ta.style.cssText;
            div.style.whiteSpace = "pre-wrap";
            div.style.wordBreak = "break-word";
            div.style.fontSize = getComputedStyle(ta).fontSize;
            div.style.fontFamily = getComputedStyle(ta).fontFamily;
            div.style.lineHeight = getComputedStyle(ta).lineHeight;
            div.style.color = ta.value ? ta.style.color : "rgba(255,255,255,0.4)";
            div.style.minHeight = "auto";
            div.style.padding = "0";
            div.style.margin = "0";
            div.style.border = "none";
            div.style.background = "transparent";
            div.style.width = "100%";
            div.style.overflow = "visible";
            div.style.height = "auto";
            ta.parentNode?.replaceChild(div, ta);
          });
        },
      });
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "usp-framework.png";
      link.href = url;
      link.click();
    } catch {
      // silent
    }
  };

  const handlePrint = () => window.print();

  const isLight = isLightColor(bgColor);
  const zoneTitleColor = isLight ? "#1a1a1a" : "#ffffffE6";
  const zoneTextColor = isLight ? "#333" : "#ffffffCC";
  const zoneBorderColor = isLight ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.12)";
  const zoneFieldBg = isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.06)";

  return (
    <div className="min-h-screen flex flex-col transition-colors" style={{ backgroundColor: pageBgColor }}>
      {/* ─── Header ──────────────────────────────── */}
      <header
        className="sticky top-0 z-50 backdrop-blur-md border-b"
        style={{
          backgroundColor: darkMode ? "rgba(15,15,26,0.9)" : "rgba(245,245,245,0.9)",
          borderColor: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UspIcon className={`w-6 h-6 ${darkMode ? "text-green-400" : "text-green-600"}`} />
            <span className={`font-bold text-lg hidden sm:inline ${textColor}`}>
              USP <span className="text-sm font-normal opacity-70">(Unique Selling Proposition)</span>
            </span>
          </div>
          <Link href="/" className={`flex items-center gap-2 hover:opacity-80 transition-opacity ${textColor}`}>
            <FrameworkStationIcon className={`h-5 w-5 ${darkMode ? "text-red-400" : "text-red-500"}`} />
            <span className="font-semibold text-base hidden sm:inline">Framework Station</span>
          </Link>
          <Button variant="outline" size="icon" onClick={() => setDarkMode(!darkMode)} className={btnBg}>
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </header>

      {/* ─── Main Content ────────────────────────── */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* ── Canvas (downloadable area) ──── */}
          <div
            ref={canvasRef}
            className="print-area rounded-lg p-6 sm:p-8"
            style={{ backgroundColor: bgColor }}
          >
            {/* Layout: Venn (left) + Zones (right) */}
            <div className="usp-grid grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* ── LEFT: Venn diagram + text inputs ── */}
              <div className="flex flex-col gap-4">
                {/* Venn Diagram Illustration (from Figma SVG) */}
                <div className="flex justify-center">
                  <svg viewBox="0 0 462 446" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[380px]">
                    {/* Intersection fills */}
                    <path d="M276 273.135C241.417 286.666 202.257 277.115 187 270.648C195.137 235.23 219.642 209.125 231 201C260.294 220.898 273.288 257.714 276 273.135Z" fill="#FFFF00" stroke="black"/>
                    <circle cx="231" cy="247" r="12.3636" fill="white"/>
                    <path d="M231 230C221.611 230 214 237.611 214 247C214 256.389 221.611 264 231 264C240.389 264 248 256.389 248 247C248 237.611 240.389 230 231 230ZM231 238.068C231.347 238.068 231.679 238.205 231.925 238.451C232.17 238.696 232.308 239.028 232.308 239.375V248.965C232.308 249.312 232.17 249.644 231.925 249.89C231.679 250.135 231.347 250.273 231 250.273C230.653 250.273 230.321 250.135 230.075 249.89C229.83 249.644 229.692 249.312 229.692 248.965V239.375C229.692 239.028 229.83 238.696 230.075 238.451C230.321 238.205 230.653 238.068 231 238.068ZM232.308 253.753V254.625C232.308 254.972 232.17 255.304 231.925 255.549C231.679 255.795 231.347 255.932 231 255.932C230.653 255.932 230.321 255.795 230.075 255.549C229.83 255.304 229.692 254.972 229.692 254.625V253.753C229.692 253.406 229.83 253.073 230.075 252.828C230.321 252.583 230.653 252.445 231 252.445C231.347 252.445 231.679 252.583 231.925 252.828C232.17 253.073 232.308 253.406 232.308 253.753Z" fill="#FFC800"/>
                    <path d="M275.5 274C333.9 253.2 358 216.5 370 175.5C318.5 155.5 260 175.5 232 201.354C261 224.354 273.5 261.667 275.5 274Z" fill="#0065BE" stroke="black"/>
                    <path d="M294.32 211.93C292.607 210.216 291.75 208.156 291.75 205.75C291.75 203.344 292.607 201.284 294.32 199.57C296.034 197.857 298.094 197 300.5 197C302.906 197 304.966 197.857 306.68 199.57C308.393 201.284 309.25 203.344 309.25 205.75C309.25 208.156 308.393 210.216 306.68 211.93C304.966 213.643 302.906 214.5 300.5 214.5C298.094 214.5 296.034 213.643 294.32 211.93ZM283 227.625V225.875C283 224.635 283.319 223.496 283.958 222.458C284.597 221.42 285.444 220.626 286.5 220.078C288.76 218.948 291.057 218.101 293.391 217.536C295.724 216.972 298.094 216.689 300.5 216.687C302.906 216.686 305.276 216.969 307.609 217.536C309.943 218.104 312.24 218.951 314.5 220.078C315.557 220.625 316.405 221.418 317.044 222.458C317.683 223.498 318.001 224.637 318 225.875V227.625C318 228.828 317.572 229.858 316.716 230.716C315.86 231.573 314.83 232.001 313.625 232H287.375C286.172 232 285.142 231.572 284.286 230.716C283.43 229.86 283.001 228.83 283 227.625Z" fill="#0088FF"/>
                    <path d="M188 269.5C175 319 188 370.5 231.001 411.499C278.002 366.5 284.757 322.414 275 274C236.5 284.5 198 274 188 269.5Z" fill="#D00001" stroke="black"/>
                    <path d="M188 270C129.6 249.2 105.333 196 101 173C169 154 212 186 231.5 201.5C202.5 224.5 190 257.667 188 270Z" fill="#4C9302" stroke="black"/>
                    {/* "Você" label + icon */}
                    <text x="231" y="133" textAnchor="middle" fill="#FD8F00" fontSize="16" fontWeight="bold">Você</text>
                    <path d="M250.844 72.955C256.344 71.9225 261.063 70.5625 265 68.875V106.375C261.25 108.062 256.688 109.422 251.313 110.455C245.938 111.487 240.5 112.002 235 112C229.5 111.998 224.063 111.481 218.688 110.451C213.313 109.421 208.75 108.062 205 106.375V68.875C208.937 70.5625 213.656 71.9225 219.156 72.955C224.656 73.9875 229.937 74.5025 235 74.5C240.063 74.4975 245.344 73.9812 250.844 72.9512M245.594 41.4062C248.531 44.3437 250 47.875 250 52C250 56.125 248.531 59.6562 245.594 62.5937C242.656 65.5312 239.125 67 235 67C230.875 67 227.344 65.5312 224.406 62.5937C221.469 59.6562 220 56.125 220 52C220 47.875 221.469 44.3437 224.406 41.4062C227.344 38.4687 230.875 37 235 37C239.125 37 242.656 38.4687 245.594 41.4062Z" fill="#FD8F00"/>
                    {/* "Concorrente" label + icon */}
                    <text x="357" y="345" textAnchor="middle" fill="#EF31B9" fontSize="14" fontWeight="bold">Concorrente</text>
                    <path d="M333.917 278.833V273H380.583V278.833H333.917ZM333.917 319.667V302.167H331V296.333L333.917 281.75H380.583L383.5 296.333V302.167H380.583V319.667H374.75V302.167H363.083V319.667H333.917ZM339.75 313.833H357.25V302.167H339.75V313.833Z" fill="#EF31B9"/>
                    {/* "Cliente" label + icon */}
                    <text x="93" y="358" textAnchor="middle" fill="#8A62F1" fontSize="16" fontWeight="bold">Cliente</text>
                    <path d="M112.5 308H73.5L66 278H120L112.5 308Z" fill="#8A62F1"/>
                    <path d="M58.5 269H63.75L66 278M66 278L73.5 308H112.5L120 278H66Z" stroke="#8A62F1" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M73.5 323C75.9853 323 78 320.985 78 318.5C78 316.015 75.9853 314 73.5 314C71.0147 314 69 316.015 69 318.5C69 320.985 71.0147 323 73.5 323Z" stroke="#8A62F1" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M112.5 323C114.985 323 117 320.985 117 318.5C117 316.015 114.985 314 112.5 314C110.015 314 108 316.015 108 318.5C108 320.985 110.015 323 112.5 323Z" stroke="#8A62F1" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                    {/* X circle icon (Loosing) */}
                    <g clipPath="url(#clip_usp_venn)">
                      <circle cx="232" cy="324" r="14" fill="white"/>
                      <path d="M232 306C233.652 306 235.246 306.211 236.781 306.633C238.316 307.055 239.746 307.664 241.07 308.461C242.395 309.258 243.607 310.195 244.709 311.273C245.811 312.352 246.754 313.564 247.539 314.912C248.324 316.26 248.928 317.695 249.35 319.219C249.771 320.742 249.988 322.336 250 324C250 325.652 249.789 327.246 249.367 328.781C248.945 330.316 248.336 331.746 247.539 333.07C246.742 334.395 245.805 335.607 244.727 336.709C243.648 337.811 242.436 338.754 241.088 339.539C239.74 340.324 238.305 340.928 236.781 341.35C235.258 341.771 233.664 341.988 232 342C230.348 342 228.754 341.789 227.219 341.367C225.684 340.945 224.254 340.336 222.93 339.539C221.605 338.742 220.393 337.805 219.291 336.727C218.189 335.648 217.246 334.436 216.461 333.088C215.676 331.74 215.072 330.305 214.65 328.781C214.229 327.258 214.012 325.664 214 324C214 322.348 214.211 320.754 214.633 319.219C215.055 317.684 215.664 316.254 216.461 314.93C217.258 313.605 218.195 312.393 219.273 311.291C220.352 310.189 221.564 309.246 222.912 308.461C224.26 307.676 225.695 307.072 227.219 306.65C228.742 306.229 230.336 306.012 232 306ZM233.986 324L239.998 317.988L238.012 316.002L232 322.014L225.988 316.002L224.002 317.988L230.014 324L224.002 330.012L225.988 331.998L232 325.986L238.012 331.998L239.998 330.012L233.986 324Z" fill="#E64344"/>
                    </g>
                    {/* Check circle icon (Winning) */}
                    <circle cx="166.987" cy="211.986" r="20.559" fill="white"/>
                    <mask id="mask_usp_venn" style={{ maskType: "luminance" as const }} maskUnits="userSpaceOnUse" x="141" y="186" width="51" height="51">
                      <path d="M143 211.129C143 223.903 153.355 234.258 166.129 234.258C178.903 234.258 189.258 223.903 189.258 211.129C189.258 198.355 178.903 188 166.129 188C153.355 188 143 198.355 143 211.129Z" fill="white" stroke="white" strokeWidth="4" strokeLinejoin="round"/>
                      <path d="M155.719 207.659L166.127 218.067L176.535 207.659" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                    </mask>
                    <g mask="url(#mask_usp_venn)">
                      <path d="M193.88 183.374L193.88 238.883L138.371 238.883L138.371 183.374L193.88 183.374Z" fill="#58A904"/>
                    </g>
                    {/* Three main circles (outlines) */}
                    <circle cx="322" cy="306" r="139" stroke="white" strokeWidth="2"/>
                    <circle cx="140" cy="306" r="139" stroke="white" strokeWidth="2"/>
                    <circle cx="236" cy="140" r="139" stroke="white" strokeWidth="2"/>
                    <defs>
                      <clipPath id="clip_usp_venn">
                        <rect width="36" height="36" fill="white" transform="translate(214 306)"/>
                      </clipPath>
                    </defs>
                  </svg>
                </div>

                {/* "O que sua marca/você faz bem?" */}
                <div
                  className="rounded-lg p-4"
                  style={{ border: `1px solid ${zoneBorderColor}`, backgroundColor: zoneFieldBg }}
                >
                  <h3 className="text-sm font-bold mb-2 flex items-center gap-2" style={{ color: zoneTitleColor }}>
                    <svg viewBox="0 0 60 75" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0">
                      <path d="M45.8438 35.955C51.3438 34.9225 56.0625 33.5625 60 31.875V69.375C56.25 71.0625 51.6875 72.4225 46.3125 73.455C40.9375 74.4875 35.5 75.0025 30 75C24.5 74.9975 19.0625 74.4812 13.6875 73.4512C8.3125 72.4212 3.75 71.0625 0 69.375V31.875C3.9375 33.5625 8.65625 34.9225 14.1563 35.955C19.6563 36.9875 24.9375 37.5025 30 37.5C35.0625 37.4975 40.3438 36.9812 45.8438 35.9512M40.5937 4.40625C43.5312 7.34375 45 10.875 45 15C45 19.125 43.5312 22.6562 40.5937 25.5937C37.6562 28.5312 34.125 30 30 30C25.875 30 22.3438 28.5312 19.4063 25.5937C16.4688 22.6562 15 19.125 15 15C15 10.875 16.4688 7.34375 19.4063 4.40625C22.3438 1.46875 25.875 0 30 0C34.125 0 37.6562 1.46875 40.5937 4.40625Z" fill="#FD8F00"/>
                    </svg>
                    O que sua marca/você faz bem?
                  </h3>
                  <textarea
                    value={data.brandStrengths}
                    onChange={(e) => { update("brandStrengths", e.target.value); autoResize(e); }}
                    placeholder="Descreva os pontos fortes da sua marca..."
                    rows={2}
                    className="w-full bg-transparent border-0 outline-none resize-none text-sm overflow-hidden"
                    style={{ color: zoneTextColor }}
                  />
                </div>

                {/* "O que seu concorrente faz bem?" */}
                <div
                  className="rounded-lg p-4"
                  style={{ border: `1px solid ${zoneBorderColor}`, backgroundColor: zoneFieldBg }}
                >
                  <h3 className="text-sm font-bold mb-2 flex items-center gap-2" style={{ color: zoneTitleColor }}>
                    <svg viewBox="0 0 53 47" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0">
                      <path d="M2.91667 5.83333V0H49.5833V5.83333H2.91667ZM2.91667 46.6667V29.1667H0V23.3333L2.91667 8.75H49.5833L52.5 23.3333V29.1667H49.5833V46.6667H43.75V29.1667H32.0833V46.6667H2.91667ZM8.75 40.8333H26.25V29.1667H8.75V40.8333Z" fill="#EF31B9"/>
                    </svg>
                    O que seu concorrente faz bem?
                  </h3>
                  <textarea
                    value={data.competitorStrengths}
                    onChange={(e) => { update("competitorStrengths", e.target.value); autoResize(e); }}
                    placeholder="Descreva os pontos fortes dos concorrentes..."
                    rows={2}
                    className="w-full bg-transparent border-0 outline-none resize-none text-sm overflow-hidden"
                    style={{ color: zoneTextColor }}
                  />
                </div>

                {/* "O que seu cliente deseja?" */}
                <div
                  className="rounded-lg p-4"
                  style={{ border: `1px solid ${zoneBorderColor}`, backgroundColor: zoneFieldBg }}
                >
                  <h3 className="text-sm font-bold mb-2 flex items-center gap-2" style={{ color: zoneTitleColor }}>
                    <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0">
                      <path d="M58.5 48H19.5L12 18H66L58.5 48Z" fill="#8A62F1"/>
                      <path d="M4.5 9H9.75L12 18M12 18L19.5 48H58.5L66 18H12Z" stroke="#8A62F1" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M19.5 63C21.9853 63 24 60.9853 24 58.5C24 56.0147 21.9853 54 19.5 54C17.0147 54 15 56.0147 15 58.5C15 60.9853 17.0147 63 19.5 63Z" stroke="#8A62F1" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M58.5 63C60.9853 63 63 60.9853 63 58.5C63 56.0147 60.9853 54 58.5 54C56.0147 54 54 56.0147 54 58.5C54 60.9853 56.0147 63 58.5 63Z" stroke="#8A62F1" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    O que seu cliente deseja?
                  </h3>
                  <textarea
                    value={data.clientDesires}
                    onChange={(e) => { update("clientDesires", e.target.value); autoResize(e); }}
                    placeholder="Descreva os desejos e necessidades do seu cliente..."
                    rows={2}
                    className="w-full bg-transparent border-0 outline-none resize-none text-sm overflow-hidden"
                    style={{ color: zoneTextColor }}
                  />
                </div>
              </div>

              {/* ── RIGHT: Analysis Zones ── */}
              <div className="flex flex-col gap-4 justify-center">
                {/* Winning Zone */}
                <div
                  className="rounded-lg p-4"
                  style={{ border: `1px solid ${zoneBorderColor}`, backgroundColor: zoneFieldBg }}
                >
                  <h3 className="text-sm font-bold mb-2 flex items-center gap-2" style={{ color: zoneTitleColor }}>
                    <CheckCircleIcon className="w-5 h-5" />
                    <span style={{ color: "#58A904" }}>Winning Zone</span>
                  </h3>
                  <textarea
                    value={data.winningZone}
                    onChange={(e) => { update("winningZone", e.target.value); autoResize(e); }}
                    placeholder="O que você faz bem E o cliente deseja, mas o concorrente não oferece..."
                    rows={2}
                    className="w-full bg-transparent border-0 outline-none resize-none text-sm overflow-hidden"
                    style={{ color: zoneTextColor }}
                  />
                </div>

                {/* Loosing Zone */}
                <div
                  className="rounded-lg p-4"
                  style={{ border: `1px solid ${zoneBorderColor}`, backgroundColor: zoneFieldBg }}
                >
                  <h3 className="text-sm font-bold mb-2 flex items-center gap-2" style={{ color: zoneTitleColor }}>
                    <XCircleIcon className="w-5 h-5" />
                    <span style={{ color: "#E64344" }}>Loosing Zone</span>
                  </h3>
                  <textarea
                    value={data.loosingZone}
                    onChange={(e) => { update("loosingZone", e.target.value); autoResize(e); }}
                    placeholder="O que o concorrente faz melhor que você..."
                    rows={2}
                    className="w-full bg-transparent border-0 outline-none resize-none text-sm overflow-hidden"
                    style={{ color: zoneTextColor }}
                  />
                </div>

                {/* Risky */}
                <div
                  className="rounded-lg p-4"
                  style={{ border: `1px solid ${zoneBorderColor}`, backgroundColor: zoneFieldBg }}
                >
                  <h3 className="text-sm font-bold mb-2 flex items-center gap-2" style={{ color: zoneTitleColor }}>
                    <WarningCircleIcon className="w-5 h-5" />
                    <span style={{ color: "#FFC800" }}>Risky</span>
                  </h3>
                  <textarea
                    value={data.risky}
                    onChange={(e) => { update("risky", e.target.value); autoResize(e); }}
                    placeholder="O que você e o concorrente fazem, mas o cliente não valoriza..."
                    rows={2}
                    className="w-full bg-transparent border-0 outline-none resize-none text-sm overflow-hidden"
                    style={{ color: zoneTextColor }}
                  />
                </div>

                {/* Who Cares */}
                <div
                  className="rounded-lg p-4"
                  style={{ border: `1px solid ${zoneBorderColor}`, backgroundColor: zoneFieldBg }}
                >
                  <h3 className="text-sm font-bold mb-2 flex items-center gap-2" style={{ color: zoneTitleColor }}>
                    <PersonIcon className="w-5 h-5" />
                    <span style={{ color: "#0088FF" }}>Who Cares</span>
                  </h3>
                  <textarea
                    value={data.whoCares}
                    onChange={(e) => { update("whoCares", e.target.value); autoResize(e); }}
                    placeholder="O que você faz bem, mas ninguém se importa..."
                    rows={2}
                    className="w-full bg-transparent border-0 outline-none resize-none text-sm overflow-hidden"
                    style={{ color: zoneTextColor }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Action Buttons ──── */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="outline"
              onClick={handleDownload}
              className="bg-violet-600 hover:bg-violet-700 text-white border-violet-600"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" onClick={handlePrint} className={btnBg}>
              <Printer className="w-4 h-4 mr-2" />
              Imprimir
            </Button>
            <Button variant="outline" onClick={handleReset} className={btnBg}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Resetar
            </Button>
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowBgPicker(!showBgPicker)}
                className={btnBg}
              >
                <Palette className="w-4 h-4 mr-2" />
                {showBgPicker ? "Fechar Cor de Fundo" : "Cor de Fundo"}
              </Button>
              {showBgPicker && (
                <ColorPickerPopover
                  colors={BG_COLORS}
                  selectedColor={bgColor}
                  onSelect={(c: string) => {
                    setBgColor(c);
                    setShowBgPicker(false);
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* ─── SEO Content Section ─────────────── */}
        <div
          style={{
            backgroundColor: darkMode ? "#0f0f1a" : "#f5f5f5",
            color: darkMode ? "#cbd5e1" : "#334155",
          }}
        >
          <section className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
            <h2 className="text-2xl font-bold mb-6" style={{ color: darkMode ? "#e2e8f0" : "#1e293b" }}>
              O que é Unique Selling Proposition (USP)?
            </h2>
            <div className="space-y-4 text-sm sm:text-base leading-relaxed">
              <p>
                A Unique Selling Proposition (USP), ou Proposta Única de Valor, é o fator ou benefício
                que torna um produto ou serviço diferente e melhor que os concorrentes. É a razão principal
                pela qual um cliente deve escolher sua oferta em vez das alternativas.
              </p>

              <h3 className="font-semibold text-lg mt-6 mb-2" style={{ color: darkMode ? "#e2e8f0" : "#1e293b" }}>
                Origem e História
              </h3>
              <p>
                O conceito de USP foi desenvolvido por Rosser Reeves, publicitário americano e presidente
                da agência Ted Bates & Company, na década de 1940. Reeves formalizou a ideia em seu livro
                "Reality in Advertising" (1961), onde argumentou que cada anúncio deve fazer uma proposição
                específica ao consumidor: "Compre este produto e você terá este benefício específico."
              </p>

              <h3 className="font-semibold text-lg mt-6 mb-2" style={{ color: darkMode ? "#e2e8f0" : "#1e293b" }}>
                Os Três Princípios da USP
              </h3>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Cada anúncio deve fazer uma proposição ao consumidor — não apenas palavras, não apenas exagero, mas um benefício concreto.</li>
                <li>A proposição deve ser única — algo que a concorrência não oferece ou não pode oferecer.</li>
                <li>A proposição deve ser forte o suficiente para mover milhões — atrair novos clientes.</li>
              </ol>

              <h3 className="font-semibold text-lg mt-6 mb-2" style={{ color: darkMode ? "#e2e8f0" : "#1e293b" }}>
                Quando Usar
              </h3>
              <p>
                Use o framework USP ao lançar um novo produto, reposicionar uma marca, criar campanhas
                de marketing, ou quando precisar comunicar claramente por que os clientes devem escolher você.
              </p>
              <p className="text-xs mt-6 opacity-70">
                Fonte: Reeves, Rosser (1961). Reality in Advertising. Alfred A. Knopf.
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* ─── Footer ──────────────────────────────── */}
      <Footer />

      {/* ─── Print Styles ────────────────────────── */}
      <style>{`
        @media print {
          * {
            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible !important; }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          header, footer, nav { display: none !important; }
        }
      `}</style>
    </div>
  );
}

function isLightColor(hex: string): boolean {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6;
}
