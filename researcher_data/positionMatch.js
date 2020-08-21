const positionMatch = str => {
  console.log('str inside positionMatch -----', str);
  let fullTitle = str.toLowerCase();
  const titleSplit = '';

  // if (fullTitle.indexOf('research associate') >= 0) {
  //   return 'Research Associate';
  // } else

  if (fullTitle.indexOf('adjunct associate professor of the practice') >= 0) {
    return 'Adjunct Associate Professor of the Practice';
  } else if (fullTitle.indexOf('adjunct professor of the practice') >= 0) {
    return 'Adjunct Professor of the Practice';
  } else if (fullTitle.indexOf('associate professor of the practice') >= 0) {
    return 'Associate Professor of the Practice';
  } else if (fullTitle.indexOf('professor of the practice') >= 0) {
    return 'Professor of the Practice';
  } else if (fullTitle.indexOf('adjunct assistant professor') >= 0) {
    return 'Adjunct Assistant Professor';
  } else if (fullTitle.indexOf('adjunct associate professor') >= 0) {
    return 'Adjunct Associate Professor';
  } else if (fullTitle.indexOf('adjunct professor') >= 0) {
    return 'Adjunct Professor';
  } else if (fullTitle.indexOf('associate professor') >= 0) {
    return 'Associate Professor';
  } else if (fullTitle.indexOf('assistant professor') >= 0) {
    return 'Assistant Professor';
  } else if (fullTitle.indexOf('university professor') >= 0) {
    return 'University Professor';
  } else if (fullTitle.indexOf('assistant research professor') >= 0) {
    return 'Assistant Research Professor';
  } else if (fullTitle.indexOf('associate research professor') >= 0) {
    return 'Associate Research Professor';
  } else if (fullTitle.indexOf('research professor') >= 0) {
    return 'Research Professor';
  } else if (fullTitle.indexOf('professor') >= 0) {
    return 'Professor';
  } else if (fullTitle.indexOf('adjunct instructor') >= 0) {
    return 'Adjunct Instructor';
  } else if (fullTitle.indexOf('instructor') >= 0) {
    return 'Instructor';
  } else if (fullTitle.indexOf('adjunct senior lecturer') >= 0) {
    return 'Adjunct Senior Lecturer';
  } else if (fullTitle.indexOf('senior lecturer') >= 0) {
    return 'Senior Lecturer';
  } else if (fullTitle.indexOf('adjunct lecturer') >= 0) {
    return 'Adjunct Lecturer';
  } else if (fullTitle.indexOf('lecturer') >= 0) {
    return 'Lecturer';
  } else if (fullTitle.indexOf('scholar-in-residence') >= 0) {
    return 'Scholar-in-Residence';
  } else if (fullTitle.indexOf('artist-in-residence') >= 0) {
    return 'Artist-in-Residence';
  } else if (fullTitle.indexOf('poet-in-residence') >= 0) {
    return 'Poet-in-Residence';
  } else if (fullTitle.indexOf('writer-in-residence') >= 0) {
    return 'Writer-in-Residence';
  } else {
    return '------------';
  }
};

module.exports = {
  positionMatch,
};
