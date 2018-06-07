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
    };

    self.change_page = function(new_page) {
        self.vue.page = new_page;
        self.update_board_options();
    };

    self.add_board = function () {
        self.vue.saving_board = true;
        $.post(add_board_url,
            {
                image_url: self.vue.custom_board_url,
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
            function(data) { 
                self.vue.boards.push(data.boards);
                setTimeout(function() {
                    self.vue.saving_board = false;
                    self.vue.just_added_board = true;
                    setTimeout(function() {
                        self.vue.just_added_board = false;
                    }, 5000)
                }, 2000);
            }
        );
    };

    self.delete_board = function(board_idx) {
        $.post(delete_board_url,
            { board_id: self.vue.boards[board_idx].id },
            function () {
                self.vue.boards.splice(board_idx, 1);
            }
        );
    };

    self.update_board_options = function() {
        var price = 0;
        var board_url = '../static/images/surfboards/';

        //color
        if (self.vue.board_color == 'White'){
            price += 20;
            board_url += 'white';
        } else if (self.vue.board_color == 'Red'){
            price += 35;
            board_url += 'red';
        } else if (self.vue.board_color == 'Orange') {
            price += 30;
            board_url += 'orange';
        } else if (self.vue.board_color == 'Yellow'){
            price += 35;
            board_url += 'yellow';
        } else if (self.vue.board_color == 'Green'){
            price += 45;
            board_url += 'green';
        } else if (self.vue.board_color == 'Blue') {
            price += 45;
            board_url += 'blue';
        } else if (self.vue.board_color == 'Purple'){
            price += 50;
            board_url += 'purple';
        } else if (self.vue.board_color == 'Grey'){
            price += 25;
            board_url += 'grey';
        } else if (self.vue.board_color == 'Black'){
            price += 50;
            board_url += 'black';
        }

        //Board type
        if (self.vue.board_type == 'Shortboard'){
            price += 200;
            board_url += '_shortboard.jpg';
        } else if (self.vue.board_type == 'Hybrid'){
            price += 250;
            board_url += '_shortboard.jpg';
        } else if (self.vue.board_type == 'Longboard'){
            price += 300;
            board_url += '_longboard.jpg';
        }
        //Tail type
        if (self.vue.board_tail_type == 'Square'){
            price += 25;
        } else if (self.vue.board_tail_type == 'Pin'){
            price += 30;
        } else if (self.vue.board_tail_type == 'Swallow'){
            price += 35;
        } else if (self.vue.board_tail_type == 'Diamond'){
            price += 40;
        }

        //fins
        price += (self.vue.num_of_fins * 20);
        //length
        price += (self.vue.board_length * 10);
        //volume
        price += (self.vue.board_volume * 2);

        console.log(board_url);
        self.vue.custom_board_url = board_url;
        self.vue.board_price = price;
    }

    self.set_price_filter = function(min, max){
        self.vue.min_price = min;
        self.vue.max_price = max;
        self.get_boards();
    };

    self.set_board_type_filter = function(board_type){
        self.vue.board_type_filter = board_type;
        self.get_boards();
    };

    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            page: 'homepage',
            img_url: null,
            boards: [],

            // Customization options
            board_price: 0,
            board_type: 'Shortboard',
            board_tail_type: 'Square',
            num_of_fins: 3,
            board_color: 'White',
            board_length: 6,
            board_width: 19,
            board_thickness: 2.5,
            board_volume: 30,
            custom_board_url: '../static/images/surfboards/white_shortboard.jpg',
            min_price: 0,
            max_price: 2500,
            board_type_filter: 'All',
            saving_board: false,
            just_added_board: false,
        },
        methods: {
            get_boards: self.get_boards,
            change_page: self.change_page,
            add_board: self.add_board,
            delete_board: self.delete_board,
            update_board_options: self.update_board_options,
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
