"use strict";

var getStatus = function getStatus(status) {
  switch (status) {
    case 0:
      return 'Waiting';

    case 5:
      return 'Waiting Quoting';

    case 6:
      return 'Quoting';

    case 7:
      return 'Quote Ready';

    case 17:
      return 'Pending Accept/Reject';

    case 20:
      return 'Preprocessing';

    case 30:
      return 'Processing';

    case 40:
      return 'PostProcessing';

    case 100:
      return 'Finished';

    case 110:
      return 'Downloaded';

    case 120:
      return 'Downloaded';

    default:
      return 'Waiting';
  }
};

module.exports = {
  getStatus: getStatus
};