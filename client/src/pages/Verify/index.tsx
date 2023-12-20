import { Link, useParams } from "react-router-dom";
import Container from "../../components/Container";
import { useEffect, useState } from "react";
import { variants } from "../../components/Button";
import { Check, X } from "react-feather";

export default function Verify() {
  const [returnData, setReturnData] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const { token } = useParams<{ token: string }>();
  useEffect(() => {
    fetch(import.meta.env.VITE_SERVER_LINK + "/auth/" + token, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data: { success: boolean; message: string }) => {
        setReturnData({
          success: data.success,
          message: data.message,
        });
      });
  }, [token]);

  return (
    <Container>
      <section className="flex flex-col items-start w-full max-w-3xl gap-4">
        {(returnData && (
          <>
            <div className="flex flex-col w-full gap-4">
              <div className="flex flex-row items-center gap-2">
                <h1 className="lg:text-4xl text-2xl font-medium text-orange-600">
                  {returnData.success
                    ? "Successfully Verified!"
                    : "Failed to Verify"}
                </h1>
                {returnData.success ? (
                  <Check className="text-green-600 w-8 h-8" />
                ) : (
                  <X className="text-red-600 w-8 h-8" />
                )}
              </div>
              <p className="">{returnData.message}</p>
            </div>
            <Link
              className={variants({
                variant: "orange",
              })}
              to={returnData.success ? "/home" : "/"}
            >
              {returnData.success ? "Continue" : "Return"}
            </Link>
          </>
        )) || <LoadingComponent />}
      </section>
    </Container>
  );
}

const LoadingComponent = () => {
  return (
    <>
      <span
        className={
          "h-10 w-52 animate-pulse rounded-sm bg-neutral-400 dark:bg-neutral-700"
        }
      />
      <span
        className={
          "h-4 w-64 animate-pulse rounded-sm bg-neutral-400 dark:bg-neutral-700"
        }
      />
    </>
  );
};
