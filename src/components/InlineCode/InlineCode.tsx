import { FC } from "react";
import { styles } from "./InlineCode.style";

export const InlineCode: FC = ({ children }) => {
  return <code className={styles.wrapper}>{children}</code>;
};
