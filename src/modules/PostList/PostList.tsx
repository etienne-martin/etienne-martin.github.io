import React, { FC } from "react";
import { styles } from "./PostList.style";

export const PostList: FC = ({ children }) => {
  return <div className={styles.list}>{children}</div>;
};
