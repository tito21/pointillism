
function poissonDiskSampling(radius, k) {
    N = 2;
    points = [];
    active = [];

    grid = [];
    celsize = radius / Math.sqrt(2);
    console.log(width, height);
    ncols = Math.ceil(width / celsize) + 1;
    nrows = Math.ceil(height / celsize) + 1;

    p0 = createVector(random(width), random(height));

    for (var i = 0; i < ncols * nrows; i++) {
      grid.push(undefined);
    }

    insertPoint(grid, p0, celsize, ncols);
    points.push(p0);
    active.push(p0);

    while (active.length > 0) {
      random_index = Math.floor(Math.random() * active.length);
      p = active[random_index];
      found = false;
      for (let tries = 0; tries < k; tries++) {
        theta = Math.random() * 2 * Math.PI;
        new_radius = Math.random() * radius + radius;
        new_point = createVector(p.x + new_radius * Math.cos(theta), p.y + new_radius * Math.sin(theta));

        if (!isValidPoint(grid, new_point, radius, celsize, ncols, nrows)) {
          continue;
        }

        points.push(new_point);
        insertPoint(grid, new_point, celsize, ncols);
        active.push(new_point);
        found = true;
        break;
      }
      if (!found) {
        active.splice(random_index, 1);
      }
    }
    return points;
  }

  function insertPoint(grid, point, celsize, ncols) {
    grid[Math.floor(point.x / celsize) + Math.floor(point.y / celsize) * ncols] = point;
  }

  function isValidPoint(grid, point, radius, celsize, ncols, nrows) {
    if (point.x < 0 || point.x >= width || point.y < 0 || point.y >= height) {
      return false;
    }
    x = Math.floor(point.x / celsize);
    y = Math.floor(point.y / celsize);

    for (let i = Math.max(0, x - 1); i <= Math.min(ncols - 1, x + 1); i++) {
      for (let j = Math.max(0, y - 1); j <= Math.min(nrows - 1, y + 1); j++) {
        if (grid[i + j * ncols] != undefined) {
          if (p5.Vector.dist(grid[i + j * ncols], point) < radius) {
            return false;
          }
        }
      }
    }
    return true;
  }
