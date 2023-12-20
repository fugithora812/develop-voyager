import React from 'react';

interface StringType {
  type: 'articleLongToc' | 'articleShortToc';
}

const abbreviateString = (str: string, { type }: StringType): React.ReactElement => {
  const max = type === 'articleLongToc' ? 8 : type === 'articleShortToc' ? 5 : 0;

  if (max === 0) {
    return (
      <div className="tooltip" data-tip={str}>
        {str}
      </div>
    );
  }

  let strPoint = 0;
  let newStr = '';

  for (let i = 0; i < str.length; i++) {
    const char = str[i];

    // Check if character is full-width or half-width
    // If character code is less than 256,
    // it's considered a half-width character in this context
    if (char.charCodeAt(0) < 256) {
      strPoint += 0.5;
    } else {
      strPoint += 1;
    }

    if (strPoint > max) {
      return (
        <div className="tooltip" data-tip={str}>
          {`${newStr}...`}
        </div>
      );
    }
    newStr += char;
  }
  return (
    <div className="tooltip" data-tip={str}>
      {str}
    </div>
  );
};

export default abbreviateString;
