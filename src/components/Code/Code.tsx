import { FC } from "react";
import Highlight, { Language, Prism } from "prism-react-renderer";
import darkTheme from "prism-react-renderer/themes/dracula";
import { styles } from "./Code.style";
import { Clipboard } from "../Clipboard/Clipboard";
import classnames from "classnames";

interface CodeProps {
  children?: string;
  className?: string;
  highlight?: string;
}

export const Code: FC<CodeProps> = ({
  children,
  className,
  highlight,
  ...otherProps
}) => {
  const language = (className?.replace(/^language-/, "") as Language) ?? "";
  const code = children?.trim() ?? "";

  const highlightLines =
    highlight?.split(",").map((line) => parseInt(line, 10)) ?? [];

  return (
    <div className={styles.wrapper}>
      <Clipboard text={code} className={styles.clipboard} />
      <div className={styles.container}>
        <Highlight
          Prism={Prism}
          theme={darkTheme}
          code={code}
          language={language}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <code className={className} style={style}>
              {tokens.map((line, key) => {
                const { className, ...lineProps } = getLineProps({ line });
                const lineNumber = key + 1;

                return (
                  <div
                    key={key}
                    className={classnames(className, styles.line, {
                      [styles.highlighted]: highlightLines.includes(lineNumber),
                    })}
                    {...lineProps}
                  >
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </div>
                );
              })}
            </code>
          )}
        </Highlight>
      </div>
    </div>
  );
};
