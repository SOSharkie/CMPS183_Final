// This is the js for the default/index.html view.

var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings

    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    self.change_page = function(new_page) {
        console.log(new_page);
        self.vue.page = new_page;
    }

    self.add_board = function (img_url) {
        $.post(add_board_url,
            {
                image_url: img_url,
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
                console.log(self.vue.boards);
            }
        );
    }

    self.filter_by_price = function(a, b){
        $.get(get_boards_url,
            {
                min: a,
                max: b,
            },
            function(data)
            {
                
            });
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
            board_price: 0,
            board_type: 'Shortboard',
            board_tail_type: 'Square',
            num_of_fins: 3,
            board_color: 'White',
            board_length: 6,
            board_width: 19,
            board_thickness: 2.5,
            board_volume: 30,

        },
        methods: {
            change_page: self.change_page,
            add_boad: self.add_board,
        }

    });

    self.add_board("../static/images/painted_board.JPG");
    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
