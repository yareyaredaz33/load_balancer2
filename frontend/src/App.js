import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('welcome');
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/auth/users'); // Update the URL
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  return (
      <div className="App">
        <header className="App-header">
          {userData ? (
              <div>
                <h1>{`Hello ${userData.username}, welcome!`}</h1>
                {/* Render other user data as needed */}
              </div>
          ) : (
              <p>Loading...</p>
          )}
          <nav>
            {/* Your navigation menu */}
          </nav>
        </header>
      </div>
  );
}

export default App;
