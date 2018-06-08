# Define your tables below (or better in another model file) for example
#
# >>> db.define_table('mytable', Field('myfield', 'string'))
#
# Fields can be 'string','text','password','integer','double','boolean'
#       'date','time','datetime','blob','upload', 'reference TABLENAME'
# There is an implicit 'id integer autoincrement' field
# Consult manual for more options, validators, etc.

import datetime

db.define_table('boards',
                Field('created_on', 'datetime', default=request.now),
                Field('created_by', default=auth.user.email if auth.user is not None else None),
                Field('image_url'),
                Field('board_price', 'float', default=0.0),
                Field('board_type', 'text'),
                Field('board_tail_type', 'text'),
                Field('num_of_fins', 'integer'),
                Field('board_color', 'text'),
                Field('board_length', 'double'),
                Field('board_width', 'double'),
                Field('board_thickness', 'double'),
                Field('board_volume', 'double'),
                Field('in_cart', 'boolean', default=False),
                )

# after defining tables, uncomment below to enable auditing
# auth.enable_record_versioning(db)
