import React, { FC, useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { styles } from "./Header.style";
import { SunIcon } from "../../icons/Sun";
import { MoonIcon } from "../../icons/Moon";

export const Header: FC = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const oppositeTheme = theme === "dark" ? "light" : "dark";

  useEffect(() => setHasMounted(true), []);

  const toggleTheme = () => setTheme(oppositeTheme);

  return (
    <header className={styles.header}>
      <Link href="/">
        <a className={styles.homeLink}>Etienne Martin</a>
      </Link>
      <div>
        {hasMounted && (
          <button className={styles.themeToggle} onClick={toggleTheme}>
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            Switch to {oppositeTheme} theme
          </button>
        )}
      </div>
    </header>
  );
};
