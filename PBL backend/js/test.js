// Get the drawing area element
let blocks = document.querySelector(".drawing-area");

// Initialize the addEdge variable to false
let addEdge = false;

// Initialize the node counter to 0
let cnt = 0;

// Initialize the distance array to undefined
let dist;

// Check if the alerted variable is set to "yes" in local storage
let alerted = localStorage.getItem("alerted") || "";

// If alerted is not set to "yes", show an alert and set it to "yes"
if (alerted !== "yes") {
  alert(
    "Read instructions before proceeding by clicking i-icon in the top-right corner"
  );
  localStorage.setItem("alerted", "yes");
}

// Function to enable adding edges
const addEdges = () => {
  // If the number of nodes is less than 2, show an alert and return
  if (cnt < 2) {
    alert("Create at least two nodes to add an edge");
    return;
  }

  // Set addEdge to true
  addEdge = true;

  // Disable the add-edge-enable button
  document.getElementById("add-edge-enable").disabled = true;

  // Enable the run-btn button
  document.querySelector(".run-btn").disabled = false;

  // Initialize the distance array for adjacency matrix representation
  dist = new Array(cnt + 1)
    .fill(Infinity)
    .map(() => new Array(cnt + 1).fill(Infinity));
};

// Temporary array to store clicked elements to make an edge between (max size = 2)
let arr = [];

// Function to append a block (node) to the drawing area
const appendBlock = (x, y) => {
  // Enable the reset-btn button
  document.querySelector(".reset-btn").disabled = false;

  // Hide the click-instruction paragraph
  document.querySelector(".click-instruction").style.display = "none";

  // Create a new block (node) element
  const block = document.createElement("div");

  // Add the block class to the block element
  block.classList.add("block");

  // Set the top and left styles of the block element
  block.style.top = `${y}px`;
  block.style.left = `${x}px`;

  // Set the transform style of the block element
  block.style.transform = `translate(-50%,-50%)`;

  // Set the id of the block element to the current node counter value
  block.id = cnt;

  // Set the text content of the block element to the current node counter value
  block.innerText = cnt++;

  // Add a click event listener to the block element
  block.addEventListener("click", (e) => {
    // Prevent node upon node
    e.stopPropagation() || (window.event.cancelBubble = "true");

    // If addEdge is false, return
    if (!addEdge) return;

    // Set the background color of the block element to coral
    block.style.backgroundColor = "coral";

    // Push the id of the block element to the arr array
    arr.push(block.id);

    // If the length of the arr array is 2, draw an edge and empty the arr array
    if (arr.length === 2) {
      drawUsingId(arr);
      arr = [];
    }
  });

  // Append the block element to the blocks element
  blocks.appendChild(block);
};

// Add a click event listener to the blocks element
blocks.addEventListener("click", (e) => {
  // If addEdge is true, return
  if (addEdge) return;

  // If the number of nodes is greater than 12, show analert and return
  if (cnt > 12) {
    alert("cannot add more than 12 vertices");
    return;
  }

  // Log the x and y coordinates of the click event
  console.log(e.x, e.y);

  // Call the appendBlock function with the x and y coordinates of the click event
  appendBlock(e.x, e.y);
});

