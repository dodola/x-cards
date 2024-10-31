import React, { useState, useEffect } from "react";
import { Storage } from "@plasmohq/storage";

const Options = () => {
  const [apiToken, setApiToken] = useState("");
  const [databaseId, setDatabaseId] = useState("");
  const storage = new Storage()

  useEffect(() => {
    // Load saved settings
    const loadSettings = async () => {
      const savedApiToken = await storage.get("apiToken");
      const savedDatabaseId = await storage.get("databaseId");
      if (savedApiToken) setApiToken(savedApiToken);
      if (savedDatabaseId) setDatabaseId(savedDatabaseId);
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    await storage.set("apiToken", apiToken);
    await storage.set("databaseId", databaseId);
    alert("Settings saved!");
  };

  return (
    <div>
      <h1>Plugin Configuration</h1>
      <div>
        <label>
          API Token:
          <input
            type="text"
            value={apiToken}
            onChange={(e) => setApiToken(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Database ID:
          <input
            type="text"
            value={databaseId}
            onChange={(e) => setDatabaseId(e.target.value)}
          />
        </label>
      </div>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default Options;