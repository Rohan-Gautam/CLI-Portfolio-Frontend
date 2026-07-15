// ===== CRT Screen Position =====
// Adjust these percentages to perfectly position the terminal viewport over the screen area in your CRT monitor image.
export const SCREEN = {
  left: "6.0%",    // Percentage from the left edge of the monitor image
  top: "9.6%",     // Percentage from the top edge of the monitor image
  width: "71.6%",  // Width as a percentage of the monitor image width
  height: "77.2%"  // Height as a percentage of the monitor image height
};

// Toggle this flag during development. If true, a semi-transparent red debugging rectangle
// will overlay the terminal viewport so you can visually verify alignment in real time.
export const DEBUG_SCREEN_ALIGNMENT =
  import.meta.env.VITE_DEBUG_SCREEN_ALIGNMENT === "true";
