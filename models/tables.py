# Define your tables below (or better in another model file) for example
#
# >>> db.define_table('mytable', Field('myfield', 'string'))
#
# Fields can be 'string','text','password','integer','double','boolean'
#       'date','time','datetime','blob','upload', 'reference TABLENAME'
# There is an implicit 'id integer autoincrement' field
# Consult manual for more options, validators, etc.

db.define_table('images',
                Field('created_on', 'datetime', default=request.now),
                Field('image_url'),
                Field('price', 'float', default=0.0),
                )


# after defining tables, uncomment below to enable auditing
# auth.enable_record_versioning(db)
