import PriorityQueue from "./PriorityQueue";
// export async function AStar(origin: string, destination: string) {
//   //   //   google eyword is injected to HTML file from google map api. So we can use google keyword globally
//   const geoCoder = new google.maps.Geocoder();

//   const originResult = await geoCoder.geocode({ address: origin });
//   const originLatLng = originResult.results[0].geometry.location;

//   const destinationResult = await geoCoder.geocode({ address: destination });
//   const destinationLatLng = destinationResult.results[0].geometry.location;

//   const distances = new Map<string, number>();

//   function heuristic(node: google.maps.LatLng) {
//     return google.maps.geometry.spherical.computeDistanceBetween(
//       node,
//       destinationLatLng
//     );
//   }

//   function distance(nodeA: google.maps.LatLng, nodeB: google.maps.LatLng) {
//     const key = `${nodeA.toString()},${nodeB.toString()}`;

//     if (distances.has(key)) {
//       return distances.get(key);
//     }

//     const dist = google.maps.geometry.spherical.computeDistanceBetween(
//       nodeA,
//       nodeB
//     );
//     distances.set(key, dist);

//     return dist;
//   }

//   function shortestPath(start: google.maps.LatLng, goal: google.maps.LatLng) {
//     const frontier = new PriorityQueue<google.maps.LatLng>();
//     frontier.enqueue(start, 0);
//     const cameFrom = new Map<string, string>();
//     const costSoFar = new Map<string, number>();

//     cameFrom.set(start.toString(), start.toString());
//     costSoFar.set(start.toString(), 0);

//     while (!frontier.isEmpty()) {
//       const current = frontier.dequeue();

//       if (current.equals(goal)) {
//         break;
//       }

//       const neighbors = [
//         new google.maps.LatLng(current.lat() + 1, current.lng()),
//         new google.maps.LatLng(current.lat() - 1, current.lng()),
//         new google.maps.LatLng(current.lat(), current.lng() + 1),
//         new google.maps.LatLng(current.lat(), current.lng() - 1),
//       ];

//       for (const neighbor of neighbors) {
//         const newCost =
//           costSoFar.get(current.toString()) + distance(current, neighbor);

//         if (
//           !costSoFar.has(neighbor.toString()) ||
//           newCost < costSoFar.get(neighbor.toString())
//         ) {
//           costSoFar.set(neighbor.toString(), newCost);
//           const priority = newCost + heuristic(neighbor);
//           frontier.enqueue(neighbor, priority);
//           cameFrom.set(neighbor.toString(), current);
//         }
//       }
//     }
//   }

//   shortestPath(originLatLng, destinationLatLng);

//   return [];
// }

export async function AStar(
  origin: string,
  destination: string
): Promise<google.maps.DirectionsWaypoint[]> {
  const geocoder = new google.maps.Geocoder();

  const originResult = await geocoder.geocode({ address: origin });
  const originLatLng = originResult.results[0].geometry.location;

  const destinationResult = await geocoder.geocode({ address: destination });
  const destinationLatLng = destinationResult.results[0].geometry.location;

  const distances = new Map<string, number>();

  const heuristic = (node: google.maps.LatLng) => {
    return google.maps.geometry.spherical.computeDistanceBetween(
      node,
      destinationLatLng
    );
  };

  const distance = (nodeA: google.maps.LatLng, nodeB: google.maps.LatLng) => {
    const key = `${nodeA.toString()},${nodeB.toString()}`;

    if (distances.has(key)) {
      return distances.get(key)!;
    }

    const dist = google.maps.geometry.spherical.computeDistanceBetween(
      nodeA,
      nodeB
    );
    distances.set(key, dist);

    return dist;
  };

  const frontier = new PriorityQueue<[google.maps.LatLng, number]>();
  frontier.enqueue([originLatLng, 0], 0);

  const cameFrom = new Map<string, google.maps.LatLng | null>();
  const costSoFar = new Map<string, number>();
  cameFrom.set(originLatLng.toString(), null);
  costSoFar.set(originLatLng.toString(), 0);
  let i = 0;
  while (!frontier.isEmpty()) {
    const [current, _] = frontier.dequeue()!;
    if (current.equals(destinationLatLng)) {
      break;
    }

    console.log(
      i +
        ", (" +
        current.lat() +
        ", " +
        current.lng() +
        ") to (" +
        destinationLatLng.lat() +
        ", " +
        destinationLatLng.lng() +
        ")"
    );
    i++;

    const neighbors = [
      new google.maps.LatLng(current.lat() + 1, current.lng()),
      new google.maps.LatLng(current.lat() - 1, current.lng()),
      new google.maps.LatLng(current.lat(), current.lng() + 1),
      new google.maps.LatLng(current.lat(), current.lng() - 1),
    ];

    for (const neighbor of neighbors) {
      const newCost =
        costSoFar.get(current.toString())! + distance(current, neighbor);

      if (
        !costSoFar.has(neighbor.toString()) ||
        newCost < costSoFar.get(neighbor.toString())!
      ) {
        costSoFar.set(neighbor.toString(), newCost);
        const priority = newCost + heuristic(neighbor);
        frontier.enqueue([neighbor, priority], priority);
        cameFrom.set(neighbor.toString(), current);
      }
    }
  }

  const path: google.maps.LatLng[] = [];
  let current: google.maps.LatLng | null = destinationLatLng;
  while (current !== null) {
    path.push(current);
    current = cameFrom.get(current.toString()) || null;
  }
  path.reverse();

  const waypoints = path.map((node) => {
    return { location: node };
  });

  return waypoints;
}
