@auth.requires_signature()
def add_image():
    s_id = db.images.insert(
        image_url=request.vars.image_url,
    )
    s = db(db.images.id == s_id).select().first()
    return response.json(dict(images=dict( 
        id = s_id,
        image_url=s.image_url
    )))