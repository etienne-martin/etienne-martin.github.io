import React, { FC } from "react";
import { styles } from "./Footer.style";
import { SITE_NAME } from "../../config";

export const Footer: FC = () => {
  return (
    <footer className={styles.footer}>
      © {new Date().getFullYear()} {SITE_NAME}
    </footer>
  );
};
