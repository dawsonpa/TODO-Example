import moment from 'moment'

export const formatDates = (date?: Date) => {
	if(date) {
		return moment(date).format('MM-DD-YYYY').toString();

	}

	return '--';
}