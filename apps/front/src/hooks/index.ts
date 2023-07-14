export * from './useWindowSize';
export * from './useBrowserInfo';
export * from './useInterval';

export const useCheckAuthLocalStorage = () => {
  const LOCAL_STORAGE_KEY = 'checkAuth';
  const localStorageValues = {
    true: 'true',
    false: 'false',
  } as const;

  const checkAuth =
    localStorage.getItem(LOCAL_STORAGE_KEY) === localStorageValues.true;

  const setCheckAuth = (value: boolean) => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      value ? localStorageValues.true : localStorageValues.false,
    );
  };

  return { checkAuth, setCheckAuth };
};
