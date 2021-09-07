/*jslint browser this */
/*global _, shipFactory, player, utils */

(function (global) {
    "use strict";

    var ship = { dom: { parentNode: { removeChild: function () { } } } };

    var player = {
        grid: [],
        tries: [],
        fleet: [],
        game: null,
        activeShip: 0,
        init: function () {
            // créé la flotte
            this.fleet.push(shipFactory.build(shipFactory.TYPE_BATTLESHIP));
            this.fleet.push(shipFactory.build(shipFactory.TYPE_DESTROYER));
            this.fleet.push(shipFactory.build(shipFactory.TYPE_SUBMARINE));
            this.fleet.push(shipFactory.build(shipFactory.TYPE_SMALL_SHIP));

            // créé les grilles
            this.grid = utils.createGrid(10, 10);
            this.tries = utils.createGrid(10, 10);
        },
        play: function (col, line) {
            // appel la fonction fire du game, et lui passe une callback pour récupérer le résultat du tir
            let tableau = document.querySelector('.board .main-grid');
            var node = tableau.querySelector('.row:nth-child(' + (line + 1) + ') .cell:nth-child(' + (col + 1) + ')');

            if (this.tries[line][col] == 0) {
                this.game.fire(this, col, line, _.bind(function (hasSucced) {
                    this.tries[line][col] = hasSucced;
                    if (hasSucced == true) {
                        setTimeout(function () {
                            node.style.backgroundColor = '#e60019';
                        }, 100)
                        setTimeout(function () {
                            node.style.backgroundColor = 'white';
                        }, 200)
                        setTimeout(function () {
                            node.style.backgroundColor = '#e60019';
                        }, 300)
                        setTimeout(function () {
                            node.style.backgroundColor = 'white';
                        }, 400)
                        setTimeout(function () {
                            node.style.backgroundColor = '#e60019';
                        }, 500)
                    }
                    else {
                        setTimeout(function () {
                            node.style.backgroundColor = '#aeaeae';
                        }, 100)
                        setTimeout(function () {
                            node.style.backgroundColor = 'lightblue';
                        }, 200)
                        setTimeout(function () {
                            node.style.backgroundColor = '#aeaeae';
                        }, 300)
                        setTimeout(function () {
                            node.style.backgroundColor = 'lightblue';
                        }, 400)
                        setTimeout(function () {
                            node.style.backgroundColor = '#aeaeae';
                        }, 500)
                    }
                }, this));
                this.renderTries();
            }
            else {
                let msg = "Tu as déjà tiré ici, peut-être tu veux mes LUNETTES !";
                utils.info(msg)
            }
        },
        // quand il est attaqué le joueur doit dire si il a un bateaux ou non à l'emplacement choisi par l'adversaire
        receiveAttack: function (col, line, callback) {
            var succeed = false;

            if (this.grid[line][col] !== 0) {
                succeed = true;
                this.grid[line][col] = 0;
            }
            callback.call(undefined, succeed);
        },
        setActiveShipPosition: function (x, y) {
            var ship = this.fleet[this.activeShip];
            var i = 0;

            if (ship["life"] == 5) {
                if (this.grid[y][x - 2] != 0 || this.grid[y][x - 1] != 0 || this.grid[y][x] != 0 || this.grid[y][x + 1] != 0 || this.grid[y][x + 2] != 0) {
                    return false;
                }
            }
            if (ship["life"] == 4) {
                if (this.grid[y][x - 2] != 0 || this.grid[y][x - 1] != 0 || this.grid[y][x] != 0 || this.grid[y][x + 1] != 0) {
                    return false;
                }
            }
            if (ship["life"] == 3) {
                if (this.grid[y][x - 1] != 0 || this.grid[y][x] != 0 || this.grid[y][x + 1] != 0) {
                    return false;
                }
            }
            if (ship["id"] == 1 || ship["id"] == 2 || ship["id"] == 3) {
                x = x - 2;
            }
            else {
                x = x - 1;
            }

            while (i < ship.getLife()) {
                this.grid[y][x + i] = ship.getId();
                i += 1;
            }

            return true;
        },
        setActiveShipPositionVerticaly: function (x, y) {
            var ship = this.fleet[this.activeShip];
            var i = 0;

            if (ship["life"] == 5) {
                if (this.grid[y - 2][x] != 0 || this.grid[y - 1][x] != 0 || this.grid[y][x] != 0 || this.grid[y + 1][x] != 0 || this.grid[y + 2][x] != 0) {
                    return false;
                }
            }
            if (ship["life"] == 4) {
                if (this.grid[y - 2][x] != 0 || this.grid[y - 1][x] != 0 || this.grid[y][x] != 0 || this.grid[y + 1][x] != 0) {
                    return false;
                }
            }
            if (ship["life"] == 3) {
                if (this.grid[y - 1][x] != 0 || this.grid[y][x] != 0 || this.grid[y + 1][x] != 0) {
                    return false;
                }
            }
            if (ship["id"] == 1 || ship["id"] == 2 || ship["id"] == 3) {
                y = y - 2;
            }
            else {
                y = y - 1;
            }

            while (i < ship.getLife()) {
                this.grid[y + i][x] = ship.getId();
                i += 1;
            }

            return true;
        },
        clearPreview: function () {
            this.fleet.forEach(function (ship) {
                if (ship.dom.parentNode) {
                    ship.dom.parentNode.removeChild(ship.dom);
                }
            });
        },
        resetShipPlacement: function () {
            this.clearPreview();

            this.activeShip = 0;
            this.grid = utils.createGrid(10, 10);
        },
        activateNextShip: function () {
            if (this.activeShip < this.fleet.length - 1) {
                this.activeShip += 1;
                return true;
            } else {
                return false;
            }
        },
        renderTries: function () {
            let tableau = document.querySelector('.board .main-grid');

            this.tries.forEach(function (row, rid) {
                row.forEach(function (val, col) {
                    var node = tableau.querySelector('.row:nth-child(' + (rid + 1) + ') .cell:nth-child(' + (col + 1) + ')');
                    if (val === true) {
                        node.style.backgroundColor = '#e60019';
                        node.classList.add("hit");
                    } else if (val === false) {
                        node.style.backgroundColor = '#aeaeae';
                        node.classList.add("miss");
                    }
                });
            });
        },
        renderShips: function (grid) {
        },
        setGame: function (game) {
            this.game = game;
        },
        isShipOk: function (params) {
        },
        help: function () {
            let grid = document.querySelector('.board .main-grid');

            player.tries.forEach(function (row, rid) {
                let enter = 0;
                row.forEach(function (val, col) {
                    if (val === true) {
                        var nodeBottom = grid.querySelector('.row:nth-child(' + (rid + 2) + ') .cell:nth-child(' + (col + 1) + ')');
                        var nodeTop = grid.querySelector('.row:nth-child(' + (rid) + ') .cell:nth-child(' + (col + 1) + ')');
                        var nodeRight = grid.querySelector('.row:nth-child(' + (rid + 1) + ') .cell:nth-child(' + (col + 2) + ')');
                        var nodeLeft = grid.querySelector('.row:nth-child(' + (rid + 1) + ') .cell:nth-child(' + (col) + ')');
                        if (nodeBottom != undefined) {
                            if (nodeBottom.classList.contains("hit") == false) {
                                if (nodeBottom.classList.contains("miss") == false) {
                                    enter = enter + 1;
                                    this.light(nodeBottom);
                                }
                            }
                        }
                        if (nodeTop != undefined && enter == 0) {
                            if (nodeTop.classList.contains("hit") == false) {
                                if (nodeTop.classList.contains("miss") == false) {
                                    enter = enter + 1;
                                    this.light(nodeTop);
                                }
                            }
                        }
                        if (nodeRight != undefined && enter == 0) {
                            if (nodeRight.classList.contains("hit") == false) {
                                if (nodeRight.classList.contains("miss") == false) {
                                    enter = enter + 1;
                                    this.light(nodeRight);
                                }
                            }
                        }
                        if (nodeLeft != undefined && enter == 0) {
                            if (nodeLeft.classList.contains("hit") == false) {
                                if (nodeLeft.classList.contains("miss") == false) {
                                    this.light(nodeLeft);
                                }
                            }
                        }
                    }
                });
            });
        },
        light: function (node) {
            setTimeout(function () {
                node.style.backgroundColor = 'pink';
            }, 100)
            setTimeout(function () {
                node.style.backgroundColor = 'white';
            }, 200)
            setTimeout(function () {
                node.style.backgroundColor = 'pink';
            }, 300)
            setTimeout(function () {
                node.style.backgroundColor = 'white';
            }, 400)
            setTimeout(function () {
                node.style.backgroundColor = 'pink';
            }, 500)
            setTimeout(function () {
                node.style.backgroundColor = 'white';
            }, 1000)
        }
    };
    global.player = player;

}(this));