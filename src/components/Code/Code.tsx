import { FC } from "react";
import classnames from "classnames";
import Highlight, { Language, Prism } from "prism-react-renderer";
import darkTheme from "prism-react-renderer/themes/dracula";
import { styles } from "./Code.style";

interface CodeProps {
  children?: string;
  className?: string;
}

export const Code: FC<CodeProps> = ({ children, className }) => {
  const language = (className?.replace(/^language-/, "") as Language) ?? "";
  const code = children?.trim() ?? "";

  return (
    <Highlight Prism={Prism} theme={darkTheme} code={code} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <code className={classnames(styles.container, className)} style={style}>
          {tokens.map((line, key) => (
            <div key={key} {...getLineProps({ line })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </code>
      )}
    </Highlight>
  );
};
