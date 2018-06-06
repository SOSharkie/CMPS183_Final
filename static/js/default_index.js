// This is the js for the default/index.html view.

var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings

    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    self.get_boards = function(){
        $.get(get_boards_url,
            {
                min: self.vue.min_price,
                max: self.vue.max_price,
                board_type: self.vue.board_type_filter,
            }, function(data)
            {
                self.vue.boards = data.boards;
                console.log(self.vue.boards);
            });
    }

    self.change_page = function(new_page) {
        self.vue.page = new_page;
    }

    self.add_board = function () {
        $.post(add_board_url,
            {
                image_url: "../static/images/stock_board1.jpg",
                board_price: self.vue.board_price,
                board_type: self.vue.board_type,
                board_tail_type: self.vue.board_tail_type,
                num_of_fins: self.vue.num_of_fins,
                board_color: self.vue.board_color,
                board_length: self.vue.board_length,
                board_width: self.vue.board_width,
                board_thickness: self.vue.board_thickness,
                board_volume: self.vue.board_volume,

            },
            function(data)
            { 
                self.vue.boards.push(data.boards);
                //console.log(self.vue.boards);
            }
        );
    }

    self.set_price_filter = function(min, max){
        self.vue.min_price = min;
        self.vue.max_price = max;
        //console.log(self.vue.min_price);
        //console.log(self.vue.max_price);
        self.get_boards();
    }

    self.set_board_type_filter = function(board_type){
        self.vue.board_type_filter = board_type;
        console.log(self.vue.board_type_filter);
        self.get_boards();
    }

    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            page: 'homepage',
            img_url: null,
            boards: [],

            // Customization options
            board_price: 500,
            board_type: 'Shortboard',
            board_tail_type: 'Square',
            num_of_fins: 3,
            board_color: 'White',
            board_length: 6,
            board_width: 19,
            board_thickness: 2.5,
            board_volume: 30,
            min_price: 0,
            max_price: 2500,
            board_type_filter: 'All',
        },
        methods: {
            get_boards: self.get_boards,
            change_page: self.change_page,
            add_board: self.add_board,
            set_price_filter: self.set_price_filter,
            set_board_type_filter: self.set_board_type_filter,
        }

    });

    //self.add_board();
    self.get_boards();
    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
