import { AnchorHTMLAttributes, FC } from "react";
import classnames from "classnames";
import NextLink from "next/link";
import { styles } from "./Link.style";

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

const startsWithProtoRegex = new RegExp(/^http(s)?:\/\//);

export const Link: FC<LinkProps> = ({
  href,
  target,
  children,
  className,
  ...otherProps
}) => {
  const _target = startsWithProtoRegex.test(href) ? "_blank" : target;

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
