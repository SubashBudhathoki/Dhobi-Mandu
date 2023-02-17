import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ComponentType } from "react";

type TError = {
  message: string;
};

export default function WithDataFetching<T>(
  Component: ComponentType<T>,
  query: string,
  api_fn: (...args: any[]) => Promise<any>
) {
  return function DataFetchingComponent(props: T) {
    const { isLoading, error, data } = useQuery({
      queryKey: [query],
      queryFn: api_fn,
    });

    if (isLoading) {
      return <div>Loading...</div>;
    }
    if (error) {
      return (
        <>
          <div>Server Error</div>
          <Component {...props} data={undefined} />
        </>
      );
    }
    return <Component {...props} data={data} />;
  };
}
