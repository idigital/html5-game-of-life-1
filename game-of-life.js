if ( typeof(GameOfLife) === 'undefined' ) var GameOfLife = {};

/**
 * Board that keeps track of state, and applies the rules of
 * the Game of Life to itself.
 */
GameOfLife.board = function($) {

    var generation = 0;
    var rows;
    var cols;
    var board;
    var backBoard;
    var timer;
    var timerSet = false;
    var timeoutMs = 50;

    /**
     * Creates a Trie data structure so we can quckly look up
     * the positions that are alive when we initialize the
     * board.
     */
    var createInitialAliveTrie = function(alive) {
        var trie = {};
        for ( var a = 0; a < alive.length; a++ ) {
            var row = alive[a].row;
            var col = alive[a].column;
            if (! trie[row] ) trie[row] = {};
            trie[row][col] = true;
        }
        return trie;
    };

    /**
     * Creates the board data structure with each dead position
     * set to false, and each live position set to true.
     */
    var createBoard = function(rows, cols, alive) {
        var trie = createInitialAliveTrie(alive);

        var board = new Array(rows);

        for (var r = 0; r < rows; r++) {
            board[r] = new Array(cols);
            for ( var c = 0; c < cols; c++ ) {
                if ( trie[r] && trie[r][c] ) {
                    board[r][c] = true;
                } else {
                    board[r][c] = false;
                }
            }
        }
        return board;
    };

    /**
     * Creates a secondary board that we use to store new
     * alive/dead values at each tick of the simulation.
     * (The boards are then swapped so the back board
     * becomes the current board).
     */
    var createBackBoard = function(rows, cols) {
        var board = new Array(rows);
        for (var r = 0; r < rows; r++) {
            board[r] = new Array(cols);
        }
        return board;
    };

    var swapBoards = function() {
        var tmp = board;
        board = backBoard;
        backBoard = tmp;
    };

    /**
     * Counts how many live neighbors a position has, wrapping
     * around the edges of the board for positions on the edges.
     */
    var countLiveNeighbors = function(row, column, board) {
        var liveNeighborCount = 0;

        // Positions on the edge of the board wrap around
        var prevRow = row > 0 ? row-1 : board.length-1;
        var nextRow = row < board.length-1 ? row+1 : 0;
        var prevCol = column > 0 ? column-1 : board[0].length-1;
        var nextCol = column < board[0].length-1 ? column+1 : 0;

        if ( board[prevRow][prevCol] ) liveNeighborCount += 1;
        if ( board[prevRow][column] ) liveNeighborCount += 1;
        if ( board[prevRow][nextCol] ) liveNeighborCount += 1;
        if ( board[row][prevCol] ) liveNeighborCount += 1;
        if ( board[row][nextCol] ) liveNeighborCount += 1;
        if ( board[nextRow][prevCol] ) liveNeighborCount += 1;
        if ( board[nextRow][column] ) liveNeighborCount += 1;
        if ( board[nextRow][nextCol] ) liveNeighborCount += 1;

        return liveNeighborCount;
    };

    /**
     * Determines if a position should be alive or dead based on
     * the rules of the game.
     */
    var nextValue = function(row, column, board) {
        var liveNeighborCount = countLiveNeighbors(row, column, board);
        var alive = board[row][column];
        if ( alive && liveNeighborCount < 2 ) {
            return false; // Dead due to under-population
        } else if ( alive && liveNeighborCount < 4 ) {
            return true; // Alive because of a sustainable population
        } else if ( !alive && liveNeighborCount == 3 ) {
            return true; // Alive because of reproduction
        } else {
            return false; // Dead for a variety of reasons
        }
    };


    var BoardInterface = {}; // Public functions that can be invoked on the GameOfLife.board.

    /**
     * Advances the board to the next state.
     *
     * @param options Options consisting of:
     *    complete A callback function to invoke when the board
     *             has been updated. The callback will be passed
     *             GameOfLife.board so that it can examine the state
     *             of the board.
     *
     */
    BoardInterface.tick = function(options) {
        options = options || {}
        var complete = options.complete || function() {};
        for ( var r = 0; r < rows; r++ )
            for ( var c = 0; c < cols; c++ )
                backBoard[r][c] = nextValue(r,c,board);
        swapBoards();
        generation += 1;
        if ( typeof(complete) === 'function' ) complete(BoardInterface);
    };

    /**
     * Initializes the board.
     *
     * @param options Board initialization options consisting of:
     *    rows    The number of rows on the board. Defaults to 50.
     *    columns The number of columns on the board. Defaults to 50.
     *    alive   A list of objects - each containing row and column
     *            properties - to initialize the live positions.
     */
    BoardInterface.init = function(options) {
            options = options || {}
            rows = options.rows || 50;
            cols = options.columns || 50;
            alive = options.alive || [];
            board = createBoard(rows, cols, alive);
            backBoard = createBackBoard(rows, cols);
    };

    BoardInterface.numRows = function() {
        return rows;
    };

    BoardInterface.numColumns = function() {
        return cols;
    };

    BoardInterface.generation = function() {
        return generation;
    };

    BoardInterface.at =  function(row, column) {
        return board[row][column];
    };

    BoardInterface.each = function(callback) {
        for ( var r = 0; r < rows; r++ )
            for ( var c = 0; c < cols; c++ )
                if ( typeof(callback) === 'function' )
                    callback(r,c,board[r][c]);
    };

    /**
     * Continually advances the board state.
     *
     * @param options Options consisting of:
     *    complete: A callback function to invoke at the end of each
     *              tick of the board.
     */
    BoardInterface.play = function(options) {

        if ( timerSet ) return;

        timerSet = true;

        function advanceState() {
            BoardInterface.tick({
                complete: function() {
                    if ( typeof(options.tick) === 'function' ) options.tick();
                    timer = setTimeout(advanceState, timeoutMs);
                }
            });
        }

        advanceState();
    };

    /**
     * Pauses advancment of the board state.
     */
    BoardInterface.pause = function() {
        timerSet = false;
        if ( timer ) {
            clearTimeout(timer);
            timer = null;
        }
    };

    BoardInterface.click = function(row, column) {
        if ( timerSet ) return; // Ignore click when game is running.
        board[row][column] = true;
    };

    return BoardInterface;

}(jQuery);


