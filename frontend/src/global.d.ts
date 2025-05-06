interface Window {
  process: any;
  global: any;
}

declare const process: {
  env: {
    NODE_ENV: string;
    [key: string]: string | undefined;
  };
};