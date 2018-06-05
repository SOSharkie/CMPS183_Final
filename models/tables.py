# Define your tables below (or better in another model file) for example
#
# >>> db.define_table('mytable', Field('myfield', 'string'))
#
# Fields can be 'string','text','password','integer','double','boolean'
#       'date','time','datetime','blob','upload', 'reference TABLENAME'
# There is an implicit 'id integer autoincrement' field
# Consult manual for more options, validators, etc.

db.define_table('boards',
                Field('created_on', 'datetime', default=request.now),
                Field('image_url'),
                Field('board_price', 'float', default=0.0),
                Field('board_type'),
                Field('board_tail_type'),
                Field('num_of_fins'),
                Field('board_color'),
                Field('board_length'),
                Field('board_width'),
                Field('board_thickness'),
                Field('board_volume')
                )


# after defining tables, uncomment below to enable auditing
# auth.enable_record_versioning(db)
