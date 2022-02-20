import { FC, HTMLAttributes } from "react";
import classnames from "classnames";
import { styles } from "./List.style";

type ListProps = HTMLAttributes<HTMLUListElement>;

export const List: FC<ListProps> = ({ children, className }) => {
  return <ul className={classnames(styles.list, className)}>{children}</ul>;
};
