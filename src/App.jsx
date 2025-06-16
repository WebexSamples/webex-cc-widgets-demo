import React, {useState, useEffect} from 'react';
import './App.css';
import { StationLogin, UserState, IncomingTask, TaskList, CallControlCAD, store } from '@webex/cc-widgets';
import { IconProvider, ThemeProvider, Button } from '@momentum-design/components/dist/react';
import {observer} from 'mobx-react-lite';

function App() {
  const [accessToken, setAccessToken] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [incomingTasks, setIncomingTasks] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isBrowser = typeof window !== 'undefined';

  const playNotificationSound = () => {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);

    osc.connect(gain);
    gain.connect(ctx.destination);

    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  };

  useEffect(() => {
    // Set up incoming task callback
    store.setIncomingTaskCb(({ task }) => {
      console.log('Incoming task:', task);
      setIncomingTasks(prevTasks => [...prevTasks, task]);
      playNotificationSound();
    });

    return () => {
      store.setIncomingTaskCb(undefined);
    };
  }, []);

  const handleInitialize = () => {
    const webexConfig = {
      fedramp: false,
      logger: {
        level: 'info',
      },
      cc: {
        allowMultiLogin: true,
      },
    };
    store.init({ webexConfig, access_token: accessToken }).then(() => {
      setIsInitialized(true);
      window.store = store;
    });
  };

  const onLogin = () => {
    setIsLoggedIn(true);
    console.log('Agent login successful');
  };

  const onLogout = () => {
    setIsLoggedIn(false);
    console.log('Agent logout successful');
  };

  const onCCSignOut = () => {
    setIsLoggedIn(false);
    setIncomingTasks([]);
    console.log('CC Sign out successful');
  };

   const stationLogout = () => {
    store.cc.stationLogout({logoutReason: 'User requested logout'})
      .then((res) => {
        console.log('Agent logged out successfully', res.data.type);
      })
      .catch((error) => {
        console.log('Agent logout failed', error);
      });
  };

  const onStateChange = (status) => {
    console.log('Agent state changed:', status);
  };

  const onAccepted = (task) => {
    setIncomingTasks((prevTasks) => prevTasks.filter((t) => t.data.interactionId !== task.data.interactionId));
    console.log('onAccepted Invoked');
  };

  const onRejected = (task) => {
    setIncomingTasks((prevTasks) => prevTasks.filter((t) => t.data.interactionId !== task.data.interactionId));
    console.log('onRejected invoked');
  };

  const onTaskAccepted = (task) => {
    console.log('onTaskAccepted invoked for task:', task);
  };

  const onTaskDeclined = (task) => {
    console.log('onTaskDeclined invoked for task:', task);
  };

  const onTaskSelected = (task) => {
    console.log('onTaskSelected invoked for task:', task);
  };

  const onHoldResume = () => {
    console.log('Call hold/resume toggled');
  };

  const onEnd = () => {
    console.log('Call ended');
  };

  const onWrapUp = (params) => {
    console.log('Call wrap up:', params);
  };

  return (
    <ThemeProvider themeclass="mds-theme-stable-lightWebex">
      <IconProvider>
        <div className="App mds-typography">

        {isInitialized && isLoggedIn && (
          <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <UserState onStateChange={onStateChange} />
            <Button
              onClick={stationLogout}
              style={{
                backgroundColor: '#dc3545',
                color: 'white'
              }}
            >
              Logout
            </Button>
          </div>
        )}
        
        <div className="cc-widget-app">
          {!isInitialized ? (
            <div 
              className="initialization-form"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px',
                padding: '30px',
                backgroundColor: '#f5f5f5',
                borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>Initialize Widgets</h2>
              <input
                type="text"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                placeholder="Enter access token"
                style={{
                  width: '300px',
                  padding: '12px',
                  borderRadius: '25px',
                  border: '1px solid #ddd',
                  outline: 'none',
                  fontSize: '14px',
                  transition: 'all 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#0052cc'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
              <button
                onClick={handleInitialize}
                disabled={!accessToken}
                style={{
                  padding: '12px 24px',
                  borderRadius: '25px',
                  border: 'none',
                  backgroundColor: accessToken ? '#0052cc' : '#ccc',
                  color: 'white',
                  cursor: accessToken ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  transition: 'background-color 0.3s'
                }}
              >
                Signin
              </button>
            </div>
          ) : (
            <div>
              <StationLogin 
                onLogin={onLogin} 
                onLogout={onLogout} 
                onCCSignOut={onCCSignOut}
              />
              {isLoggedIn && (
                <>
                  <TaskList 
                    onTaskAccepted={onTaskAccepted}
                    onTaskDeclined={onTaskDeclined}
                    onTaskSelected={onTaskSelected}
                  />
                  {store.currentTask && (
                    <div>
                      <CallControlCAD onHoldResume={onHoldResume} onEnd={onEnd} onWrapUp={onWrapUp} />
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Incoming Task Container */}
        {incomingTasks.map(task => (
          <div
            key={task.data.interactionId}
            style={{ 
              position: 'absolute', 
              bottom: '20px', 
              right: '20px',
              zIndex: 1000
            }}
          >
            <IncomingTask
              incomingTask={task}
              isBrowser={isBrowser}
              onAccepted={() => onAccepted(task)}
              onRejected={() => onRejected(task)}
            />
          </div>
        ))}

        </div>
      </IconProvider>
    </ThemeProvider>
  );
}

export default observer(App);
