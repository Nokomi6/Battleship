/*jslint browser this */
/*global _, player, computer, utils */

(function () {
    "use strict";

    var game = {
        PHASE_INIT_PLAYER: "PHASE_INIT_PLAYER",
        PHASE_INIT_OPPONENT: "PHASE_INIT_OPPONENT",
        PHASE_WHO_INIT: "PHASE_WHO_INIT",
        PHASE_PLAY_PLAYER: "PHASE_PLAY_PLAYER",
        PHASE_PLAY_OPPONENT: "PHASE_PLAY_OPPONENT",
        PHASE_PLAY_OPPONENT_DIFFICULT: "PHASE_PLAY_OPPONENT_DIFFICULT",
        PHASE_GAME_OVER: "PHASE_GAME_OVER",
        PHASE_WAITING: "waiting",

        currentPhase: "",
        phaseOrder: [],
        // garde une référence vers l'indice du tableau phaseOrder qui correspond à la phase de jeu pour le joueur humain
        playerTurnPhaseIndex: 3,

        // l'interface utilisateur doit-elle être bloquée ?
        waiting: false,

        // garde une référence vers les noeuds correspondant du dom
        grid: null,
        miniGrid: null,

        // liste des joueurs
        players: [],

        // lancement du jeu
        init: function () {

            // initialisation
            this.grid = document.querySelector('.board .main-grid');
            this.miniGrid = document.querySelector('.mini-grid');

            // défini l'ordre des phase de jeu
            this.phaseOrder = [
                this.PHASE_INIT_PLAYER,
                this.PHASE_INIT_OPPONENT,
                this.PHASE_WHO_INIT,
                this.PHASE_PLAY_PLAYER,
                this.PHASE_PLAY_OPPONENT,
                this.PHASE_GAME_OVER
            ];
            this.playerTurnPhaseIndex = 3;

            // initialise les joueurs
            this.setupPlayers();

            // ajoute les écouteur d'événement sur la grille
            this.addListeners();

            // c'est parti !
            this.goNextPhase();
        },
        setupPlayers: function () {
            // donne aux objets player et computer une réference vers l'objet game
            player.setGame(this);
            computer.setGame(this);

            // todo : implémenter le jeu en réseaux
            this.players = [player, computer];

            this.players[0].init();
            this.players[1].init();
        },
        goNextPhase: function () {
            // récupération du numéro d'index de la phase courante
            var ci = this.phaseOrder.indexOf(this.currentPhase);
            var self = this;
            let a;

            if (ci !== this.phaseOrder.length - 1) {
                this.currentPhase = this.phaseOrder[ci + 1];
            } else {
                this.currentPhase = this.phaseOrder[0];
            }
            switch (this.currentPhase) {
            case this.PHASE_INIT_PLAYER:
                utils.info("Placez vos bateaux");
                break;
            case this.PHASE_INIT_OPPONENT:
                this.wait();
                utils.info("En attente de votre adversaire");
                this.players[1].isShipOk(function () {
                    self.stopWaiting();
                    self.goNextPhase();
                });
                break;
            case this.PHASE_WHO_INIT:
                let difficult = window.confirm("Si vous confirmez, le mode sera difficile !")
                if(difficult == true){
                    this.difficulty()
                }

                let result = window.confirm("Voulez-vous lancer aléatoirement qui commence")
                if(result == true){
                    let a = Math.floor(Math.random() * 2);
                    if(a == 0){
                        this.goNextPhase();
                    }
                    else {
                    this.currentPhase = this.phaseOrder[this.playerTurnPhaseIndex]
                    this.goNextPhase();
                    }
                } else {
                    let secondChoice = window.confirm("Donc peut-être veux tu commencer ?")
                    if(secondChoice == true){
                        this.goNextPhase();
                    }
                    else{
                    this.currentPhase = this.phaseOrder[this.playerTurnPhaseIndex]
                    this.goNextPhase();
                    }
                };
                break;
            case this.PHASE_PLAY_PLAYER:
                utils.info("A vous de jouer, choisissez une case !");
                // let help = window.confirm("Veux-tu de l'aide ?")

                // if(help == true){
                //     player.help();
                // }
                break;
            case this.PHASE_PLAY_OPPONENT:
                if(this.gameIsOver() == true){
                    return;
                }
                a = 0;
                utils.info("A votre adversaire de jouer...");
                this.players[1].play(a);
                break;
            case this.PHASE_PLAY_OPPONENT_DIFFICULT:
                a = 1;
                utils.info("A votre adversaire de jouer...");
                this.players[1].play(a);
                break;
            case this.PHASE_GAME_OVER:
                // detection de la fin de partie
                if (!this.gameIsOver()) {
                    // le jeu n'est pas terminé on recommence un tour de jeu
                    this.currentPhase = this.phaseOrder[2];
                    this.goNextPhase();
                }
                break;
            }

        },
        gameIsOver: function () {
            let battleship = document.querySelector("body .fleet .battleship");
            let destroyer = document.querySelector("body .fleet .destroyer");
            let submarine = document.querySelector("body .fleet .submarine");
            let small_ship = document.querySelector("body .fleet .small-ship");

            let lifeBattleship = 0;
            let lifeDestroyer = 0;
            let lifeSubmarine = 0;
            let lifeSmall_ship = 0;

            for(let i = 0; i < 10; i++){
                if(computer.grid[i].indexOf(5) != -1){
                    lifeBattleship = lifeBattleship + 1;
                }
                if(computer.grid[i].indexOf(6) != -1){
                    lifeDestroyer = lifeDestroyer + 1;
                }
                if(computer.grid[i].indexOf(7) != -1){
                    lifeSubmarine = lifeSubmarine + 1;
                }
                if(computer.grid[i].indexOf(8) != -1){
                    lifeSmall_ship = lifeSmall_ship + 1;
                }
            }
            let buttonInit = document.getElementById('resetGame');
            if (battleship.classList.contains("sunk") && destroyer.classList.contains("sunk") && submarine.classList.contains("sunk") && small_ship.classList.contains("sunk")){
                utils.info("L'ordinateur a gagné... T'es mauvais !");
                buttonInit.style.display = 'block';
                return true;
            }
            if (lifeBattleship == 0 && lifeDestroyer == 0 && lifeSubmarine == 0 && lifeSmall_ship == 0){
                utils.info("Bravo mon gars !! T'es un champion");
                buttonInit.style.display = 'block';
                return true;
            }
            else {
                return false;
            }
        },
        getPhase: function () {
            if (this.waiting) {
                return this.PHASE_WAITING;
            }
            return this.currentPhase;
        },
        difficulty: function () {
            this.phaseOrder.splice(4, 1, "PHASE_PLAY_OPPONENT_DIFFICULT")
        },
        // met le jeu en mode "attente" (les actions joueurs ne doivent pas être pris en compte si le jeu est dans ce mode)
        wait: function () {
            this.waiting = true;
        },
        // met fin au mode mode "attente"
        stopWaiting: function () {
            this.waiting = false;
        },
        addListeners: function () {
            // on ajoute des acouteur uniquement sur la grid (délégation d'événement)
            this.grid.addEventListener('mousemove', _.bind(this.handleMouseMove, this));
            this.grid.addEventListener('click', _.bind(this.handleClick, this));
            this.grid.addEventListener('contextmenu', _.bind(this.verticality, this)); 
        },
        handleMouseMove: function (e) {
            // on est dans la phase de placement des bateaux
            if (this.getPhase() === this.PHASE_INIT_PLAYER && e.target.classList.contains('cell')) {
                var ship = this.players[0].fleet[this.players[0].activeShip];
                var shipBefore1 = this.players[0].fleet[this.players[0].activeShip - 1];
                var shipBefore2 = this.players[0].fleet[this.players[0].activeShip - 2];
                var shipBefore3 = this.players[0].fleet[this.players[0].activeShip - 3];
                var i = 0;
                var j = 0;
                // si on a pas encore affiché (ajouté aux DOM) ce bateau
                if (!ship.dom.parentNode) {
                    this.grid.appendChild(ship.dom);
                    // passage en arrière plan pour ne pas empêcher la capture des événements sur les cellules de la grille
                    ship.dom.style.zIndex = -1;
                }

                // décalage visuelle, le point d'ancrage du curseur est au milieu du bateau
                if(ship.dom.style.height == "60px"){
                    if(shipBefore1 != undefined && shipBefore2 != undefined && shipBefore3 != undefined){
                        let ship1 = shipBefore1.dom.style.height.substr(0, shipBefore1.dom.style.height.search("p"));
                        let ship2 = shipBefore2.dom.style.height.substr(0, shipBefore2.dom.style.height.search("p"));
                        let ship3 = shipBefore3.dom.style.height.substr(0, shipBefore3.dom.style.height.search("p"));
                        parseInt(ship1);
                        parseInt(ship2);
                        parseInt(ship3);
                        if(ship1 > 60 && ship2 > 60 && ship3 > 60){
                            i = 11;
                        }
                        else if(ship3 > 60 && ship2 > 60 && ship1 == 60){
                            i = 8;
                        } 
                        else if (ship3 == 60 && ship2 > 60 && ship1 > 60 || ship3 > 60 && ship2 == 60 && ship1 > 60) {
                            i = 7;
                        }
                        else if (ship1 == 60 && ship2 > 60 && ship3 == 60 || ship1 == 60 && ship2 == 60 && ship3 > 60) {
                            i = 4;
                        }
                        else if(ship1 > 60 && ship2 == 60 && ship3 == 60){
                            i = 3;
                        }  
                        else {
                            i = 0;
                        }
                    }

                    if(shipBefore1 != undefined && shipBefore2 != undefined && shipBefore3 == undefined){
                        let ship1 = shipBefore1.dom.style.height.substr(0, shipBefore1.dom.style.height.search("p"));
                        let ship2 = shipBefore2.dom.style.height.substr(0, shipBefore2.dom.style.height.search("p"));
                        parseInt(ship1);
                        parseInt(ship2);
                        if(ship1 > 60 && ship2 > 60){
                            i = 8;
                        }
                        else if(ship1 > 60 || ship2 > 60){
                            i = 4;
                        }   
                        else {
                            i = 0;
                        }
                    }

                    if(shipBefore1 != undefined && shipBefore2 == undefined){
                        let ship1 = shipBefore1.dom.style.height.substr(0, shipBefore1.dom.style.height.search("p"));
                        parseInt(ship1);
                        if(ship1 > 60){
                            i = 4;
                        }
                        else {
                            i = 0;
                        }
                    }

                    ship.dom.style.top = "" + (utils.eq(e.target.parentNode)) * utils.CELL_SIZE - (600 + (i * 60) + this.players[0].activeShip * 60) + "px";
                    ship.dom.style.left = "" + utils.eq(e.target) * utils.CELL_SIZE - Math.floor(ship.getLife() / 2) * utils.CELL_SIZE + "px";
                }
                else {
                    if(ship.dom.style.height == "300px" || ship.dom.style.height == "240px" || ship.dom.style.height == "180px"){
                        if(shipBefore1 != undefined && shipBefore2 != undefined && shipBefore3 != undefined){
                            let ship1 = shipBefore1.dom.style.height.substr(0, shipBefore1.dom.style.height.search("p"));
                            let ship2 = shipBefore2.dom.style.height.substr(0, shipBefore2.dom.style.height.search("p"));
                            let ship3 = shipBefore3.dom.style.height.substr(0, shipBefore3.dom.style.height.search("p"));
                            parseInt(ship1);
                            parseInt(ship2);
                            parseInt(ship3);
                            if(ship1 > 60 && ship2 > 60 && ship3 > 60){
                                j = 10;
                            }
                            else if(ship3 > 60 && ship2 > 60 && ship1 == 60){
                                j = 7;
                            } 
                            else if (ship3 == 60 && ship2 > 60 && ship1 > 60 || ship3 > 60 && ship2 == 60 && ship1 > 60) {
                                j = 6;
                            }
                            else if (ship1 == 60 && ship2 > 60 && ship3 == 60 || ship1 == 60 && ship2 == 60 && ship3 > 60) {
                                j = 3;
                            }
                            else if(ship1 > 60 && ship2 == 60 && ship3 == 60){
                                j = 2;
                            }  
                            else {
                                j = -1;
                            }
                        }
    
                        if(shipBefore1 != undefined && shipBefore2 != undefined && shipBefore3 == undefined){
                            let ship1 = shipBefore1.dom.style.height.substr(0, shipBefore1.dom.style.height.search("p"));
                            let ship2 = shipBefore2.dom.style.height.substr(0, shipBefore2.dom.style.height.search("p"));
                            parseInt(ship1);
                            parseInt(ship2);
                            if(ship1 > 60 && ship2 > 60){
                                j = 8  
                            }
                            else if(ship1 > 60 || ship2 > 60){
                                j = 4
                            }   
                            else {
                                j = 0
                            }
                        }
    
                        if(shipBefore1 != undefined && shipBefore2 == undefined){
                            let ship1 = shipBefore1.dom.style.height.substr(0, shipBefore1.dom.style.height.search("p"));
                            parseInt(ship1);
                            if(ship1 > 60){
                                j = 4;
                            }
                            else {
                                j = 0;
                            }
                        }
                    }
                    ship.dom.style.top =  "" + (utils.eq(e.target.parentNode)) * utils.CELL_SIZE - 120 - (600 + (j * 60) + this.players[0].activeShip * 60) + "px";
                    ship.dom.style.left = "" + (utils.eq(e.target)) * utils.CELL_SIZE + "px";
                }
            }
        },
        handleClick: function (e) {
            // self garde une référence vers "this" en cas de changement de scope
            var self = this;
            var ship = this.players[0].fleet[this.players[0].activeShip];
            // si on a cliqué sur une cellule (délégation d'événement)
            if (e.target.classList.contains('cell')) {
                // si on est dans la phase de placement des bateaux
                if (this.getPhase() === this.PHASE_INIT_PLAYER) {
                    // on enregistre la position du bateau, si cela se passe bien (la fonction renvoie true) on continue
                    if(ship.dom.style.height == "60px"){
                        if (this.players[0].setActiveShipPosition(utils.eq(e.target), utils.eq(e.target.parentNode))) {
                            // et on passe au bateau suivant (s'il n'y en plus la fonction retournera false)
                            if (!this.players[0].activateNextShip()) {
                                this.wait();
                                utils.confirm("Confirmez le placement ?", function () {
                                    // si le placement est confirmé
                                    self.stopWaiting();
                                    self.renderMiniMap();
                                    self.players[0].clearPreview();
                                    self.goNextPhase();
                                }, function () {
                                    self.stopWaiting();
                                    // sinon, on efface les bateaux (les positions enregistrées), et on recommence
                                    self.players[0].resetShipPlacement();
                                });
                            }
                        }
                        } else {
                            if (this.players[0].setActiveShipPositionVerticaly(utils.eq(e.target), utils.eq(e.target.parentNode))) {
                                // et on passe au bateau suivant (s'il n'y en plus la fonction retournera false)
                                if (!this.players[0].activateNextShip()) {
                                    this.wait();
                                    utils.confirm("Confirmez le placement ?", function () {
                                        // si le placement est confirmé
                                        self.stopWaiting();
                                        self.renderMiniMap();
                                        self.players[0].clearPreview();
                                        self.goNextPhase();
                                    }, function () {
                                        self.stopWaiting();
                                        // sinon, on efface les bateaux (les positions enregistrées), et on recommence
                                        self.players[0].resetShipPlacement();
                                    });
                                }
                            }
                    }
                // si on est dans la phase de jeu (du joueur humain)
                } else if (this.getPhase() === this.PHASE_PLAY_PLAYER) {
                    this.players[0].play(utils.eq(e.target), utils.eq(e.target.parentNode));
                }
            }
        },
        verticality : function (e) {
            let a = "";
            e.preventDefault();  
            var ship = this.players[0].fleet[this.players[0].activeShip];
            a = ship.dom.style.height
            ship.dom.style.height = ship.dom.style.width;
            ship.dom.style.width = a;
        },
        // fonction utlisée par les objets représentant les joueurs (ordinateur ou non)
        // pour placer un tir et obtenir de l'adversaire l'information de réusssite ou non du tir
        fire: function (from, col, line, callback) {
            this.wait();
            var self = this;
            var msg = "";
            var fire = new Audio('./son/Tir.ogg');
            var miss = new Audio('./son/Miss.ogg');
            var hit = new Audio('./son/Hit.ogg');
            
            fire.play();
            // determine qui est l'attaquant et qui est attaqué
            var target = this.players.indexOf(from) === 0
                ? this.players[1]
                : this.players[0];

            if (this.currentPhase === this.PHASE_PLAY_OPPONENT || this.currentPhase === this.PHASE_PLAY_OPPONENT_DIFFICULT) {
                msg += "Votre adversaire vous a... ";
            }

            // on demande à l'attaqué si il a un bateaux à la position visée
            // le résultat devra être passé en paramètre à la fonction de callback (3e paramètre)
            target.receiveAttack(col, line, function (hasSucceed) {
                if (hasSucceed) {
                    msg += "Touché !";
                    setTimeout(function () {
                        hit.play()
                    }, 800)
                } else {
                    msg += "Manqué...";
                    setTimeout(function () {
                        miss.play()
                    }, 800)
                }

                utils.info(msg);

                // on invoque la fonction callback (4e paramètre passé à la méthode fire)
                // pour transmettre à l'attaquant le résultat de l'attaque
                callback(hasSucceed);

                // on fait une petite pause avant de continuer...
                // histoire de laisser le temps au joueur de lire les message affiché
                setTimeout(function () {
                    self.stopWaiting();
                    self.goNextPhase();
                }, 1000);
            });

        },
        renderMap: function () {
            this.players[0].renderTries(this.grid);
        },
        renderMiniMap: function () {
            let tab;
            let y = 0;
            tab = this.players[0].grid
            tab.forEach(element => {
                let x = 0;
               element.forEach(elem => {
                   if(elem == 1){
                       this.miniGrid.children[y].children[x].style.background = this.players[0].fleet[0].color
                   }
                   if(elem == 2){
                        this.miniGrid.children[y].children[x].style.background = this.players[0].fleet[1].color
                    }
                    if(elem == 3){
                        this.miniGrid.children[y].children[x].style.background = this.players[0].fleet[2].color
                    }
                    if(elem == 4){
                        this.miniGrid.children[y].children[x].style.background = this.players[0].fleet[3].color
                    }
                    x++;
                   })
                   y++;
               });
        }
    };

    let buttonInit = document.getElementById('resetGame');
    buttonInit.addEventListener('click', function () {
        location.reload();
    })

    // point d'entrée
    document.addEventListener('DOMContentLoaded', function () {
        game.init();
    });

}());