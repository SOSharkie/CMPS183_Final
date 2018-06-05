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

    self.add_image = function (img_url) {
        $.post(add_image_url,
            {
                image_url: img_url,
            },
            function(data)
            { 
                self.vue.images.push(data.images);
            }
        );
    }

    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            page: 'homepage',
            img_url: null,
            images: [],
        },
        methods: {
            change_page: self.change_page,

            add_image: self.add_image,
        }

    });
    
    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
