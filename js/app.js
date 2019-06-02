let sourceSelect = false;
let destinationSelect = false;
let sourceElement;
let destinationElement;
let directCost = 10;
let diagonalCost = 14;
let coordinatesArr = [];
let nodeProcessed = false;

// create grid container element
const gridContainer = document.createElement("div");
gridContainer.classList.add("grid-container");

// display the initial alert.
function displayIntialAlert() {
  const initialAlert = document.createElement("div");
  initialAlert.classList.add("alert");
  initialAlert.classList.add("alert-danger");
  initialAlert.classList.add("text-center");
  initialAlert.classList.add("initial-alert");

  const alertText = document.createTextNode("Please Select Source (S)");

  initialAlert.appendChild(alertText);

  const alertContainer = document.querySelector(".alert-container");
  alertContainer.appendChild(initialAlert);
}

displayIntialAlert();

genrateGrids();

// genrate grids
function genrateGrids() {
  let id = 0;
  for (var i = 0; i < 7; i++) {
    for (var j = 0; j < 7; j++) {
      id++;
      // create grid element
      const grid = document.createElement("div");
      grid.classList.add("grid-item");

      grid.setAttribute("id", id);

      createHueristicCost(grid);
      createFinalCost(grid);
      createComputedCost(grid);

      let coordinate = { id: id, x: i + 1, y: j + 1, cost: 0 };
      coordinatesArr.push(coordinate);

      // append grid to grid container.
      gridContainer.appendChild(grid);
    }
  }
}

// create hueristic element and append it to the grid.
function createHueristicCost(grid) {
  const hueristic = document.createElement("span");
  hueristic.classList.add("hueristic-cost");
  const hueristicCost = document.createTextNode("");
  hueristic.appendChild(hueristicCost);
  grid.appendChild(hueristic);
}

// create computed element and append it to grid.
function createComputedCost(grid) {
  const computed = document.createElement("span");
  computed.classList.add("computed-cost");
  const computedCost = document.createTextNode("");
  computed.appendChild(computedCost);
  grid.appendChild(computed);
}

// create final function element and append it to grid.
function createFinalCost(grid) {
  const final = document.createElement("span");
  final.classList.add("final-cost");
  const finalCost = document.createTextNode("");
  final.appendChild(finalCost);
  grid.appendChild(final);
}

const wrapper = document.getElementById("wrapper");

wrapper.appendChild(gridContainer);

wrapper.addEventListener("click", AddSourceAndDest);

// this function adds source and destination nodes on the click event
function AddSourceAndDest(e) {
  if (sourceSelect === false && destinationSelect === false) {
    const centerText = e.target.querySelector(".final-cost");
    sourceElement = centerText.parentNode;
    const sourceText = document.createTextNode("S");
    centerText.appendChild(sourceText);

    const alertText = document.querySelector(".initial-alert");
    alertText.textContent = "Please Select Destination Node (D)";
    sourceSelect = true;
  } else if (
    sourceSelect === true &&
    destinationSelect === false &&
    e.target !== sourceElement
  ) {
    const centerText = e.target.querySelector(".final-cost");
    destinationElement = centerText.parentNode;
    const sourceText = document.createTextNode("D");
    centerText.appendChild(sourceText);
    const alertText = document.querySelector(".initial-alert");
    alertText.textContent = "Click on Source(S) to expand Possibilties.";
    destinationSelect = true;
  } else if (
    sourceSelect === true &&
    destinationSelect === true &&
    e.target.id == sourceElement.id
  ) {
    sourceElement.addEventListener(
      "click",
      computeAdjcentNode(sourceElement.id)
    );
  }
}

// this function computes the adjcent nodes of the current node.
function computeAdjcentNode(id) {
  let coordinates = {};
  let possibleAdjcentList = [];
  let adjcentNodeData = [];
  coordinates = getCoordinates(id);
  nodeProcessed = false;

  possibleAdjcentList.push({
    x: coordinates.x - 1,
    y: coordinates.y,
    cost: coordinates.cost
  });
  possibleAdjcentList.push({
    x: coordinates.x,
    y: coordinates.y - 1,
    cost: coordinates.cost
  });
  possibleAdjcentList.push({
    x: coordinates.x + 1,
    y: coordinates.y,
    cost: coordinates.cost
  });
  possibleAdjcentList.push({
    x: coordinates.x,
    y: coordinates.y + 1,
    cost: coordinates.cost
  });
  possibleAdjcentList.push({
    x: coordinates.x - 1,
    y: coordinates.y - 1,
    cost: coordinates.cost
  });
  possibleAdjcentList.push({
    x: coordinates.x + 1,
    y: coordinates.y - 1,
    cost: coordinates.cost
  });
  possibleAdjcentList.push({
    x: coordinates.x - 1,
    y: coordinates.y + 1,
    cost: coordinates.cost
  });
  possibleAdjcentList.push({
    x: coordinates.x + 1,
    y: coordinates.y + 1,
    cost: coordinates.cost
  });

  adjcentNodeData = getAdjcent(possibleAdjcentList);

  for (let i = 0; i < adjcentNodeData.length; i++) {
    let currentAdjcent = document.getElementById(String(adjcentNodeData[i].id));
    currentAdjcent.classList.add("adjcent-node");
    let hueristic = computeHueristicCost(adjcentNodeData[i].id);
    currentAdjcent.querySelector(".hueristic-cost").textContent = hueristic;
    let computedCost = computedDistFromSource(
      adjcentNodeData[i].id,
      coordinates.x,
      coordinates.y
    );

    currentAdjcent.querySelector(".computed-cost").textContent = computedCost;

    let finalCost = hueristic + computedCost;

    currentAdjcent.querySelector(".final-cost").textContent = finalCost;
  }
  nodeProcessed = true;

  addEventsToAdjcent(nodeProcessed);
}

