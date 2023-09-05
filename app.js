const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeTheDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at port http:localhost:3000/");
    });
  } catch (error) {
    console.log(error.message);
    precess.exit(1);
  }
};

initializeTheDbAndServer();

// GET players API

module.exports = app.get("/players/", async (request, response) => {
  const sqlQuerry = `
    SELECT *
    FROM cricket_team;
    `;
  const playersArray = await db.all(sqlQuerry);
  const convertDbToResponse = (player) => {
    return {
      playerId: player.player_id,
      playerName: player.player_name,
      jerseyNumber: player.jersey_number,
      role: player.role,
    };
  };
  response.send(
    playersArray.map((eachPlayer) => convertDbToResponse(eachPlayer))
  );
});

// GET player API

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;

  const sqlPlayerQuerry = `
    SELECT *
    FROM cricket_team
    WHERE player_id = ${playerId};
    `;
  const playerArray = await db.get(sqlPlayerQuerry);
  const convertDbToResponse = (player) => {
    return {
      playerId: player.player_id,
      playerName: player.player_name,
      jerseyNumber: player.jersey_number,
      role: player.role,
    };
  };
  response.send(convertDbToResponse(playerArray));
});

// Create Player API

app.post("players", (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
});
