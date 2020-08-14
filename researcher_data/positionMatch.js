const positionMatch = fullTitle => {
  const titleSplit = '';

  if (fullTitle.indexOf('Professor') >= 0) {
    return 'Professor';
  } else {
    return '------------';
  }
};

module.exports = {
  positionMatch,
};
