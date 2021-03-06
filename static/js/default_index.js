// This is the js for the default/index.html view.

var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings

    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    self.update_board_options = function() {
        var price = 0;
        var board_url = '../static/images/surfboards/';

        //color
        if (self.vue.board_color == 'White'){
            price += 10;
            board_url += 'white';
        } else if (self.vue.board_color == 'Red'){
            price += 40;
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
            price += 50;
            board_url += 'blue';
        } else if (self.vue.board_color == 'Purple'){
            price += 60;
            board_url += 'purple';
        } else if (self.vue.board_color == 'Black'){
            price += 60;
            board_url += 'black';
        }

        //Board type
        if (self.vue.board_type == 'Shortboard'){
            price += 100;
            board_url += '_shortboard.jpg';
        } else if (self.vue.board_type == 'Hybrid'){
            price += 250;
            board_url += '_shortboard.jpg';
        } else if (self.vue.board_type == 'Longboard'){
            price += 500;
            board_url += '_longboard.jpg';
        }
        //Tail type
        if (self.vue.board_tail_type == 'Square'){
            price += 25;
        } else if (self.vue.board_tail_type == 'Pin'){
            price += 40;
        } else if (self.vue.board_tail_type == 'Swallow'){
            price += 60;
        } else if (self.vue.board_tail_type == 'Diamond'){
            price += 80;
        }

        //fins
        price += (self.vue.num_of_fins * 20);
        //length
        price += (self.vue.board_length * 10);
        //volume
        price += (self.vue.board_volume * 2);

        self.vue.custom_board_url = board_url;
        self.vue.board_price = price;
    }

    self.get_boards = function(){
        $.get(get_boards_url,
            {
                min: self.vue.min_price,
                max: self.vue.max_price,
                board_type: self.vue.board_type_filter,
                creator_id: self.vue.board_creator_filter,
            }, function(data) {
                self.vue.logged_in = data.logged_in;
                self.vue.boards = data.boards;
                self.vue.boards.sort(function(a, b){return a.board_price - b.board_price;});
                for (var i = 0; i < self.vue.boards.length; i++){
                    var in_cart = false;
                    for (var j = 0; j < self.vue.cart.length; j++){
                        if (self.vue.boards[i].id == self.vue.cart[j].id){
                            self.vue.boards[i].in_cart = true;
                            in_cart = true;
                        }
                    }
                    if (!in_cart && self.vue.boards[i].in_cart){
                        self.vue.boards[i].in_cart = !self.vue.boards[i].in_cart;
                        $.post(toggle_cart_url,
                            {
                                board_id: self.vue.boards[i].id,
                                in_cart: self.vue.boards[i].in_cart
                            },  function () {}
                        );
                    }
                }
                self.get_users();
            });
    };

    self.change_page = function(new_page) {
        self.vue.page = new_page;
        self.update_board_options();
        if (new_page == 'database'){
            self.set_board_creator_filter(-1);
        }if (new_page == 'collection'){
            if (self.vue.logged_in){
                self.set_board_creator_filter(self.vue.current_user.id);
            }
        } else if (new_page == 'cart') {
            self.stripe_instance = StripeCheckout.configure({
            key: 'pk_test_kN2E9pbA1kN5CzoWMkQX8C4g',    //put your own publishable key here
            image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
            locale: 'auto',
            token: function(token, args) {
                console.log('got a token. sending data to localhost.');
                self.stripe_token = token;
                self.customer_info = args;
                self.send_data_to_server();
            }
        });
        }
    };

    self.add_board = function () {
        self.vue.saving_board = true;
        var name = self.vue.current_user.first_name + " " + self.vue.current_user.last_name;
        $.post(add_board_url,
            {
                created_by_id: self.vue.current_user.id,
                created_by_name: name, 
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
                self.get_boards();
            }
        );
    };

    self.delete_board = function(board_idx) {
        $.post(delete_board_url,
            { board_id: self.vue.boards[board_idx].id },
            function () {
                if(self.vue.boards[board_idx].in_cart){
                    var found_idx = 0;
                    for (var i = 0; i < self.vue.cart.length; i++) {
                        if (self.vue.cart[i].id === self.vue.boards[board_idx].id) {
                            found_idx = i;
                        }
                    }
                    self.vue.cart.splice(found_idx, 1);
                    self.vue.cart_total -= self.vue.boards[board_idx].board_price;
                }
                self.vue.boards.splice(board_idx, 1);
            }
        );
    };

    self.set_price_filter = function(min, max){
        self.vue.min_price = min;
        self.vue.max_price = max;
        self.get_boards();
    };

    self.set_board_type_filter = function(board_type){
        self.vue.board_type_filter = board_type;
        self.get_boards();
    };

    self.set_board_creator_filter = function(creator_id){
        self.vue.board_creator_filter = creator_id;
        self.get_boards();
    };

    self.toggle_cart = function(board_idx){
        var board = self.vue.boards[board_idx];
        board.in_cart = !board.in_cart;
        $.post(toggle_cart_url,
            { 
                in_cart: board.in_cart,
                board_id: board.id,
            }, function (data) {
                self.vue.boards.sort(function(a, b){return a.board_price - b.board_price;});
                if(board.in_cart){
                    self.vue.cart.push(board);
                    self.vue.cart_total += board.board_price;
                } else {
                    var found_idx = 0;
                    for (var i = 0; i < self.vue.cart.length; i++) {
                        if (self.vue.cart[i].id === board.id) {
                            found_idx = i;
                        }
                    }
                    self.vue.cart.splice(found_idx, 1);
                    self.vue.cart_total -= board.board_price;
                }
            }
        );
    }

    self.remove_from_cart = function(board_idx){
        var board = self.vue.cart[board_idx];
        board.in_cart = !board.in_cart;
        $.post(toggle_cart_url,
            { 
                in_cart: board.in_cart, 
                board_id: board.id,
            }, function (data) {
                var found_idx = 0;
                    for (var i = 0; i < self.vue.cart.length; i++) {
                        if (self.vue.cart[i].id === board.id) {
                            found_idx = i;
                        }
                    }
                self.vue.cart.splice(found_idx, 1);
                self.vue.cart_total -= board.board_price;
            }
        );
    };

    self.pay = function () {
        self.stripe_instance.open({
            name: "Your nice cart",
            description: "Buy cart content",
            billingAddress: true,
            shippingAddress: true,
            amount: Math.round(self.vue.cart_total * 100),
        });
    };

    self.send_data_to_server = function () {
        console.log("Payment for:", self.customer_info);
        // Calls the server.
        $.post(purchase_url,
            {
                customer_info: JSON.stringify(self.customer_info),
                transaction_token: JSON.stringify(self.stripe_token),
                amount: self.vue.cart_total,
                cart: JSON.stringify(self.vue.cart),
            },
            function (data) {
                // The order was successful.
                self.vue.cart = [];
                for (var i = 0; i < self.vue.boards.length; i++){
                    self.vue.boards[i].in_cart = false;
                    $.post(toggle_cart_url,
                            {
                                board_id: self.vue.boards[i].id,
                                in_cart: self.vue.boards[i].in_cart
                            },  function () {}
                        );
                }
                self.vue.cart_total = 0;
                $.web2py.flash("Thank you for your purchase");
            }
        );
    };

    self.get_users = function () {
        $.getJSON(get_users_url, function (data) {
            self.vue.users = data.users;
            self.vue.current_user = data.current_user;
        })
    };

    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            page: 'homepage',
            logged_in: false,
            current_user: null,
            users: [],
            img_url: null,
            boards: [],
            cart: [],

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
            board_creator_filter: -1,
            saving_board: false,
            just_added_board: false,
            cart_total: 0,
        },
        methods: {
            update_board_options: self.update_board_options,
            get_boards: self.get_boards,
            change_page: self.change_page,
            add_board: self.add_board,
            delete_board: self.delete_board,
            set_price_filter: self.set_price_filter,
            set_board_type_filter: self.set_board_type_filter,
            set_board_creator_filter: self.set_board_creator_filter,
            toggle_cart: self.toggle_cart,
            remove_from_cart: self.remove_from_cart,
            pay: self.pay,
        }

    });

    self.get_boards();
    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
