"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";

interface Interest {
  _id: string;
  user: string;
  createdAt: string;
  updatedAt: string;
  recommendations: [string];
}

const GetInterestsPage = () => {
  const [userId, setUserId] = useState("");
  const [interests, setInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInterests = async (id: string) => {
    setLoading(true); // Set loading to true to indicate that the request is in progress

    try {
      // Make the API request with the userId in the URL
      const response = await fetch(
        `http://localhost:8000/users/${id}/recommendations`,
        {
          method: "GET", // Use GET since we're fetching data (you can change this if your server expects POST)
          headers: {
            "Content-Type": "application/json", // Indicate that we're expecting JSON
          },
        }
      );

      if (response.ok) {
        // If the response is successful (status 200-299)
        const result = await response.json(); // Parse the JSON response from the server
        setInterests(result.recommendations || []); // Assuming the server sends a field called "recommendations"
      } else {
        // If there's an error response (non-2xx status)
        console.error("Failed to fetch recommendations:", response.statusText);
        setInterests([]); // Set empty interests in case of failure
      }
    } catch (error) {
      // Handle any errors (network issues, etc.)
      console.error("Error submitting request:", error);
      setInterests([]); // Set empty interests in case of failure
    } finally {
      setLoading(false); // Stop the loading indicator when the request is done
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim()) return;
    fetchInterests(userId);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col items-center justify-center w-full">
        <h1 className="text-2xl font-bold mb-4">Get Interests</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="font-medium">User ID:</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-md"
              placeholder="123"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Fetch Interests
          </button>
        </form>

        <div className="w-1/2 mt-6">
          {loading ? (
            <p className="text-blue-500">Loading...</p>
          ) : interests.length > 0 ? (
            <ul className="space-y-2">
              {interests.map(
                (interest) =>
                  interest.recommendations.length > 0 && (
                    <li
                      key={interest._id}
                      className="p-2 border border-gray-300 rounded-md w-full"
                    >
                      {interest.recommendations.map((recommendation, idx) => (
                        <p key={idx}>{recommendation}</p>
                      ))}
                    </li>
                  )
              )}
            </ul>
          ) : (
            <p className="text-gray-500">No interests found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GetInterestsPage;
