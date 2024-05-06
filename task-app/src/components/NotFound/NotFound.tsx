import React from 'react';

interface NotFoundProps {
  // add any props you might need here
}

export const NotFound: React.FC<NotFoundProps> = (
  {
    /* destructure props here if needed */
  },
) => {
  // your component logic here if you have any

  return (
    <div>
      <h1>404 Not Found 😢</h1>
      <p>Noooooo! The page you're looking for doesn't exist!</p>
    </div>
  );
};
