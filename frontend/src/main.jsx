import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { StoreContextProvider } from './context/AuthContext.jsx'
import { SocketContextProvider} from './context/SocketContext.jsx'
import { GroupSocketContext } from './context/GroupContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <StoreContextProvider>
      <SocketContextProvider>
        <GroupSocketContext>
        <App />
        </GroupSocketContext>
     
      </SocketContextProvider>
  
    </StoreContextProvider>
    
    </BrowserRouter>
   
  </StrictMode>,
)
