import html2canvas from "html2canvas";

export async function exportToPng(
  element: HTMLElement,
  fileName: string = "framework-station"
): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: null,
    useCORS: true,
  });

  const link = document.createElement("a");
  link.download = `${fileName}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

export async function shareAsPng(
  element: HTMLElement,
  title: string = "Framework Station"
): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: null,
    useCORS: true,
  });

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/png")
  );

  if (blob && navigator.share) {
    const file = new File([blob], `${title}.png`, { type: "image/png" });
    try {
      await navigator.share({ title, files: [file] });
      return;
    } catch {
      // User cancelled or share failed, fall back to download
    }
  }

  // Fallback to download
  await exportToPng(element, title);
}
