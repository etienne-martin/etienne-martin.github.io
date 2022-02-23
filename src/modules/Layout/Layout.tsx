import React, { FC } from "react";
import { styles } from "./Layout.style";
import { Header } from "../Header";
import { Footer } from "../Footer";

export const Layout: FC = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
};
