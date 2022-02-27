import { useCallback, useEffect, useRef, useState } from "react";
import { Timer } from "../../utils/timer";

type Log = { tokens: any[]; type: "output" | "Request" };
type Status = "idle" | "pending" | "rejected" | "fulfilled";

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

export const useCodeExecution = (code: string) => {
  const hasUnmountedRef = useRef(false);
  const [status, setStatus] = useState<Status>("idle");
  const [logs, setLogs] = useState<Log[]>([]);
  const [executionTime, setExecutionTime] = useState(0);
  const isExecutable = code.includes("console.log(") || code.includes("fetch(");

  const appendLog = (log: Log) => {
    if (hasUnmountedRef.current) return;
    setLogs((logs) => [...logs, log]);
  };

  const execute = useCallback(() => {
    if (!isExecutable) return;

    setLogs([]);
    setStatus("pending");

    const mockedConsole = {
      log: (...args: any[]) => {
        appendLog({
          type: "output",
          tokens: args,
        });
      },
    };

    const mockedFetch: (
      ...args: Parameters<typeof fetch>
    ) => Promise<any> = async (input, init) => {
      appendLog({
        type: "Request",
        tokens: [`${init?.method ?? "GET"} ${input}`],
      });
    };

    const pendingPromises: Promise<any>[] = [];

    class MonkeyPatchedPromise extends Promise<any> {
      constructor(executor: any) {
        super(executor);
        pendingPromises.push(this);
      }
    }

    const timer = new Timer();

    try {
      const runner = new AsyncFunction(
        "console",
        "fetch",
        "Promise",
        `return (async () => {
          ${code}
        })()`
      );

      const execution = runner(
        mockedConsole,
        mockedFetch,
        MonkeyPatchedPromise
      );

      Promise.allSettled([execution, ...pendingPromises]).then(
        ([executionResult]) => {
          if (hasUnmountedRef.current) return;

          if (executionResult.status === "rejected") {
            console.log(executionResult.reason);
          }

          setStatus(executionResult.status);
          setExecutionTime(timer.elapsed());
        }
      );
    } catch (err) {
      console.error(err);
      setStatus("rejected");
      setExecutionTime(timer.elapsed());
    }

    return () => {
      hasUnmountedRef.current = true;
    };
  }, [isExecutable, code]);

  useEffect(() => {
    execute();
  }, [execute]);

  return { isExecutable, execute, logs, status, executionTime };
};
