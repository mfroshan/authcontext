import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from 'axios';
axios.withCredentials = true;
export const Secret = () => {
  const { logout, user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async (route) => {
    try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3001${route}`, {
          withCredentials: true,
        });

        console.log(response.data);
        setData(response.data);
    } catch (error) {
        setData('Error fetching data. Check console for details.');
        console.error(error);
    } finally {
        setLoading(false);
    }
};


  const handleLogout = () => {
    logout();
  };

  return (
    <div>
    <h1>This is a Secret page</h1>
    <button onClick={handleLogout}>Logout</button>
    <div>
        {user && (
            <div>
                <h2>{`${user} Dashboard`}</h2>
                <button onClick={() => fetchData(`/api/${user}/data`)}>
                    Fetch {user} Data
                </button>
            </div>
        )}

        <div>
            <h3>Fetched Data:</h3>
            {data}
        </div>
    </div>
</div>
);
};