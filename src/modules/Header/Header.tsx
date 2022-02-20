import React, { FC, useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { styles } from "./Header.style";

export const Header: FC = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setHasMounted(true), []);

  return (
    <header className={styles.header}>
      <Link href="/">
        <a className={styles.homeLink}>Etienne Martin</a>
      </Link>
      <div>
        {hasMounted && (
          <>
            {theme === "dark" && (
              <button onClick={() => setTheme("light")}>Light Mode</button>
            )}
            {theme === "light" && (
              <button onClick={() => setTheme("dark")}>Dark Mode</button>
            )}
          </>
        )}
      </div>
    </header>
  );
};
