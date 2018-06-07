import tempfile
import json

# Cloud-safe of uuid, so that many cloned servers do not all use the same uuids.
from gluon.utils import web2py_uuid
if session.hmac_key is None:
    session.hmac_key = web2py_uuid()

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
            in_cart=r.in_cart,
        )
        boards.append(board)
    logged_in = auth.user is not None
    return response.json(dict(
        boards=boards,
        logged_in = logged_in,
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
        board_volume=s.board_volume,
    )))

def toggle_cart():
    board = db(db.boards.id == request.vars.board_id).select().first()
    board.update_record(in_cart = request.vars.in_cart)
    return "ok"

def delete_board():
	db(db.boards.id == request.vars.board_id).delete()
	return "ok"

def purchase():
    """Ajax function called when a customer orders and pays for the cart."""
    if not URL.verify(request, hmac_key=session.hmac_key):
        raise HTTP(500)
    # Creates the charge.
    try:
        import stripe
    except Exception, e:
        pass
    # Your secret key.
    stripe.api_key = "sk_test_c13DXcRVMAhEZe5DNW6vgLgi"
    token = json.loads(request.vars.transaction_token)
    amount = float(request.vars.amount)
    try:
        charge = stripe.Charge.create(
            amount=int(amount * 100),
            currency="usd",
            source=token['id'],
            description="Purchase",
        )
    except stripe.error.CardError as e:
        logger.info("The card has been declined.")
        logger.info("%r" % traceback.format_exc())
        return "nok"
    return "ok"