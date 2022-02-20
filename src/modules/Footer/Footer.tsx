import React, { FC } from "react";
import { styles } from "./Footer.style";

export const Footer: FC = () => {
  return (
    <footer className={styles.footer}>
      © {new Date().getFullYear()} Etienne Martin
    </footer>
  );
};
