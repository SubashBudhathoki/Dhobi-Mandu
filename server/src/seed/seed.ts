import { GeoNodes, GeoJsonFeature } from "../utils/@types/index";
import * as geolib from "geolib";
import { readFileSync } from "fs";
import { prisma } from "../index";

async function seed() {
  try {
    const geoJsonFile = process.cwd() + "/data/map.geojson";

    const kathmandu = JSON.parse(readFileSync(geoJsonFile, "utf8"));

    const nodes: GeoNodes = {};
    console.log("READING DONE");
    console.log("STARTE PARSING ");

    // Convert the GeoJSON features to nodes
    for (const feature of kathmandu.features) {
      const geometry = feature as GeoJsonFeature;
      const { type, coordinates } = geometry.geometry;
      if (type === "LineString") {
        const distance = geolib.getPathLength(
          coordinates.map(([lng, lat]) => ({ lat, lng }))
        );
        const startLineStr = { lat: coordinates[0][1], lng: coordinates[0][0] };
        const endLineStr = {
          lat: coordinates[coordinates.length - 1][1],
          lng: coordinates[coordinates.length - 1][0],
        };
        const startLineStrId = `${startLineStr.lat},${startLineStr.lng}`;
        const endLineStrId = `${endLineStr.lat},${endLineStr.lng}`;
        if (!(startLineStrId in nodes)) {
          nodes[startLineStrId] = {
            id: startLineStrId,
            lat: startLineStr.lat,
            lng: startLineStr.lng,
            distance: Infinity,
            h_cost: Infinity,
            parent: "",
            neighbors: { parentId: startLineStrId, values: [] },
          };
        }
        if (!(endLineStrId in nodes)) {
          nodes[endLineStrId] = {
            id: endLineStrId,
            lat: endLineStr.lat,
            lng: endLineStr.lng,
            distance: Infinity,
            h_cost: Infinity,
            parent: "",
            neighbors: { parentId: endLineStrId, values: [] },
          };
        }
        nodes[startLineStrId].neighbors = {
          parentId: startLineStrId,
          values: [
            ...new Set([
              ...nodes[startLineStrId].neighbors.values,
              endLineStrId,
            ]),
          ],
        };
        nodes[endLineStrId].neighbors = {
          parentId: endLineStrId,
          values: [
            ...new Set([
              ...nodes[endLineStrId].neighbors.values,
              startLineStrId,
            ]),
          ],
        };
        nodes[startLineStrId].distance =
          Math.min(nodes[startLineStrId].distance, distance) || 0;
        nodes[endLineStrId].distance =
          Math.min(nodes[endLineStrId].distance, distance) || 0;
      }
    }

    console.log("PARSING DONE");

    // delete all existing data
    console.log("Delete NODES");

    await prisma.geoNbr.deleteMany();
    await prisma.geoNode.deleteMany();
    console.log("Delete Done");
    //
    // save to database

    const divLength = 1000;

    const allNodes = Object.values(nodes);
    const flatNbrs = Object.values(nodes)
      .map((node) => {
        return node.neighbors.values.map((nbr) => {
          return {
            geoNodeId: node.id,
            value: nbr,
          };
        });
      })
      .flat();
    // divide all nodes to chunks of divLength
    const nbrChunks = [];
    for (let i = 0; i < allNodes.length; i += divLength) {
      const chunk = allNodes.slice(i, i + divLength);
      await prisma.geoNode.createMany({
        data: chunk.map((node) => {
          return {
            lat: node.lat,
            lng: node.lng,
            distance: node.distance,
            parent: node.parent,
            id: node.id,
          };
        }),
      });
    }

    for (let i = 0; i < flatNbrs.length; i += divLength) {
      const chunk = flatNbrs.slice(i, i + divLength);
      nbrChunks.push(flatNbrs.slice(i, i + divLength));
      await prisma.geoNbr.createMany({
        data: chunk.map((nbr) => {
          return {
            geoNodeId: nbr.geoNodeId,
            value: nbr.value,
          };
        }),
      });
    }
    console.log("UPLOAD FINISHED");
  } catch (error) {
    console.error(error);
    console.log("UPLOAD ERROR");
  }
}

// Save
seed();
