import React from 'react';
import { User, Community } from '../interfaces';

interface UserCommunitySelectsProps {
    users: User[];
    communities: Community[];
    onSelectUser: (userId: string) => void;
    onSelectCommunity: (communityId: string) => void;
}

const UserCommunitySelects: React.FC<UserCommunitySelectsProps> = ({ users, communities, onSelectUser, onSelectCommunity }) => {
    return (
        <div>
            <select onChange={(e) => onSelectUser(e.target.value)}>
                <option value="">Select User</option>
                {users.map((user) => (
                    <option key={user._id} value={user._id}>
                        {user.email}
                    </option>
                ))}
            </select>
            <select onChange={(e) => onSelectCommunity(e.target.value)}>
                <option value="">Select Community</option>
                {communities.map((community) => (
                    <option key={community._id} value={community._id}>
                        {community.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default UserCommunitySelects;
