import './App.css'
import CommunityLeaderboard from './components/CommunityLeaderboard';
import UserCommunityRelationshipManager from './components/UserCommunityRelationshipManager'
import { Toaster } from 'react-hot-toast';

function App() {

  return (
    <>
      <Toaster />
      <div>
        <a href="https://frameonesoftware.com" target="_blank">
          <img src="/logo.png" className="logo" alt="Frame One Software Logo" />
        </a>
      </div>
      <div className='page-container'>
        <UserCommunityRelationshipManager />
        <CommunityLeaderboard />
      </div>
    </>
  )
}

export default App