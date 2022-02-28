import { FC, LiHTMLAttributes } from "react";
import classnames from "classnames";
import { styles } from "./ListItem.style";

type ListItemProps = LiHTMLAttributes<HTMLLIElement>;

export const ListItem: FC<ListItemProps> = ({ children, className }) => {
  return <li className={classnames(styles.listItem, className)}>{children}</li>;
};
