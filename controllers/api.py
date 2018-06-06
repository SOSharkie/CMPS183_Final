# def get_boards():
#     boards = []

#     rows = db( (db.boards.price > request.vars.min) & (db.boards.price < request.vars.max) ).select()
#     for i, r in enumerate(rows):
#         b = dict(
#             id = r.id,
#             image_url = r.image_url,
#             price = r.price,
#         )
#         board.append(b)
#     return response.json(dict(
#         boards=boards,
# 	))

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
        image_url=s.image_url,
        board_price=s.board_price,
        board_type=s.board_type,
        board_tail_type=s.board_tail_type,
        num_of_fins=s.num_of_fins,
        board_color=s.board_color,
        board_length=s.board_length,
        board_width=s.board_width,
        board_thickness=s.board_thickness,
        board_volume=s.board_volume
    )))