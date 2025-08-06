import { useMediaQuery } from 'react-responsive';

export const useDeviceType = () => {
  const isMobile = useMediaQuery({ maxWidth: 529 });
  return { isMobile };
};
