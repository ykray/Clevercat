import { Logger } from 'tslog';

const log: Logger = new Logger({
  name: 'myLogger',
  displayLoggerName: false,
  prettyInspectHighlightStyles: {
    string: 'greenBright',
    name: 'white',
  },
});

export default log;