// Function to draw a line between nodes
const drawLine = (x1, y1, x2, y2, ar) => {
  // Prevent multiple edges for the same pair of nodes
  if (dist[Number(ar[0])][Number(ar[1])] !== Infinity) {
    document.getElementById(arr[0]).style.backgroundColor = "#333";
    document.getElementById(arr[1]).style.backgroundColor = "#333";
    return;
  }

  // Calculate the length of the line
  const len = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);

  // Calculate the slope of the line
  const slope = x2 - x1 ? (y2 - y1) / (x2 - x1) : y2 > y1 ? 90 : -90;

  // Add the length to the distance array
  dist[Number(ar[0])][Number(ar[1])] = Math.round(len / 10);
  dist[Number(ar[1])][Number(ar[0])] = Math.round(len / 10);

  // Create a new line element
  const line = document.createElement("div");

  // Set the id of the line element
  line.id =
    Number(ar[0]) < Number(ar[1])
      ? `line-${ar[0]}-${ar[1]}`
      : `line-${ar[1]}-${ar[0]}`;

  // Add the line class to the line element
  line.classList.add("line");

  // Set the width, left, top, and transform styles of the line element
  line.style.width = `${len}px`;
  line.style.left = `${x1}px`;
  line.style.top = `${y1}px`;
  line.style.transform = `rotate(${
    x1 > x2 ? Math.PI + Math.atan(slope) : Math.atan(slope)
  }rad)`;

  // Create a new p element
  let p = document.createElement("p");

  // Add the edge-weight class to the p element
  p.classList.add("edge-weight");

  // Set the text content of the p element to the length of the line
  p.innerText = Math.round(len / 10);

  // Add a blur event listener to the p element
  p.addEventListener("blur", (e) => {
    // If the text content of the p element is not a number, show an alert and return
    if (isNaN(Number(e.target.innerText))) {
      alert("Enter a valid edge weight");
      return;
    }

    // Get the node IDs from the id of the line element
    n1 = Number(p.closest(".line").id.split("-")[1]);
    n2 = Number(p.closest(".line").id.split("-")[2]);

    // Update the distance array with the new edge weight
    dist[n1][n2] = Number(e.target.innerText);
    dist[n2][n1] = Number(e.target.innerText);
  });

  // Set the transform style of the p element
  p.style.transform = `rotate(${
    x1 > x2 ? (Math.PI + Math.atan(slope)) * -1 : Math.atan(slope) * -1
  }rad)`;

  // Append the p element to the line element
  line.append(p);

  // Append the line element to the blocks element
  blocks.appendChild(line);

  // Set the background color of the nodes to #333
  document.getElementById(arr[0]).style.backgroundColor = "#333";
  document.getElementById(arr[1]).style.backgroundColor = "#333";
};

// Function to get (x, y) coordinates of clicked node
const drawUsingId = (ar) => {
  if (ar[0] === ar[1]) {
    document.getElementById(arr[0]).style.backgroundColor = "#333";
    arr = [];
    return;
  }
  x1 = Number(document.getElementById(ar[0]).style.left.slice(0, -2));
  y1 = Number(document.getElementById(ar[0]).style.top.slice(0, -2));
  x2 = Number(document.getElementById(ar[1]).style.left.slice(0, -2));
  y2 = Number(document.getElementById(ar[1]).style.top.slice(0, -2));
  drawLine(x1, y1, x2, y2, ar);
};

// Function to undo the last action
const undo = () => {
  // If the number of nodes is 0, return
  if (cnt === 0) return;

  // Get the last block element
  const lastBlock = document.getElementById(`${cnt - 1}`);

  // Remove the last block element from the blocks element
  blocks.removeChild(lastBlock);

  // Decrement the node counter
  cnt--;

  // If the number of nodes is greater than 1, enable the add-edge-enable button
  if (cnt > 1) {
    document.getElementById("add-edge-enable").disabled = false;
  }

  // If the number of nodes is greater than 0, enable the reset-btn button
  if (cnt > 0) {
    document.querySelector(".reset-btn").disabled = false;
  }

  // If the number of nodes is greater than 1, enable the run-btn button
  if (cnt > 1) {
    document.querySelector(".run-btn").disabled = false;
  }
};

// Add an undo button
const undoBtn = document.createElement("button");
undoBtn.innerText = "Undo";
undoBtn.addEventListener("click", undo);
document.body.appendChild(undoBtn);

