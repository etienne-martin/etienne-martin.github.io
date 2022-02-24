import { FC, useEffect } from "react";
import { Language } from "prism-react-renderer";
import { useInView } from "react-intersection-observer";
import serialize from "serialize-javascript";
import { styles } from "./CodeRunner.style";
import { SyntaxHighlighting } from "../SyntaxHighlighting";
import { useCodeExecution } from "./CodeRunner.hook";
import { Heading } from "../Heading";
import { ReplayIcon } from "../../icons/Replay";

interface ConsoleProps {
  code: string;
}

export const CodeRunner: FC<ConsoleProps> = ({ code }) => {
  const { ref, inView } = useInView();
  const { isExecutable, execute, logs, status, executionTime } =
    useCodeExecution(code);

  useEffect(() => {
    if (!inView || status !== "idle") return;
    execute();
  }, [inView, status, execute]);

  if (!isExecutable) return null;

  return (
    <div className={styles.wrapper} ref={ref}>
      <div className={styles.scroll}>
        <div className={styles.header}>
          <Heading.h6 as="h3" className={styles.label}>
            Console:
          </Heading.h6>
          <button className={styles.replay} onClick={() => execute()}>
            <ReplayIcon />
          </button>
        </div>
        <div className={styles.console}>
          {logs.map(({ tokens, type }, index) => {
            if (type === "Request") {
              return (
                <div key={index} className={styles.log}>
                  <SyntaxHighlighting
                    className={styles.line}
                    code={tokens.join(" ")}
                    language={"" as Language}
                  />
                </div>
              );
            }

            return (
              <div key={index} className={styles.log}>
                <SyntaxHighlighting
                  className={styles.line}
                  code={tokens
                    .map((token) =>
                      serialize(token, { space: 2, unsafe: true })
                    )
                    .join(" ")}
                  language="javascript"
                />
              </div>
            );
          })}
        </div>
        <div className={styles.footer}>
          {status === "pending" && (
            <div className={styles.status}>Running...</div>
          )}

          {status === "fulfilled" && (
            <div className={styles.status}>
              Execution time: {executionTime}ms
            </div>
          )}

          {status === "rejected" && (
            <div className={styles.status}>
              ❌ Failed after {executionTime}ms
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
