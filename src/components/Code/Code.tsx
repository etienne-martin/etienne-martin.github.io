import { FC } from "react";
import Highlight, { Language, Prism } from "prism-react-renderer";
import darkTheme from "prism-react-renderer/themes/dracula";
import { styles } from "./Code.style";
import { Clipboard } from "../Clipboard/Clipboard";

interface CodeProps {
  children?: string;
  className?: string;
}

export const Code: FC<CodeProps> = ({ children, className }) => {
  const language = (className?.replace(/^language-/, "") as Language) ?? "";
  const code = children?.trim() ?? "";

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
      </div>
    </div>
  );
};
