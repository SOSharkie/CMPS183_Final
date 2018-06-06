def get_boards():
    boards = []
    #rows = db().select(db.boards.ALL)
    if request.vars.board_type != 'All':
        rows = db((db.boards.board_price >= request.vars.min) & (db.boards.board_price <= request.vars.max) & (db.boards.board_type == request.vars.board_type)).select()
    else:
        rows = db((db.boards.board_price >= request.vars.min) & (db.boards.board_price <= request.vars.max)).select()
    for r in rows:
        board = dict(
            id = r.id,
            image_url = r.image_url,
            board_price = r.board_price,
            board_type=r.board_type,
            board_tail_type=r.board_tail_type,
            num_of_fins=r.num_of_fins,
            board_color=r.board_color,
            board_length=r.board_length,
            board_width=r.board_width,
            board_thickness=r.board_thickness,
            board_volume=r.board_volume,
        )
        boards.append(board)
    return response.json(dict(
        boards=boards,
	))

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
        board_volume=request.vars.board_volume,
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

def delete_board():
	"Deletes a board from the table"
	db(db.boards.id == request.vars.board_id).delete()
	return "ok"