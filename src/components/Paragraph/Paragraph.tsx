import { FC, HTMLAttributes } from "react";
import classnames from "classnames";
import { styles } from "./Paragraph.style";

type ParagraphProps = HTMLAttributes<HTMLParagraphElement>;

export const Paragraph: FC<ParagraphProps> = ({ children, className }) => {
  return <p className={classnames(styles.paragraph, className)}>{children}</p>;
};