// Add a click event listener to the blocks element
blocks.addEventListener("click", (e) => {
  // If addEdge is true, return
  if (addEdge) return;

  // If the number of nodes is greater than 12, show an alert and return
  if (cnt > 12) {
    alert("cannot add more than 12 vertices");
    return;
  }

  // Log the x and y coordinates of the click event
  console.log(e.x, e.y);

  // Call the appendBlock function with the x and y coordinates of the click event
  appendBlock(e.x, e.y);
});

// Function to find the shortest path from the given source to all other nodes
const findShortestPath = (el) => {
  let visited = [];
  let unvisited = [];
  clearScreen();

  let source = Number(document.getElementById("source-node").value);
  if (source >= cnt || isNaN(source)) {
    alert("Invalid source");
    return;
  }
  document.getElementById(source).style.backgroundColor = "grey";
  let parent = [];
  parent[source] = -1;
  visited = [];
  for (let i = 0; i < cnt; i++) unvisited.push(i);

  // Array containing the cost of reaching the i(th) node from the source
  let cost = [];
  for (let i = 0; i < cnt; i++) {
    i === source
      ? null
      : dist[source][i]
      ? (cost[i] = dist[source][i])
      : (cost[i] = Infinity);
  }
  cost[source] = 0;

  // Array which will contain the final minimum cost
  let minCost = [];
  minCost[source] = 0;

  // Repeating until all edges are visited
  while (unvisited.length) {
    let mini = cost.indexOf(Math.min(...cost));
    visited.push(mini);
    unvisited.splice(unvisited.indexOf(mini), 1);

    // Relaxation of unvisited edges
    for (let j of unvisited) {
      if (j === mini) continue;
      if (cost[j] > dist[mini][j] + cost[mini]) {
        minCost[j] = dist[mini][j] + cost[mini];
        cost[j] = dist[mini][j] + cost[mini];
        parent[j] = mini;
      } else {
        minCost[j] = cost[j];
      }
    }
    cost[mini] = Infinity;
  }
  console.log("Minimum Cost", minCost);
  for (let i = 0; i < cnt; i++)
    parent[i] === undefined ? (parent[i] = source) : null;
  indicatePath(parent, source);
};

const indicatePath = async (parentArr, src) => {
  document.querySelector(".path").innerHTML = "";
  for (let i = 0; i < cnt; i++) {
    let p = document.createElement("p");
    p.innerText = "Node " + i + " --> " + src;
    await printPath(parentArr, i, p);
  }
};

const printPath = async (parent, j, el_p) => {
  if (parent[j] === -1) return;
  await printPath(parent, parent[j], el_p);
  el_p.innerText = el_p.innerText + " " + j;

  document.querySelector(".path").style.padding = "1rem";
  document.querySelector(".path").appendChild(el_p);

  if (j < parent[j]) {
    let tmp = document.getElementById(`line-${j}-${parent[j]}`);
    await colorEdge(tmp);
  } else {
    let tmp = document.getElementById(`line-${parent[j]}-${j}`);
    await colorEdge(tmp);
  }
};

const colorEdge = async (el) => {
  if (el.style.backgroundColor !== "aqua") {
    await wait(1000);
    el.style.backgroundColor = "aqua";
    el.style.height = "8px";
  }
};

const clearScreen = () => {
  document.querySelector(".path").innerHTML = "";
  let lines = document.querySelectorAll(".line");
  lines.forEach((line) => {
    line.style.backgroundColor = "#EEE";
    line.style.height = "5px";
  });
};
constresetDrawingArea = () => {
  blocks.innerHTML = "";

  const p = document.createElement("p");
  p.classList.add("click-instruction");
  p.innerHTML = "Click to create node";

  blocks.appendChild(p);
  document.getElementById("add-edge-enable").disabled = false;
  document.querySelector(".reset-btn").disabled = true;
  document.querySelector(".path").innerHTML = "";

  cnt = 0;
  dist = [];
  addEdge = false;
};

const wait = async (t) => {
  let pr = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("done!");
    }, t);
  });
  res = await pr;
};
