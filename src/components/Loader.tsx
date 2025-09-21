import React from 'react';

interface LoaderProps {
    isVisible: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ isVisible }) => {
    if (!isVisible) return null;

    return (
        <div className="loader">
            <div className="spinner"></div>
        </div>
    );
};
