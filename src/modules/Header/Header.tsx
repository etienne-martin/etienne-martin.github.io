import React, { FC, useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { styles } from "./Header.style";
import { SunIcon } from "../../icons/Sun";
import { MoonIcon } from "../../icons/Moon";
import { Image } from "../../components/Image";

export const Header: FC = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const oppositeTheme = theme === "dark" ? "light" : "dark";

  useEffect(() => setHasMounted(true), []);

  const toggleTheme = () => setTheme(oppositeTheme);

  return (
    <header className={styles.header}>
      <div>
        <Link href="/">
          <a aria-label="Go back home" className={styles.homeLink}>
            <Image
              className={styles.photo}
              alt="A tiny photo of me"
              src="/etienne-martin.jpg"
            />
            <p>
              <strong>Etienne Martin</strong>
              <em>Thinking out loud about web development.</em>
            </p>
          </a>
        </Link>
      </div>
      <div>
        {hasMounted && (
          <button
            aria-label={`Switch to ${oppositeTheme} theme`}
            className={styles.themeToggle}
            onClick={toggleTheme}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
        )}
      </div>
    </header>
  );
};
