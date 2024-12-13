"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";

const CreatepreferencesPage = () => {
  const [user_id, setuser_id] = useState<string>("");
  const [preferences, setpreferences] = useState<string[]>([""]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  // Handler to add a new interest field
  const handleAddInterest = () => {
    setpreferences([...preferences, ""]);
  };

  // Handler to remove an interest field
  const handleRemoveInterest = (index: number) => {
    setpreferences(preferences.filter((_, i) => i !== index));
  };

  // Handler to update an interest value
  const handleInterestChange = (index: number, value: string) => {
    const updatedpreferences = [...preferences];
    updatedpreferences[index] = value;
    setpreferences(updatedpreferences);
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user_id.trim() || preferences.some((interest) => !interest.trim())) {
      setResponseMessage("Please fill in all fields before submitting.");
      return;
    }

    const payload = { user_id, preferences };
    setResponseMessage(null);

    try {
      const response = await fetch("http://localhost:8000/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        setResponseMessage("preferences successfully created!");
        setuser_id("");
        setpreferences([""]);
      } else {
        setResponseMessage("Failed to create preferences. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setResponseMessage("An error occurred. Please try again.");
    } finally {
    }
  };
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col items-center justify-center m-auto">
        <h1 className="text-2xl font-bold mb-4">Create preferences</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="font-medium">User ID:</label>
            <input
              type="text"
              value={user_id}
              onChange={(e) => setuser_id(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-md"
              placeholder="123"
            />
          </div>

          {/* preferences Input Fields */}
          <div className="space-y-2">
            <label className="font-medium">preferences:</label>
            {preferences.map((interest, index) => (
              <div key={index} className="flex items-center space-x-4">
                <input
                  type="text"
                  value={interest}
                  onChange={(e) => handleInterestChange(index, e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-md"
                  placeholder={`Interest ${index + 1}`}
                />
                {preferences.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveInterest(index)}
                    className="p-2 text-red-500"
                  >
                    -
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddInterest}
              className="p-2 text-blue-500"
            >
              +
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatepreferencesPage;
