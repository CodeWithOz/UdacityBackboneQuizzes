function template(str, { open = '*(', close = ')*' } = {}) {
  let template = '',
    remainingStr = str,
    potMatch = '',
    closeLoc = 0,
    openLoc = 0,
    placeholder = '';
  const results = [];

  // arguments for the resulting function
  // using a set ensures that only unique values are stored
  const args = new Set();

  while (remainingStr.indexOf(close) > -1) {
    // closing delim has been found
    // save its location
    closeLoc = remainingStr.indexOf(close);

    // save the string containing the potential match
    potMatch = remainingStr.slice(0, closeLoc);

    if (potMatch.lastIndexOf(open) > -1) {
      // lastIndexOf ensures we find the opening delimiter that
      // is closest to the end of the potential match
      // this avoids matching opening delimiters that were
      // not intended to serve as delimiters

      // save location of open delim
      openLoc = potMatch.lastIndexOf(open);

      // add section before placeholder to the results array
      results.push(potMatch.slice(0, openLoc));

      // remove the delim and any whitespace around the text
      // and save the interior as the placeholder
      placeholder = potMatch.slice(openLoc + open.length).trim();

      // add placeholder to the results
      // Using an object distinguishes this entry in the array
      // from those that simply need to be interpolated
      results.push({string: placeholder});

      // add placeholder to the Set of arguments
      args.add(placeholder);

      // update the remaining string by removing this matching
      // section along with the rest of the closing delim
      remainingStr = remainingStr.slice(closeLoc + close.length);
    } else {
      // the potential match contains no placeholders
      results.push(potMatch);

      // remove this section from the remaining string
      remainingStr = remainingStr.slice(closeLoc);
    }
  }

  if (remainingStr !== str && remainingStr.length > 0) {
    // the string was truncated in the while loop
    // and the original didn't end with a placeholder
    // (if it did, the final remainingStr would be an empty string)
    // therefore we must add the leftover to the results
    results.push(remainingStr);
  }

  // check if any results were found
  if (results.length > 0) {
    // create template

    // using backticks allows for ES6 interpolation inside
    // function
    template = '`';
    results.forEach(entry => {
      if (typeof entry === 'string') {
        // interpolate
        template += entry;
      } else {
        // evaluate
        template += `\$\{${entry.string}\}`;
      }
    });

    // close out the template string
    template += '`';
  } else {
    // original string is the template
    template = `'${remainingStr}'`;
  }

  // now create the function
  return new Function(...args, 'num', `
    // first round the passed in number
    num = Math.round(num);

    // now log the string as often as necessary
    if (num < 1) return '';
    while (num > 0) {
      console.log(${template});
      num--;
    }

    // now return the template string
    return ${template};
  `);
}
