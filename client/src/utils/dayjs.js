import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/ja';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
