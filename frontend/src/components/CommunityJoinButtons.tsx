import React from 'react';

interface CommunityJoinButtonsProps {
    onJoin: () => void;
    onLeave: () => void;
    disabled: boolean;
}

const CommunityJoinButtons: React.FC<CommunityJoinButtonsProps> = ({ onJoin, onLeave, disabled }) => {
    return (
        <div className='buttons'>
            <button
                className="join-button"
                onClick={onJoin}
                disabled={disabled}
            >
                Join
            </button>
            <button
                className="join-button"
                onClick={onLeave}
                disabled={disabled}
            >
                Leave
            </button>
        </div>
    );
};

export default CommunityJoinButtons;
