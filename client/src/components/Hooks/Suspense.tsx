import { useState } from "react";

export default function Suspense({
  children,
  loader,
  ...props
}: {
  children: React.ReactNode;
  loader: React.ReactNode;
}) {
  const [loadingState, setLoadingState] = useState<boolean>(false);
  return <main {...props}>{loadingState ? loader : children}</main>;
}