/**
 * Draw the board on an HTML5 canvas.
 */
GameOfLife.canvas = function($) {

    var board;
    var canvas;
    var context;
    var controlsHeight;
    var positionWidth;
    var positionHeight;

    var computeCanvasDimensions = function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - controlsHeight;
    };

    var computePositionDimensions = function() {
        positionWidth = canvas.width / board.numColumns();
        positionHeight = canvas.height / board.numRows();
    };

    var windowResized = function(ci) {
        computeCanvasDimensions();
        computePositionDimensions();
        ci.render();
    };

    var CanvasInterface = {};

    var canvasClicked = function(e) {
        var x = e.pageX;
        var y = e.pageY;
        var offset = $(canvas).offset();
        var row = Math.floor((y-offset.top)/positionHeight);
        var column = Math.floor((x-offset.left)/positionWidth);

        board.click(row, column);

        CanvasInterface.render();
    };

    CanvasInterface.init = function(options) {
        options = options || {};
        canvas = options.el || options.canvas || {};
        context = canvas.getContext('2d');
        board = options.model || options.board || {};
        controlsHeight = $('#controls').height();

        computeCanvasDimensions();
        computePositionDimensions();
        $(window).resize(function() { windowResized(CanvasInterface); });

        $(canvas).click(function(e){
           canvasClicked(e);
        });
    };

    CanvasInterface.render = function() {
        canvas.width = canvas.width; // Forces clearing the canvas
        board.each(function(row, column, alive) {
            if ( alive )
                context.fillRect(column*positionWidth,
                         row*positionHeight,
                         positionWidth,
                         positionHeight );
        });
    };

    return CanvasInterface;

}(jQuery);


/**
 * Some standard automata that can be added to the board.
 */
GameOfLife.automata = function($) {

    return {
       /**
        * Creates a list of alive positions to start a light-weight spaceship
        * automaton at row,column.
        */
        lightWeightSpaceShip: function(row, column) {
            var lwss = [{row: row,   column: column},
                        {row: row,   column: column+3},

                        {row: row+1, column: column+4},

                        {row: row+2, column: column},
                        {row: row+2, column: column+4},

                        {row: row+3, column: column+4},
                        {row: row+3, column: column+3},
                        {row: row+3, column: column+2},
                        {row: row+3, column: column+1}];

            return lwss;
        },

        /**
         * Creates a list of alive positions to start a Gosper's Glider Gun
         * (the smallest gun automaton found so far in Conway's * Game of Life)
         * at row, column.
         */
        gliderGun: function(row, column) {
            var gun = [{row: row,   column: column+24},

                       {row: row+1, column: column+22},
                       {row: row+1, column: column+24},

                       {row: row+2, column: column+12},
                       {row: row+2, column: column+13},
                       {row: row+2, column: column+20},
                       {row: row+2, column: column+21},
                       {row: row+2, column: column+34},
                       {row: row+2, column: column+35},

                       {row: row+3, column: column+11},
                       {row: row+3, column: column+15},
                       {row: row+3, column: column+20},
                       {row: row+3, column: column+21},
                       {row: row+3, column: column+34},
                       {row: row+3, column: column+35},

                       {row: row+4, column: column},
                       {row: row+4, column: column+1},
                       {row: row+4, column: column+10},
                       {row: row+4, column: column+16},
                       {row: row+4, column: column+20},
                       {row: row+4, column: column+21},

                       {row: row+5, column: column},
                       {row: row+5, column: column+1},
                       {row: row+5, column: column+10},
                       {row: row+5, column: column+14},
                       {row: row+5, column: column+16},
                       {row: row+5, column: column+17},
                       {row: row+5, column: column+22},
                       {row: row+5, column: column+24},

                       {row: row+6, column: column+10},
                       {row: row+6, column: column+16},
                       {row: row+6, column: column+24},
                       {row: row+7, column: column+11},
                       {row: row+7, column: column+15},

                       {row: row+8, column: column+12},
                       {row: row+8, column: column+13}];

            return gun;
        }

    };

}(jQuery);
