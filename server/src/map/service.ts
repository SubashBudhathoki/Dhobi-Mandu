import { LatLan } from "./../@types/index";
import { Pool, Client } from "node-postgres";

const pool = new Pool({
  user: "my_user",
  host: "localhost",
  database: "routing_db",
  password: "my_user",
  port: 6432,
});

function heuristic_haversine(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // metres
  const phi1 = (lat1 * Math.PI) / 180; // φ, λ in radians
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c; // in metres
  return d;
}

export default {
  aStarDb: async function (start: LatLan, end: LatLan) {
    const client = await pool.connect();
    const queryStr = `
    SELECT ST_AsGeoJSON(ST_Union((the_geom))) FROM ways WHERE gid in
    (SELECT edge FROM pgr_astar(
    'SELECT gid as id,
    source,
    target,
    length AS cost,
    x1, y1, x2, y2
    FROM ways',
    (SELECT id FROM ways_vertices_pgr
    ORDER BY the_geom <-> ST_SetSRID(ST_Point(${start.longitude}, ${start.latitude}), 4326) LIMIT 1), 
    (SELECT id FROM ways_vertices_pgr
    ORDER BY the_geom <-> ST_SetSRID(ST_Point(${end.longitude}, ${end.latitude}), 4326) LIMIT 1),
    directed := false) foo);
    `;

    const res = await client.query(queryStr);

    const result = res.rows[0].st_asgeojson;
    client.release();
    return JSON.parse(result);
  },

  getNodes: async function (coordinates: number[][]): Promise<any[]> {
    const nodes: any[] = [];
    for (const coordinate of coordinates) {
      const query =
        "SELECT id, ST_X(the_geom) AS lon, ST_Y(the_geom) AS lat FROM ways_vertices_pgr ORDER BY the_geom <-> ST_SetSRID(ST_MakePoint($1, $2), 4326) LIMIT 1";
      const values = [coordinate[0], coordinate[1]];
      const result = await pool.query(query, values);
      nodes.push(result.rows[0]);
    }
    return nodes;
  },

  getCoordinates: function (nodes: any[]): number[][] {
    const coordinates: number[][] = [];
    nodes.forEach((node) => {
      coordinates.push([node.lon, node.lat]);
    });
    return coordinates;
  },

  getNeighbors: async function (nodeId: number) {
    const query = `
    SELECT ways.id, ways.name, ways.source, ways.target, ways.the_geom
    FROM ways_vertices_pgr
    JOIN ways ON ways_vertices_pgr.edge = ways.id
    WHERE ways_vertices_pgr.id = $1
  `;
    const result = await pool.query(query, [nodeId]);

    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      source: row.source,
      target: row.target,
      geom: row.the_geom,
    }));
  },

  aStar: async function (start: LatLan, end: LatLan, db: boolean = true) {
    // Convert start and end coordinates to nodes
    if (!db) {
      const startArr = [start.longitude, start.latitude];
      const endArr = [end.longitude, end.latitude];
      const startNode = await this.getNodes([startArr]);
      const endNode = await this.getNodes([endArr]);

      const openList: any[] = [startNode];
      const closedList: any[] = [];
      // Initialize g-scores and f-scores
      const gScores: any = {};
      const fScores: any = {};
      gScores[startNode[0].id] = 0;
      fScores[startNode[0].id] = heuristic_haversine(
        start.latitude,
        start.longitude,
        end.latitude,
        end.longitude
      );

      while (openList.length > 0) {
        // Pop node with lowest f-score from open list
        openList.sort((a, b) => fScores[a.id] - fScores[b.id]);
        const currentNode = openList.shift();
        if (currentNode.id === endNode[0].id) {
          const path = currentNode;
          return this.getCoordinates(path);
        }
        closedList.push(currentNode);
        const neighbors = (await this.getNeighbors(currentNode.id)) as any;
        for (const neighbor of neighbors) {
          // Calculate tentative g-score
          const tentativeGScore =
            gScores[currentNode.id] +
            heuristic_haversine(
              currentNode.latitude,
              currentNode.longitude,
              neighbor.latitude,
              neighbor.longitude
            );

          // Check if neighbor is already in closed list with lower g-score
          if (
            closedList.some(
              (node) =>
                node.id === neighbor.id &&
                gScores[neighbor.id] <= tentativeGScore
            )
          ) {
            continue;
          }

          // Check if neighbor is not in open list or has lower g-score
          if (
            !openList.some((node) => node.id === neighbor.id) ||
            tentativeGScore < gScores[neighbor.id]
          ) {
            // Update g-score and f-score
            gScores[neighbor.id] = tentativeGScore;
            fScores[neighbor.id] =
              gScores[neighbor.id] +
              heuristic_haversine(
                neighbor.latitude,
                neighbor.longitude,
                endNode[0].latitude,
                endNode[0].longitude
              );

            // Set parent of neighbor
            neighbor.parent = currentNode;

            // Add neighbor to open list
            openList.push(neighbor);
          }
        }
      }
    }
    return await this.aStarDb(start, end);
  },
};
