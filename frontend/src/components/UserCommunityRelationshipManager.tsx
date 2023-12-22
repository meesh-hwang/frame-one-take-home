import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Community, User } from '../interfaces';
import "./UserCommunityRelationshipManager.css";
import { ToastPosition, toast } from 'react-hot-toast';
import UserInfo from './UserInfo';
import UserCommunitySelects from './UserCommunitySelects';
import CommunityJoinButtons from './CommunityJoinButtons';

interface MutationData {
    userId: string;
    communityId: string;
};

const UserCommunityRelationshipManager = () => {
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);
    const [userCommunity, setUserCommunity] = useState<Community | null>(null);

    const { data: users, isLoading: usersLoading } = useQuery({
        queryKey: ['users'],
        queryFn: () => axios.get('http://localhost:8080/user').then(res => res.data)
    });

    const { data: communities, isLoading: communitiesLoading } = useQuery({
        queryKey: ['communities'],
        queryFn: () => axios.get('http://localhost:8080/community').then(res => res.data)
    });

    const userData = users && users.find((user: User) => user._id === selectedUser);

    const communityData = communities && communities.find((community: Community) => community.users?.find((id) => id === selectedUser));

    useEffect(() => {

        setUserCommunity(communityData);

    }, [userCommunity])

    // Styling for react-hot-toast
    const toastStyle = {
        position: 'top-center' as ToastPosition,
        icon: (type: string) => (type === 'success' ? '👏' : '❌'),
        duration: 2000,
        style: {
            fontFamily: 'Noto Sans Mono',
            fontSize: '0.8em',
            backgroundColor: '#3a394fd0',
            padding: '2em 1em',
            color: '#AAAAAA',
            borderRadius: '50em',
            marginTop: '2em',
        },
    };

    // Join community
    const joinMutation = useMutation({
        mutationFn: (data: MutationData) => axios.post(`http://localhost:8080/user/${data.userId}/join/${data.communityId}`),
        onSuccess: () => {
            toast('Successfully joined the community', {
                position: toastStyle.position,
                icon: toastStyle.icon('success'),
                style: toastStyle.style,
                duration: toastStyle.duration
            });
        },
        onError: (error: any) => {
            // Set error message to message received from the response
            const errorMessage = error?.response?.data?.message || 'An error occurred leaving the community';

            // If user was already in a community
            if (error?.response?.status === 403) {
                toast.custom(
                    <div className='leave-join-toast'>
                        <p>{errorMessage}</p>
                        <div className='toast-buttons'>
                            <button onClick={() => {
                                handleLeaveAndJoinClick()
                                // Close all toasts
                                toast.dismiss()
                            }}>
                                Leave and Join
                            </button>
                            <button onClick={() => toast.dismiss()}>Dismiss</button>
                        </div>
                    </div>,
                    {
                        position: 'top-center',
                        duration: 500000
                    });
            } else {
                toast(`${errorMessage}`, {
                    position: toastStyle.position,
                    icon: toastStyle.icon('error'),
                    style: toastStyle.style,
                    duration: toastStyle.duration
                });
            }
        }
    });


    const leaveMutation = useMutation({
        mutationFn: (data: MutationData) => axios.delete(`http://localhost:8080/user/${data.userId}/leave/${data.communityId}`),
        onSuccess: (res: any) => {
            toast('Successfully left the community', {
                position: toastStyle.position,
                icon: toastStyle.icon('success'),
                style: toastStyle.style,
                duration: toastStyle.duration
            });

            // Leave THEN join
            // Leave mutation succeeded, trigger joinMutation if status code 403 is sent
            if (selectedUser && selectedCommunity && res?.statusCode === 403) {

                joinMutation.mutate({ userId: selectedUser, communityId: selectedCommunity });

            }
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'An error occurred while joining the community';
            toast(`${errorMessage}`, {
                position: toastStyle.position,
                icon: toastStyle.icon('error'),
                style: toastStyle.style,
                duration: toastStyle.duration
            });
        },

    });

    // Handle leave and join click for when a user attempts to join a community while they are already in one
    const handleLeaveAndJoinClick = () => {

        const communityData = communities && communities.find((community: Community) => community.users?.find((id) => id === selectedUser));

        if (communityData && selectedUser && selectedCommunity) {
            leaveMutation.mutate({ userId: selectedUser, communityId: communityData._id });
        }
    }

    const handleJoinClick = () => {
        if (selectedUser && selectedCommunity) {
            joinMutation.mutate({ userId: selectedUser, communityId: selectedCommunity });
        }
    };

    const handleLeaveClick = () => {
        // If user and community are selected
        if (selectedUser && selectedCommunity) {
            console.log(userData)
            console.log(selectedUser)
            leaveMutation.mutate({ userId: selectedUser, communityId: selectedCommunity });
        }
    };

    if (usersLoading || communitiesLoading) return 'Loading...';

    return (
        <div className='user-community-wrapper'>
            <div className='join-community-container card'>
                <UserCommunitySelects
                    users={users}
                    communities={communities}
                    onSelectUser={setSelectedUser}
                    onSelectCommunity={setSelectedCommunity}
                />
                <CommunityJoinButtons
                    onJoin={handleJoinClick}
                    onLeave={handleLeaveClick}
                    disabled={!selectedUser || !selectedCommunity}
                />
            </div>
            <div className='user-points-container card'>
                {userData ? (
                    <UserInfo experiencePoints={userData!.totalExperience} />
                ) : <UserInfo experiencePoints={0} />}
            </div>
        </div>
    );
};

export default UserCommunityRelationshipManager;