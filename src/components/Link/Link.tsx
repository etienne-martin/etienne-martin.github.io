import { AnchorHTMLAttributes, FC } from "react";
import classnames from "classnames";
import NextLink from "next/link";
import { styles } from "./Link.style";
import { isAbsoluteUrl } from "../../utils/url";
import { ORIGIN } from "../../config";

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

export const Link: FC<LinkProps> = ({
  href,
  target,
  children,
  className,
  ...otherProps
}) => {
  const _target =
    isAbsoluteUrl(href) && !href.startsWith(ORIGIN) ? "_blank" : target;

  return (
    <NextLink href={href}>
      <a
        target={_target}
        className={classnames(styles.link, className)}
        {...otherProps}
      >
        {children}
      </a>
    </NextLink>
  );
};
