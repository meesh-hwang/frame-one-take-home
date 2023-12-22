import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Leaderboard } from '../interfaces';
import { useState, useEffect } from 'react';
import "./CommunityLeaderboard.css";

const CommunityLeaderboard = () => {
    const [communityLeaderboard, setCommunityLeaderboard] = useState<Leaderboard[]>([]);

    const { data: leaderboard, isLoading: leaderboardLoading } = useQuery({
        queryKey: ['leaderboard'],
        queryFn: () => axios.get('http://localhost:8080/leaderboard').then(res => res.data)
    });

    useEffect(() => {
        // Update the local state when the data changes
        setCommunityLeaderboard(communityLeaderboard);
      }, [communityLeaderboard]);

    if (leaderboardLoading) 
        return 'Loading...';

    return (
        <div className='leaderboard-container card'>
                <div className="header-row">
                    <div className='item'>Rank</div>
                    <div className='item'>Members</div>
                    <div className='item'>Points</div>
                </div>
                {leaderboard.map((entry: Leaderboard) => (
                    <div key={entry._id} className="leaderboard-entry">
                        <div className="rank">{entry.rank}</div>
                        <div className="community-logo">
                            <img src={entry.communityLogo} alt="Community Logo" />
                        </div>
                        <div className="name">{entry.communityName}</div>
                        <div className='members'>{entry.userCount}</div>
                        <div className='points'>{entry.communityPoints}</div>
                    </div>
                ))}
        </div>
    );
};

export default CommunityLeaderboard;