function addEventsToAdjcent(nodeProcessed) {
  if (nodeProcessed == true) {
    let adjcentNodeList = document.querySelectorAll(".adjcent-node");
    for (let i = 0; i < adjcentNodeList.length; i++) {
      adjcentNodeList[i].addEventListener(
        "click",
        handleAdjcentClick(adjcentNodeList[i].id)
      );
    }
  }
}

function handleAdjcentClick(id) {
  let gridItems = document.querySelectorAll(".grid-item");
  for (let i = 0; i < gridItems.length; i++) {
    let finalCostSpan = gridItems[i].querySelector(".final-cost");
    if (
      finalCostSpan.textContent !== "S" &&
      finalCostSpan.textContent !== "D"
    ) {
      gridItems[i].querySelector(".final-cost").textContent = "";
      gridItems[i].querySelector(".computed-cost").textContent = "";
      gridItems[i].querySelector(".hueristic-cost").textContent = "";
      // gridItems[i].classList.remove("adjcent-node");
    }
  }
}

function computeNewAdjcentNode(id) {
  console.log(id);
}

function computedDistFromSource(id, x, y) {
  for (let i = 0; i < coordinatesArr.length; i++) {
    if (id == coordinatesArr[i].id) {
      if (
        (coordinatesArr[i].x == x + 1 && coordinatesArr[i].y == y + 1) ||
        (coordinatesArr[i].x == x - 1 && coordinatesArr[i].y == y + 1) ||
        (coordinatesArr[i].x == x + 1 && coordinatesArr[i].y == y - 1) ||
        (coordinatesArr[i].x == x - 1 && coordinatesArr[i].y == y - 1)
      ) {
        coordinatesArr[i].cost = 14;
      } else {
        coordinatesArr[i].cost = 10;
      }

      return coordinatesArr[i].cost;
    }
  }
}

function getCoordinates(id) {
  let coordinate;
  for (let i = 0; i < coordinatesArr.length; i++) {
    if (id == coordinatesArr[i].id) {
      coordinate = {
        x: coordinatesArr[i].x,
        y: coordinatesArr[i].y,
        cost: coordinatesArr[i].cost
      };
      break;
    }
  }

  return coordinate;
}

function getAdjcent(possibleAdjcentList) {
  let adjcent = [];

  for (let i = 0; i < coordinatesArr.length; i++) {
    for (let j = 0; j < possibleAdjcentList.length; j++) {
      if (
        possibleAdjcentList[j].x == coordinatesArr[i].x &&
        possibleAdjcentList[j].y == coordinatesArr[i].y
      ) {
        adjcent.push({
          x: coordinatesArr[i].x,
          y: coordinatesArr[i].y,
          id: coordinatesArr[i].id,
          cost: coordinatesArr[i].cost
        });
      }
    }
  }

  return adjcent;
}

function computeFinalCost() {
  let hueristicDistance;
  hueristicDistance = computeHueristicCost();
}

function computeHueristicCost(id) {
  let hueristicDistance;
  let minofdxdy;
  let maxofdxdy;
  let coordinates = getCoordinates(id);
  let SandDCoordinates = computeSandDCoordinates();

  let dx = Math.abs(SandDCoordinates.destination.x - coordinates.x);
  let dy = Math.abs(SandDCoordinates.destination.y - coordinates.y);
  if (dx == 0 || dy == 0) {
    hueristicDistance = (dx + dy) * directCost;
  } else {
    minofdxdy = calculateMin(dx, dy);
    maxofdxdy = calculateMax(dx, dy);
    hueristicDistance =
      minofdxdy * diagonalCost + (maxofdxdy - minofdxdy) * directCost;
  }
  return hueristicDistance;
}

// calculate minimum of the two numbers.
function calculateMin(dx, dy) {
  if (dx >= dy) {
    return dy;
  } else {
    return dx;
  }
}

// calculate maximum of the two numbers
function calculateMax(dx, dy) {
  if (dx >= dy) {
    return dx;
  } else {
    return dy;
  }
}

function computeSandDCoordinates() {
  let sourceCoordinate = {};
  let destinationCoordinate = {};

  for (var i = 0; i < coordinatesArr.length; i++) {
    if (sourceElement.id == coordinatesArr[i].id) {
      sourceCoordinate = { x: coordinatesArr[i].x, y: coordinatesArr[i].y };
    }

    if (destinationElement.id == coordinatesArr[i].id) {
      destinationCoordinate = {
        x: coordinatesArr[i].x,
        y: coordinatesArr[i].y
      };
    }
  }

  let coordinates = {
    source: sourceCoordinate,
    destination: destinationCoordinate
  };

  return coordinates;
}
