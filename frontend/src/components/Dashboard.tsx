import { useQuery } from "@tanstack/react-query";
import UserInfo from "./UserInfo"
import axios from "axios";
import { User } from "../interfaces";

const Dashboard = () => {

    const { data: users, isLoading: usersLoading } = useQuery({
        queryKey: ['users'],
        queryFn: () => axios.get('http://localhost:8080/user').then(res => res.data)
    });
    
    const userData = users && users.find((user: User) => user._id === selectedUser);

    return(
        <div className='user-points-container card'>
                    {userData ? (
                        <UserInfo experiencePoints={userData!.totalExperience} />
                    ) : <UserInfo experiencePoints={0} />}
                </div>
    )
}