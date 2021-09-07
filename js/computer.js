/*jslint browser this */
/*global _, player */

(function (global) {
    "use strict";

    var computer = _.assign({}, player, {
        grid: [],
        tries: [],
        fleet: [],
        game: null,
        play: function (a) {
            if(a == 0){
                var self = this;
                let line = Math.floor(Math.random() * 10);
                let col = Math.floor(Math.random() * 10);
                
                if(this.tries[line][col] != 0) {
                    if(this.tries[line + 1][col] != undefined && this.tries[line + 1][col] == 0){
                        line = line + 1
                    }
                    else if(this.tries[line - 1][col] != undefined && this.tries[line - 1][col] == 0){
                        line = line - 1
                    }
                    else if(this.tries[line][col + 1] != undefined && this.tries[line][col + 1] == 0){
                        col = col + 1
                    }
                    else if(this.tries[line][col - 1] != undefined && this.tries[line][col - 1] == 0){
                        col = col - 1
                    }
                    else if(this.tries[line + 2][col] != undefined && this.tries[line + 2][col] == 0){
                        line = line + 2
                    }
                    else if(this.tries[line - 2][col] != undefined && this.tries[line - 2][col] == 0){
                        line = line - 2
                    }
                    else if(this.tries[line][col + 2] != undefined && this.tries[line][col + 2] == 0){
                        col = col + 2
                    }
                    else if(this.tries[line][col - 2] != undefined && this.tries[line][col - 2] == 0){
                        col = col - 2
                    }
                    else {
                        line = Math.floor(Math.random() * 10);
                        col = Math.floor(Math.random() * 10);
                    }
                }
                setTimeout(function () {
                    self.game.fire(self, col, line, _.bind(function (hasSucced) {
                        self.tries[line][col] = hasSucced;
                            self.renderTries(line, col, hasSucced);
                    }, self));
                }, 2000);
            }
            else {
                // mode difficile
                let miniGrid = document.querySelector('.mini-grid');
                let show = 0;
                self = this;
                
                this.tries.forEach(function (row, rid) {
                    let enter = 0;
                    row.forEach(function (val, col) {
                        if (val === true && show == 0) {

                            let nodeBottom = miniGrid.querySelector('.row:nth-child(' + (rid + 2) + ') .cell:nth-child(' + (rid + 1) + ')');
                            let nodeTop = miniGrid.querySelector('.row:nth-child(' + (rid) + ') .cell:nth-child(' + (rid + 1) + ')');
                            let nodeRight = miniGrid.querySelector('.row:nth-child(' + (rid + 1) + ') .cell:nth-child(' + (rid + 2) + ')');
                            let nodeLeft = miniGrid.querySelector('.row:nth-child(' + (rid + 1) + ') .cell:nth-child(' + (rid) + ')');

                            if(nodeBottom != undefined){
                                if(player.grid[rid + 1][col] =! 0){
                                        console.log("je rentre dans la phase pour tirer une ligne en dessous")
                                        rid = rid + 1;
                                        console.log(rid, col)
                                        setTimeout(function () {
                                            self.game.fire(self, col, rid, _.bind(function (hasSucced) {
                                                self.tries[rid][col] = hasSucced;
                                                    self.renderTries(rid, col, hasSucced);
                                            }, self));
                                        }, 2000);

                                        enter = enter + 1;
                                        show = show + 1;
                                        return 0;
                                }
                            }
                            if(nodeTop != undefined && enter == 0){
                                if(nodeTop.classList.contains("hit") == false && nodeTop.classList.contains("miss") == false){
                                    console.log("je rentre dans la phase pour tirer une ligne au dessus")
                                    rid = rid - 1;
                                    console.log(rid, col)
                                    setTimeout(function () {
                                        self.game.fire(self, col, rid, _.bind(function (hasSucced) {
                                            self.tries[rid][col] = hasSucced;
                                            self.renderTries(rid, col, hasSucced);
                                        }, self));
                                    }, 2000);
                                    enter = enter + 1;
                                    show = show + 1;
                                    return 0;
                                }
                            }
                            if(nodeRight != undefined && enter == 0){
                                if(nodeRight.classList.contains("hit") == false && nodeRight.classList.contains("miss") == false){
                                    console.log("je rentre dans la phase pour tirer une colonne à droite")
                                    col = col + 1;
                                    console.log(rid, col)
                                    setTimeout(function () {
                                        self.game.fire(self, col, rid, _.bind(function (hasSucced) {
                                            self.tries[rid][col] = hasSucced;
                                            self.renderTries(rid, col, hasSucced);
                                        }, self));
                                    }, 2000);
                                    enter = enter + 1;
                                    show = show + 1;
                                    return 0;
                                }
                            }
                            if(nodeLeft != undefined && enter == 0){
                                if(nodeLeft.classList.contains("hit") == false && nodeLeft.classList.contains("miss") == false){
                                    console.log("je rentre dans la phase pour tirer une colonne à gauche")
                                    col = col - 1;
                                    console.log(rid, col)
                                    setTimeout(function () {
                                        self.game.fire(self, col, rid, _.bind(function (hasSucced) {
                                            self.tries[rid][col] = hasSucced;
                                            self.renderTries(rid, col, hasSucced);
                                        }, self));
                                    }, 2000);
                                    show = show + 1;
                                    return 0;
                                }
                            }
                        }
                        
                    });
                });
                    if(show == 0){
                let line = Math.floor(Math.random() * 10);
                let col = Math.floor(Math.random() * 10);
    
                if(this.tries[line][col] != 0) {
                    if(this.tries[line + 1][col] != undefined && this.tries[line + 1][col] == 0){
                        line = line + 1
                    }
                    else if(this.tries[line - 1][col] != undefined && this.tries[line - 1][col] == 0){
                        line = line - 1
                    }
                    else if(this.tries[line][col + 1] != undefined && this.tries[line][col + 1] == 0){
                        col = col + 1
                    }
                    else if(this.tries[line][col - 1] != undefined && this.tries[line][col - 1] == 0){
                        col = col - 1
                    }
                    else {
                        line = Math.floor(Math.random() * 10);
                        col = Math.floor(Math.random() * 10);
                    }
                }
    
                setTimeout(function () {
                    self.game.fire(self, col, line, _.bind(function (hasSucced) {
                        self.tries[line][col] = hasSucced;
                        self.renderTries(line, col, hasSucced);
                    }, self));
                }, 2000);
            }
        }

        },
        isShipOk: function (callback) {

            this.fleet.forEach(function placement(ship) {
                let test = 0;
                let a = Math.floor(Math.random() * 2);

                if(a == 0){
                    // Horizontal
                    let grid = computer.grid;
                    let i = 0;
                    let j = 0;

                    if(ship["life"] == 5){
                        i = Math.floor(Math.random() * 10);
                        j = Math.floor(Math.random() * 6);
                        if(grid[i][j] != 0 || grid[i][j + 1] != 0 || grid[i][j + 2] != 0 || grid[i][j + 3] != 0 || grid[i][j + 4] != 0){
                            placement(ship);
                            return false;
                            }
                    }
                    if(ship["life"] == 4){
                        i = Math.floor(Math.random() * 10);
                        j = Math.floor(Math.random() * 7);
                        if(grid[i][j] != 0 || grid[i][j + 1] != 0 || grid[i][j + 2] != 0 || grid[i][j + 3] != 0){
                            placement(ship)
                            return false;
                        }
                    }
                    if(ship["life"] == 3){
                        i = Math.floor(Math.random() * 10);
                        j = Math.floor(Math.random() * 8);
                        if(grid[i][j] != 0 || grid[i][j + 1] != 0 || grid[i][j + 2] != 0){
                            placement(ship)
                            return false;
                        }
                    }
                    
                    while (test < ship.life) {
                        grid[i][j] = ship.getId();
                        j += 1;
                        test += 1;
                    }
                }
                else {
                    let grid = computer.grid;
                    let i = 0;
                    let j = 0;

                    if(ship["life"] == 5){
                        i = Math.floor(Math.random() * 6);
                        j = Math.floor(Math.random() * 10);
                        if(grid[i][j] != 0 || grid[i + 1][j] != 0 || grid[i + 2][j] != 0 || grid[i + 3][j] != 0 || grid[i + 4][j] != 0){
                            placement(ship)
                            return false;
                        }
                    }
                    if(ship["life"] == 4){
                        i = Math.floor(Math.random() * 7);
                        j = Math.floor(Math.random() * 10);
                        if(grid[i][j] != 0 || grid[i + 1][j] != 0 || grid[i + 2][j] != 0 || grid[i + 3][j] != 0){
                            placement(ship)
                            return false;
                        }
                    }
                    if(ship["life"] == 3){
                        i = Math.floor(Math.random() * 8);
                        j = Math.floor(Math.random() * 10);
                        if(grid[i][j] != 0 || grid[i + 1][j] != 0 || grid[i + 2][j] != 0){
                            placement(ship)
                            return false;
                        }
                    }
                    while (test < ship.life) {
                        grid[i][j] = ship.getId();
                        i += 1;
                        test += 1;
                    }
                }
            }, this);

            //Console log pour savoir où l'ordi pose ses bateaux ! (pour aller + vite)
            console.log(this.grid)
            setTimeout(function () {
                callback();
            }, 500);
        },
        renderTries: function (a, b, succeed) {
            let battleship = document.querySelector("body .fleet .battleship");
            let destroyer = document.querySelector("body .fleet .destroyer");
            let submarine = document.querySelector("body .fleet .submarine");
            let small_ship = document.querySelector("body .fleet .small-ship");

            let miniGrid = document.querySelector('.mini-grid');
            let node = miniGrid.querySelector('.row:nth-child(' + (a + 1) + ') .cell:nth-child(' + (b + 1) + ')');

            let lifeBattleship = 0;
            let lifeDestroyer = 0;
            let lifeSubmarine = 0;
            let lifeSmall_ship = 0;

            if(succeed == false){
                node.classList.add("miss");
            }
            if(succeed == true){
            node.style.backgroundImage = "url('./img/croix.png')";
            node.style.backgroundSize = "cover"
            node.classList.add("hit");
            }

            for(let i = 0; i < 10; i++){
                if(player.grid[i].indexOf(1) != -1){
                    lifeBattleship = lifeBattleship + 1;
                }
                if(player.grid[i].indexOf(2) != -1){
                    lifeDestroyer = lifeDestroyer + 1;
                }
                if(player.grid[i].indexOf(3) != -1){
                    lifeSubmarine = lifeSubmarine + 1;
                }
                if(player.grid[i].indexOf(4) != -1){
                    lifeSmall_ship = lifeSmall_ship + 1;
                }
            }

            if(lifeBattleship == 0){
                if(!battleship.classList.contains('sunk')){
                    battleship.classList.add("sunk");
                }
            }
            if(lifeDestroyer == 0){
                if(!destroyer.classList.contains('sunk')){
                    destroyer.classList.add("sunk");
                }
            }
            if(lifeSubmarine == 0){
                if(!submarine.classList.contains('sunk')){
                    submarine.classList.add("sunk");
                }
            }
            if(lifeSmall_ship == 0){
                if(!small_ship.classList.contains('sunk')){
                    small_ship.classList.add("sunk");
                }
            }
        },
        receiveAttack: function (col, line, callback) {
            var succeed = false;

            if (this.grid[line][col] !== 0) {
                succeed = true;
                this.grid[line][col] = 0;
            }
            callback.call(undefined, succeed);
        }
    });

    global.computer = computer;

}(this));