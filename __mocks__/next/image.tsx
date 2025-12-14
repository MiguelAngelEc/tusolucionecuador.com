import React from 'react';

const NextImage = (props: any) => {
  const { src, alt, width, height, className, priority, placeholder, ...rest } = props;

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      data-testid="next-image"
      {...rest}
    />
  );
};

export default NextImage;