import React from 'react';
import Spinner from './Spinner';

const LoadContainer = ({isLoading, loadingMsg}) => {
    return (
        <div className='loadContainer'>
            <Spinner isLoading={isLoading} className='spin' /> 
            <div className='load'>
                {loadingMsg}
            </div>
        </div>
    )
}

export default LoadContainer;