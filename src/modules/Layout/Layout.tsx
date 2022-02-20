import React, { FC } from "react";
import { styles } from "./Layout.style";
import { Header } from "../Header/Header";
import { Footer } from "../Footer/Footer";

export const Layout: FC = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
};
