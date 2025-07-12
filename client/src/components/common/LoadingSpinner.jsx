import { memo } from 'react';

const LoadingSpinner = ({ fullScreen = false }) => (
  <div className={`flex justify-center items-center ${fullScreen ? 'h-screen' : 'py-8'}`}>
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-DEFAULT"></div>
    {fullScreen && <span className="sr-only">Loading...</span>}
  </div>
);

export default memo(LoadingSpinner);