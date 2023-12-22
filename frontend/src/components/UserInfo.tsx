interface UserInfoProps {
    experiencePoints: number;
  }

const UserInfo: React.FC<UserInfoProps> = ({ experiencePoints }) => {
    return(
        <div className='user-points-inner'>
            <h3>Your Points</h3>
            <div>{experiencePoints}</div>
        </div>
    )
}

export default UserInfo