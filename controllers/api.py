
@auth.requires_signature()
def add_board():
    s_id = db.boards.insert(
        image_url=request.vars.image_url,
        board_price=request.vars.board_price,
        board_type=request.vars.board_type,
        board_tail_type=request.vars.board_tail_type,
        num_of_fins=request.vars.num_of_fins,
        board_color=request.vars.board_color,
        board_length=request.vars.board_length,
        board_width=request.vars.board_width,
        board_thickness=request.vars.board_thickness,
        board_volume=request.vars.board_volume
    )
    s = db(db.boards.id == s_id).select().first()
    return response.json(dict(boards=dict( 
        id = s_id,
        image_url=s.image_url
        board_price=q.board_price,
        board_type=q.board_type,
        board_tail_type=q.board_tail_type,
        num_of_fins=q.num_of_fins,
        board_color=q.board_color,
        board_length=q.board_length,
        board_width=q.board_width,
        board_thickness=q.board_thickness,
        board_volume=q.board_volume
    )))