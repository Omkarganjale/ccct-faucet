import React from 'react';
import { JellyfishSpinner   } from 'react-spinners-kit';

const Spinner = ({ isLoading }) => {
	return (
		<div>
			<JellyfishSpinner   size={120} color='#DA9F4A' loading={isLoading} />
		</div>
	);
};

export default Spinner;