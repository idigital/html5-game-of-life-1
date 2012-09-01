$(document).ready(function() {

    test("Tick updates generation count", function() {
        GameOfLife.board.init();
        equal(GameOfLife.board.generation(), 0, "Expected generation to be 0");
        for ( var gen = 1; gen <= 10; gen++ ) {
            GameOfLife.board.tick();
            equal(GameOfLife.board.generation(), gen, "Expected generation to be " + gen);
        }
    });

    module("Board Initialization");


    test("Initialize default 50 x 50 board", function() {
        GameOfLife.board.init();
        equal(GameOfLife.board.numRows(), 50, "Expected 50 rows");
        equal(GameOfLife.board.numColumns(), 50, "Expected 50 columns");
    });


    test("Initialize 10 x 20 board", function() {
        GameOfLife.board.init({ rows: 10, columns: 20 });
        equal(GameOfLife.board.numRows(), 10, "Expected 10 rows");
        equal(GameOfLife.board.numColumns(), 20, "Expected 20 columns");
    });


    test("All board positions initialized dead", function() {
        GameOfLife.board.init({rows: 42, columns: 42 });
        GameOfLife.board.each(function(row, column, alive) {
            strictEqual(alive, false,
                        "Position at row=" + row + ", column=" + column + " should be dead");
        });

    });


    test("Some board positions initialized alive", function() {
        GameOfLife.board.init({ rows: 10, columns: 10,
                                alive: [{row: 1, column: 3},{row: 4, column: 7}] });
        GameOfLife.board.each(function(row, column, alive) {
            if ( row == 1 && column == 3 )
                strictEqual(alive, true,
                            "Position at row=" + row + ", column=" + column + " should be alive");
            else if ( row == 4 && column == 7 )
                strictEqual(alive, true,
                            "Position at row=" + row + ", column=" + column + " should be alive");
            else
                strictEqual(alive, false,
                            "Position at row=" + row + ", column=" + column + " should be dead");
        });
    });


    module("Update Rules");


    test("Live cell with 0 live neighbors dies (under-population)", function() {
        GameOfLife.board.init({rows: 3, columns: 3, alive:[{row: 1, column: 1}] });
        GameOfLife.board.tick({
            complete: function(board) {
                strictEqual(board.at(1,1), false, "Position at row=1, column=1 should be dead");
            }
        });
    });


    test("Live cell with 1 live neighbor dies (under-population)", function() {
        GameOfLife.board.init({rows: 3, columns: 3,
                               alive:[{row: 0, column: 0},{row: 1, column: 1}] });
        GameOfLife.board.tick({
            complete: function(board) {
                strictEqual(board.at(1,1), false, "Position at row=1, column=1 should be dead");
            }
        });
    });


    test("Live cell with 2 live neighbor lives", function() {
        GameOfLife.board.init({rows: 3, columns: 3,
                               alive:[{row: 0, column: 0},{row: 0, column: 1},{row: 1, column: 1}] });
        GameOfLife.board.tick({
            complete: function(board) {
                strictEqual(board.at(1,1), true, "Position at row=1, column=1 should be alive");
            }
        });
    });


    test("Live cell with 3 live neighbors lives", function() {
        GameOfLife.board.init({rows: 3, columns: 3,
                               alive:[{row: 0, column: 0},
                                      {row: 0, column: 1},
                                      {row: 0, column: 2},
                                      {row: 1, column: 1}] });
        GameOfLife.board.tick({
            complete: function(board) {
                strictEqual(board.at(1,1), true, "Position at row=1, column=1 should be alive");
            }
        });
    });


    test("Live cell with 4 live neighbors dies (overcrowding)", function() {
        GameOfLife.board.init({rows: 3, columns: 3,
                               alive:[{row: 0, column: 0},
                                      {row: 0, column: 1},
                                      {row: 0, column: 2},
                                      {row: 1, column: 0},
                                      {row: 1, column: 1}] });
        GameOfLife.board.tick({
            complete: function(board) {
                strictEqual(board.at(1,1), false, "Position at row=1, column=1 should be dead");
            }
        });
    });


    test("Live cell with 5 live neighbors dies (overcrowding)", function() {
        GameOfLife.board.init({rows: 3, columns: 3,
                               alive:[{row: 0, column: 0},
                                      {row: 0, column: 1},
                                      {row: 0, column: 2},
                                      {row: 1, column: 0},
                                      {row: 1, column: 1},
                                      {row: 1, column: 2}] });
        GameOfLife.board.tick({
            complete: function(board) {
                strictEqual(board.at(1,1), false, "Position at row=1, column=1 should be dead");
            }
        });
    });


    test("Live cell with 6 live neighbors dies (overcrowding)", function() {
        GameOfLife.board.init({rows: 3, columns: 3,
                               alive:[{row: 0, column: 0},
                                      {row: 0, column: 1},
                                      {row: 0, column: 2},
                                      {row: 1, column: 0},
                                      {row: 1, column: 1},
                                      {row: 1, column: 2},
                                      {row: 2, column: 0}] });
        GameOfLife.board.tick({
            complete: function(board) {
                strictEqual(board.at(1,1), false, "Position at row=1, column=1 should be dead");
            }
        });
    });


    test("Live cell with 7 live neighbors dies (overcrowding)", function() {
        GameOfLife.board.init({rows: 3, columns: 3,
                               alive:[{row: 0, column: 0},
                                      {row: 0, column: 1},
                                      {row: 0, column: 2},
                                      {row: 1, column: 0},
                                      {row: 1, column: 1},
                                      {row: 1, column: 2},
                                      {row: 2, column: 0},
                                      {row: 2, column: 1}] });
        GameOfLife.board.tick({
            complete: function(board) {
                strictEqual(board.at(1,1), false, "Position at row=1, column=1 should be dead");
            }
        });
    });


    test("Live cell with 8 live neighbors dies (overcrowding)", function() {
        GameOfLife.board.init({rows: 3, columns: 3,
                               alive:[{row: 0, column: 0},
                                      {row: 0, column: 1},
                                      {row: 0, column: 2},
                                      {row: 1, column: 0},
                                      {row: 1, column: 1},
                                      {row: 1, column: 2},
                                      {row: 2, column: 0},
                                      {row: 2, column: 1},
                                      {row: 2, column: 2}] });
        GameOfLife.board.tick({
            complete: function(board) {
                strictEqual(board.at(1,1), false, "Position at row=1, column=1 should be dead");
            }
        });
    });


    test("Dead cell with 0 live neighbors remains dead", function() {
        GameOfLife.board.init({rows: 3, columns: 3});
        GameOfLife.board.tick({
            complete: function(board) {
                strictEqual(board.at(1,1), false, "Position at row=1, column=1 should be dead");
            }
        });
    });


    test("Dead cell with 1 live neighbor remains dead", function() {
        GameOfLife.board.init({rows: 3, columns: 3, alive:[{row: 0, column: 0}] });
        GameOfLife.board.tick({
            complete: function(board) {
                strictEqual(board.at(1,1), false, "Position at row=1, column=1 should be dead");
            }
        });
    });


    test("Dead cell with 2 live neighbors remains dead", function() {
        GameOfLife.board.init({rows: 3, columns: 3,
                               alive:[{row: 0, column: 0},{row: 0, column: 1}] });
        GameOfLife.board.tick({
            complete: function(board) {
                strictEqual(board.at(1,1), false, "Position at row=1, column=1 should be dead");
            }
        });
    });


    test("Dead cell with 3 live neighbors becomes alive (reproduction)", function() {
        GameOfLife.board.init({rows: 3, columns: 3,
                               alive:[{row: 0, column: 0},
                                      {row: 0, column: 1},
                                      {row: 0, column: 2}] });
        GameOfLife.board.tick({
            complete: function(board) {
                strictEqual(board.at(1,1), true, "Position at row=1, column=1 should be alive");
            }
        });
    });


    test("Dead cell with 4 live neighbors remains dead", function() {
        GameOfLife.board.init({rows: 3, columns: 3,
                               alive:[{row: 0, column: 0},
                                      {row: 0, column: 1},
                                      {row: 0, column: 2},
                                      {row: 1, column: 0}] });
        GameOfLife.board.tick({
            complete: function(board) {
                strictEqual(board.at(1,1), false, "Position at row=1, column=1 should be dead");
            }
        });
    });


    test("Dead cell with 5 live neighbors remains dead", function() {
        GameOfLife.board.init({rows: 3, columns: 3,
                               alive:[{row: 0, column: 0},
                                      {row: 0, column: 1},
                                      {row: 0, column: 2},
                                      {row: 1, column: 0},
                                      {row: 1, column: 2}] });
        GameOfLife.board.tick({
            complete: function(board) {
                strictEqual(board.at(1,1), false, "Position at row=1, column=1 should be dead");
            }
        });
    });


    test("Dead cell with 6 live neighbors remains dead", function() {
        GameOfLife.board.init({rows: 3, columns: 3,
                               alive:[{row: 0, column: 0},
                                      {row: 0, column: 1},
                                      {row: 0, column: 2},
                                      {row: 1, column: 0},
                                      {row: 1, column: 2},
                                      {row: 2, column: 0}] });
        GameOfLife.board.tick({
            complete: function(board) {
                strictEqual(board.at(1,1), false, "Position at row=1, column=1 should be dead");
            }
        });
    });


    test("Dead cell with 7 live neighbors remains dead", function() {
        GameOfLife.board.init({rows: 3, columns: 3,
                               alive:[{row: 0, column: 0},
                                      {row: 0, column: 1},
                                      {row: 0, column: 2},
                                      {row: 1, column: 0},
                                      {row: 1, column: 2},
                                      {row: 2, column: 0},
                                      {row: 2, column: 1}] });
        GameOfLife.board.tick({
            complete: function(board) {
                strictEqual(board.at(1,1), false, "Position at row=1, column=1 should be dead");
            }
        });
    });


    test("Dead cell with 8 live neighbors remains dead", function() {
        GameOfLife.board.init({rows: 3, columns: 3,
                               alive:[{row: 0, column: 0},
                                      {row: 0, column: 1},
                                      {row: 0, column: 2},
                                      {row: 1, column: 0},
                                      {row: 1, column: 2},
                                      {row: 2, column: 0},
                                      {row: 2, column: 1},
                                      {row: 2, column: 2}] });
        GameOfLife.board.tick({
            complete: function(board) {
                strictEqual(board.at(1,1), false, "Position at row=1, column=1 should be dead");
            }
        });
    });


    module("Board Wraps Around");


    test("Dead cell on top edge with 3 live neighbors on bottom edge becomes alive (reproduction)", function() {
        GameOfLife.board.init({rows: 3, columns: 3,
                               alive:[{row: 2, column: 0},
                                      {row: 2, column: 1},
                                      {row: 2, column: 2}] });
        GameOfLife.board.tick({
            complete: function(board) {
                strictEqual(board.at(0,1), true, "Position at row=0, column=1 should be alive");
            }
        });
    });


    test("Live cell on left edge with 2 live neighbor on right edge lives", function() {
        GameOfLife.board.init({rows: 3, columns: 3,
                               alive:[{row: 1, column: 0},
                                      {row: 0, column: 2},
                                      {row: 2, column: 2}] });
        GameOfLife.board.tick({
            complete: function(board) {
                strictEqual(board.at(1,0), true, "Position at row=1, column=0 should be alive");
            }
        });
    });



    test("Live cell on top-left corner with 1 live neighbor on bottom-right corner dies (under-population)", function() {
        GameOfLife.board.init({rows: 3, columns: 3,
                               alive:[{row: 0, column: 0},
                                      {row: 2, column: 2}] });
        GameOfLife.board.tick({
            complete: function(board) {
                strictEqual(board.at(1,0), false, "Position at row=0, column=0 should be dead");
            }
        });
    });


});
