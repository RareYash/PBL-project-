let blocks = document.querySelector(".drawing-area");
let addEdge = false;
let cnt = 0;
let dist;
let lines = []; // Array to store lines

let alerted = localStorage.getItem("alerted") || "";
if (alerted !== "yes") {
  alert(
    "Read instructions before proceeding by clicking i-icon in the top-right corner"
  );
  localStorage.setItem("alerted", "yes");
}

// It is called when user starts adding edges by clicking on button given
const addEdges = () => {
  if (cnt < 2) {
    alert("Create at least two nodes to add an edge");
    return;
  }

  addEdge = true;
  document.getElementById("add-edge-enable").disabled = true;
  document.querySelector(".run-btn").disabled = false;
  document.querySelector(".undo-btn").disabled = false;
  document.querySelector(".undo-edge-btn").disabled = false;
  // Initializing array for adjacency matrix representation
  dist = new Array(cnt + 1)
    .fill(Infinity)
    .map(() => new Array(cnt + 1).fill(Infinity));
};

// Temporary array to store clicked elements to make an edge between (max size = 2)
let arr = [];

const appendBlock = (x, y) => {
  document.querySelector(".reset-btn").disabled = false;
  document.querySelector(".undo-btn").disabled = false;
  document.querySelector(".undo-edge-btn").disabled = true;
  document.querySelector(".click-instruction").style.display = "none";
  // Creating a node
  const block = document.createElement("div");
  block.classList.add("block");
  block.style.top = `${y}px`;
  block.style.left = `${x}px`;
  block.style.transform = `translate(-50%,-50%)`;
  block.id = cnt;

  block.innerText = cnt++;

  // Click event for node
  block.addEventListener("click", (e) => {
    // Prevent node upon node
    e.stopPropagation() || (window.event.cancelBubble = "true");

    // If state variable addEdge is false, can't start adding edges
    if (!addEdge) return;

    block.style.backgroundColor = "coral";
    arr.push(block.id);

    // When two elements are pushed, draw an edge and empty the array
    if (arr.length === 2) {
      drawUsingId(arr);
      arr = [];
    }
  });
  blocks.appendChild(block);
};

// Allow creating nodes on screen by clicking
blocks.addEventListener("click", (e) => {
  if (addEdge) return;
  if (cnt > 20) {
    alert("cannot add more than 20 vertices");
    return;
  }
  console.log(e.x, e.y);
  appendBlock(e.x, e.y);
});

// Function to draw a line between nodes
const drawLine = (x1, y1, x2, y2, ar) => {
  // prevent multiple edges for the same pair of nodes
  if (dist[Number(ar[0])][Number(ar[1])] !== Infinity) {
    document.getElementById(ar[0]).style.backgroundColor = "#333";
    document.getElementById(ar[1]).style.backgroundColor = "#333";
    return;
  }

  // Length of line
  const len = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
  const slope = x2 - x1 ? (y2 - y1) / (x2 - x1) : y2 > y1 ? 90 : -90;

  // Adding length to distance array
  dist[Number(ar[0])][Number(ar[1])] = Math.round(len / 10);
  dist[Number(ar[1])][Number(ar[0])] = Math.round(len / 10);

  // Drawing line
  const line = document.createElement("div");
  line.id =
    Number(ar[0]) < Number(ar[1])
      ? `line-${ar[0]}-${ar[1]}`
      : `line-${ar[1]}-${ar[0]}`;
  line.classList.add("line");
  line.style.width = `${len}px`;
  line.style.left = `${x1}px`;
  line.style.top = `${y1}px`;

  // Edge weight
  let p = document.createElement("p");
  p.classList.add("edge-weight");
  p.innerText = Math.round(len / 10);
  p.contentEditable = "true";
  p.inputMode = "numeric";
  p.addEventListener("blur", (e) => {
    if (isNaN(Number(e.target.innerText))) {
      alert("Enter a valid edge weight");
      return;
    }
    n1 = Number(p.closest(".line").id.split("-")[1]);
    n2 = Number(p.closest(".line").id.split("-")[2]);
    dist[n1][n2] = Number(e.target.innerText);
    dist[n2][n1] = Number(e.target.innerText);
  });
  line.style.transform = `rotate(${
    x1 > x2 ? Math.PI + Math.atan(slope) : Math.atan(slope)
  }rad)`;

  p.style.transform = `rotate(${
    x1 > x2 ? (Math.PI + Math.atan(slope)) * -1 : Math.atan(slope) * -1
  }rad)`;

  line.append(p);
  blocks.appendChild(line);
  document.getElementById(ar[0]).style.backgroundColor = "#333";
  document.getElementById(ar[1]).style.backgroundColor = "#333";

  // Push the line to lines array
  lines.push(line);
};

// Function to get (x, y) coordinates of clicked node
const drawUsingId = (ar) => {
  if (ar[0] === ar[1]) {
    document.getElementById(ar[0]).style.backgroundColor = "#333";
    arr = [];
    return;
  }
  x1 = Number(document.getElementById(ar[0]).style.left.slice(0, -2));
  y1 = Number(document.getElementById(ar[0]).style.top.slice(0, -2));
  x2 = Number(document.getElementById(ar[1]).style.left.slice(0, -2));
  y2 = Number(document.getElementById(ar[1]).style.top.slice(0, -2));
  drawLine(x1, y1, x2, y2, ar);
};

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

const resetDrawingArea = () => {
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

// Function to undo the last edge
const undoEdge = () => {
  if (lines.length === 0) {
    alert("No edges to undo");
    return;
  }

  // Remove the last line from the DOM and the lines array
  const lastLine = lines.pop();
  lastLine.remove();

  // Reset the distance in the adjacency matrix
  const ids = lastLine.id.split("-");
  dist[Number(ids[1])][Number(ids[2])] = Infinity;
  dist[Number(ids[2])][Number(ids[1])] = Infinity;

  // Reset the color of the nodes
  document.getElementById(ids[1]).style.backgroundColor = "#333";
  document.getElementById(ids[2]).style.backgroundColor = "#333";
};

// Add event listener to the undo edge button
document.querySelector(".undo-edge-btn").addEventListener("click", undoEdge);
