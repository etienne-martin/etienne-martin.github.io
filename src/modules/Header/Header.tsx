import React, { FC, useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { styles } from "./Header.style";
import { SunIcon } from "../../icons/Sun";
import { MoonIcon } from "../../icons/Moon";
import { Image } from "../../components/Image";
import { SITE_DESCRIPTION, SITE_NAME } from "../../config";

const profilePicture = require("./etienne-martin.jpg");

export const Header: FC = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const { resolvedTheme: theme, setTheme } = useTheme();
  const oppositeTheme = theme === "dark" ? "light" : "dark";

  useEffect(() => setHasMounted(true), []);

  const toggleTheme = () => setTheme(oppositeTheme);

  return (
    <header className={styles.header}>
      <div>
        <Link href="/">
          <a aria-label="Go back home" className={styles.homeLink}>
            <Image
              alt="A tiny photo of me"
              className={styles.photo}
              src={profilePicture.src}
              srcSet={profilePicture.srcSet}
              width={profilePicture.width}
              height={profilePicture.height}
              sizes="60px"
            />
            <p>
              <strong>{SITE_NAME}</strong>
              <em>{SITE_DESCRIPTION}</em>
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
