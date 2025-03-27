// ThemeLoader.tsx
import { useEffect } from "react";

const ThemeLoader: React.FC = () => {
  useEffect(() => {
    async function loadTheme() {
      try {
        const response = await fetch("/api/theme/theme-variables");
        if (!response.ok) {
          console.error("Failed to load theme variables from MongoDB. Status:", response.status);
          return;
        }
        const { css } = await response.json();
        if (css) {
          // Check if a style tag already exists, then update or create one.
          let themeStyle = document.getElementById("mongo-theme") as HTMLStyleElement;
          if (!themeStyle) {
            themeStyle = document.createElement("style");
            themeStyle.id = "mongo-theme";
            document.head.appendChild(themeStyle);
          }
          themeStyle.innerHTML = css;
        }
      } catch (error) {
        console.error("Error loading theme variables:", error);
      }
    }

    loadTheme();
  }, []);

  return null;
};

export default ThemeLoader;
